import mongoose from "mongoose";
import XLSX from "xlsx";
import Student from "../models/Student/student.js";
import Result from "../models/Student/result.js";
import { authorityModel } from "../models/Academic/authorities.js";
import { processResultRow, validateAndPrepareResult, calculateClassRanks } from "../utils/result.js";
import result from "../models/Student/result.js";



export const uploadResults = async (req, res) => {
  try {
    const {
      academicSession,
      examName,
      class: resultClass,
      medium,
      stream,
      maxMarksPerSubject,
    } = req.body;

    /* ---------- Validation ---------- */
    if (
      !academicSession ||
      !examName ||
      !resultClass ||
      !medium ||
      !maxMarksPerSubject
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Academic Session, Exam Name, Class, Medium and Max Marks are required",
      });
    }

    if (!req.file?.buffer) {
      return res.status(400).json({
        success: false,
        message: "Excel file is required",
      });
    }

    /* ---------- Read Excel ---------- */
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    let created = 0;
    const skipped = [];

    /* ---------- Process Rows ---------- */
    for (const [index, rawRow] of rows.entries()) {
      const rowNum = index + 2;

      const result = await processResultRow({
        rawRow,
        academicSession,
        examName,
        resultClass,
        medium,
        stream,
        maxMarksPerSubject,
      });

      if (!result.success) {
        skipped.push({
          row: rowNum,
          registrationNo: result.registrationNo,
          reason: result.reason,
        });
        continue;
      }

      await Result.create({
        registrationNo: result.data.registrationNo,
        academicSession,
        examName,
        class: resultClass,
        medium,
        stream: stream || "",
        marks: result.data.marks,
        maxMarksPerSubject: Number(maxMarksPerSubject),
        canSee: result.data.canSee,
      });

      created++;
    }

    /* ---------- Rank Calculation ---------- */
    if (created > 0) {
      await calculateClassRanks({
        academicSession,
        examName,
        resultClass,
        medium,
        stream,
      });
    }

    return res.status(201).json({
      success: true,
      message: `Successfully processed ${created} results`,
      totalRows: rows.length,
      created,
      skippedCount: skipped.length,
      skippedDetails: skipped,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error during mass upload",
      error: error.message,
    });
  }
};


export const createResult = async (req, res) => {
  try {
    const {
      registrationNo,
      academicSession,
      examName,
      class: resultClass,
      medium,
      stream,
      marks,
      maxMarksPerSubject,
    } = req.body;

    const validation = await validateAndPrepareResult({
      registrationNo,
      academicSession,
      examName,
      resultClass,
      medium,
      stream,
      marks,
      maxMarksPerSubject,
    });

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.reason,
      });
    }

    const result = await Result.create({
      registrationNo,
      academicSession,
      examName,
      class: resultClass,
      medium,
      stream: stream || "",
      marks,
      maxMarksPerSubject: Number(maxMarksPerSubject),
    });

    await calculateClassRanks({
      academicSession,
      examName,
      resultClass,
      medium,
      stream,
    });

    return res.status(201).json({
      success: true,
      message: "Result created successfully",
      result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating result",
      error: error.message,
    });
  }
};




export const getAllResults = async (req, res) => {
  try {
    // Fetch all results
    const results = await Result.find()
      .sort({ createdAt: -1 })
      .lean();

    if (!results.length) {
      return res.status(200).json({
        success: true,
        results: [],
      });
    }

    // Collect registration numbers
    const registrationNos = results.map((r) => r.registrationNo);

    // Fetch all related students in ONE query
    const students = await Student.find({
      registrationNo: { $in: registrationNos },
    }).lean();

    // Create map for fast lookup
    const studentMap = {};
    students.forEach((s) => {
      studentMap[s.registrationNo] = s;
    });

    // Attach student details
    const resultsWithStudentDetails = results.map((r) => ({
      ...r,
      studentDetails: studentMap[r.registrationNo] || null,
    }));

    return res.status(200).json({
      success: true,
      count: resultsWithStudentDetails.length,
      results: resultsWithStudentDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching results",
      error: error.message,
    });
  }
};


export const getSpecificResult = async (req, res) => {
  try {
    const { registrationNo, examName, academicSession } = req.body;

    if (!registrationNo || !examName || !academicSession) {
      return res.status(400).json({
        success: false,
        message:
          "Registration No, Exam Name and Academic Session are required",
      });
    }

    const result = await Result.findOne({
      registrationNo: registrationNo.trim(),
      examName,
      academicSession,
    }).lean();

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "No result found for these details",
      });
    }

    // VISIBILITY CHECK
    if (!result.canSee) {
      return res.status(403).json({
        success: false,
        message:
          "Please pay the fees to see the result. or contact principal.",
      });
    }

    // Fetch student details
    const student = await Student.findOne({
      registrationNo: result.registrationNo,
    }).select("-password");

    // Fetch principal details
    const principal = await authorityModel
      .findOne({ role: "Principal" })
      .select("name signature");

    return res.status(200).json({
      success: true,
      result: {
        ...result,
        studentDetails: student || null,
      },
      principal,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateResultVisibility = async (req, res) => {
  try {
    const { id, canSee } = req.body;

    if (!id || typeof canSee !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Result ID and canSee(boolean) are required",
      });
    }

    const result = await Result.findByIdAndUpdate(
      id,
      { canSee },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Result visibility updated to ${canSee ? "VISIBLE" : "HIDDEN"}`,
      result,
    });
  } catch (error) {
    console.error("Error updating result visibility:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating visibility",
    });
  }
};

// Update result
export const updateResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!result) {
      return res.status(404).json({ success: false, message: "Result not found" });
    }
    await calculateClassRanks({
        academicSession: result.academicSession,
        examName: result.examName,
        resultClass: result.class
    });

    res.status(200).json({
      success: true,
      message: "Result updated and ranks recalculated",
      result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating result",
      error: error.message,
    });
  }
};

// Delete result
export const deleteResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, message: "Result not found" });
    }

    // Recalculate ranks after deletion so the remaining students shift up
    await calculateClassRanks({
        academicSession: result.academicSession,
        examName: result.examName,
        resultClass: result.class
    });

    res.status(200).json({ 
      success: true, 
      message: "Result deleted and ranks updated" 
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting result",
      error: error.message,
    });
  }
};
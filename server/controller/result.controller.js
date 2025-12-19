import mongoose from "mongoose";
import XLSX from "xlsx";
import Student from "../models/Student/student.js";
import Result from "../models/Student/result.js";
import { authorityModel } from "../models/Academic/authorities.js";
import { processResultRow, validateAndPrepareResult, calculateClassRanks } from "../utils/utility.js";


export const massResults = async (req, res) => {
  try {
    const {
      academicSession,
      examName,
      class: resultClass,
      maxMarksPerSubject,
      stream,
    } = req.body;

    if (!academicSession || !examName || !resultClass || !maxMarksPerSubject) {
      return res.status(400).json({
        success: false,
        message: "Academic Session, Exam Name, Class and Max Marks are required",
      });
    }

    if (!req.file?.buffer) {
      return res
        .status(400)
        .json({ success: false, message: "Excel file is required" });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    let created = 0;
    const skipped = [];

    for (const [index, rawRow] of rows.entries()) {
      const rowNum = index + 2;

      const result = await processResultRow({
        rawRow,
        rowNum,
        academicSession,
        examName,
        resultClass,
        maxMarksPerSubject,
      });

      if (!result.ok) {
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
        class: resultClass,
        stream: stream || "",
        examName,
        marks: result.data.marks,
        maxMarksPerSubject: Number(maxMarksPerSubject),
        isDueCleared: result.data.isDueCleared,
      });

      created++;
    }

    if (created > 0) {
      await calculateClassRanks({
        academicSession,
        examName,
        resultClass,
      });
    }

    res.status(201).json({
      success: true,
      message: `Successfully processed ${created} results`,
      totalRows: rows.length,
      created,
      skippedCount: skipped.length,
      skippedDetails: skipped,
    });
  } catch (error) {
    res.status(500).json({
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
      class: resultClass,
      stream,
      examName,
      marks,
      maxMarksPerSubject,
    } = req.body;

    const validation = await validateAndPrepareResult({
      registrationNo,
      academicSession,
      examName,
      resultClass,
      marks,
      maxMarksPerSubject,
    });

    if (!validation.ok) {
      return res.status(400).json({
        success: false,
        message: validation.reason,
      });
    }

    const result = await Result.create({
      registrationNo,
      academicSession,
      class: resultClass,
      stream: stream || "",
      examName,
      marks,
      maxMarksPerSubject: Number(maxMarksPerSubject),
    });

    await calculateClassRanks({
      academicSession,
      examName,
      resultClass,
    });

    res.status(201).json({
      success: true,
      message: "Result created successfully",
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating result",
      error: error.message,
    });
  }
};



// Get all results with student details
export const getAllResults = async (req, res) => {
  try {
    const results = await Result.find().sort({ createdAt: -1 }).lean();

    // Map through results and attach student details based on registrationNo
    const resultsWithStudentDetails = await Promise.all(
      results.map(async (result) => {
        const student = await Student.findOne({ 
          registrationNo: result.registrationNo 
        }).select("-password"); // Exclude sensitive info if applicable
        
        return {
          ...result,
          studentDetails: student || null,
        };
      })
    );

    res.status(200).json(resultsWithStudentDetails);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching results",
      error: error.message,
    });
  }
};



// Fetch a specific result for a student (Public access)
export const getSpecificResult = async (req, res) => {
  try {
    const { registrationNo, examName, academicSession } = req.body;

    // Use findOne because we want a specific result for a specific exam/session
    const result = await Result.findOne({
      registrationNo: registrationNo.trim(),
      examName,
      academicSession
    }).lean();

    if (!result) {
      return res.status(404).json({ success: false, message: "No result found for these details." });
    }

    // Optionally attach student details
    const student = await Student.findOne({ registrationNo: result.registrationNo }).select("-password");

    const principal = await authorityModel.findOne({role: 'Principal'}).select('name signature');

    res.status(200).json({
      success: true,
      result: { ...result, studentDetails: student },
      principal
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
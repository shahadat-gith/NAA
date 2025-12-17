import mongoose from "mongoose";
import XLSX from "xlsx";
import Student from "../models/Student/student.js";
import Admission from "../models/Student/admission.js";
import Result from "../models/Student/result.js";
import { calculateClassRanks } from "../utils/calculateClassRanks.js";


export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error: error.message });
  }
};

// Get student by ID
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: "Error fetching student", error: error.message });
  }
};

// Update student
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json(student);
  } catch (error) {
    res.status(400).json({ message: "Error updating student", error: error.message });
  }
};

// Delete student
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    await Admission.deleteMany({ student: req.params.id });
    await Result.deleteMany({ student: req.params.id });

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting student", error: error.message });
  }
};



/* ================= ADMISSION ================= */

// Single admission
export const createAdmission = async (req, res) => {
  try {
    const {
      name,
      fatherName,
      motherName,
      registrationNo,
      class: studentClass,
      stream,
      medium,
      phone,
      academicSession,
    } = req.body;

    const exists = await Student.findOne({ registrationNo });
    if (exists) {
      return res.status(400).json({ message: "Student already exists" });
    }

    const student = await Student.create({
      name,
      fatherName,
      motherName,
      registrationNo,
      class: studentClass,
      stream,
      medium,
      phone,
    });

    const admission = await Admission.create({
      student: student._id,
      academicSession,
      status: "applied",
    });

    res.status(201).json({
      message: "Admission applied successfully",
      student,
      admission,
    });
  } catch (error) {
    res.status(400).json({ message: "Error applying for admission", error: error.message });
  }
};


// Mass admission via Excel (class-wise)
export const massAdmission = async (req, res) => {
  try {
    const { class: studentClass, medium, stream } = req.body;

    if (!studentClass || !medium) {
      return res.status(400).json({
        message: "Class and Medium are required for mass admission",
      });
    }

    if (!req.file?.buffer) {
      return res.status(400).json({ message: "Excel file is required" });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    let created = 0;
    const skipped = [];

    for (const [index, row] of rows.entries()) {
      const registrationNo = row.registrationNo?.toString().trim();

      if (!registrationNo || !row.name || !row.fatherName || !row.motherName) {
        skipped.push({
          row: index + 2, // Excel row number
          registrationNo: registrationNo || null,
          reason: "Missing required fields",
        });
        continue;
      }

      const exists = await Student.findOne({ registrationNo });
      if (exists) {
        skipped.push({
          row: index + 2,
          registrationNo,
          reason: "Student already exists",
        });
        continue;
      }

      const student = await Student.create({
        name: row.name.toString().trim(),
        fatherName: row.fatherName.toString().trim(),
        motherName: row.motherName.toString().trim(),
        registrationNo,
        class: studentClass,
        medium,
        stream: stream || "",
        phone: row.phone ? row.phone.toString().trim() : "",
      });

      await Admission.create({
        student: student._id,
        academicSession: row.academicSession?.toString().trim(),
        status: "approved",
      });

      created++;
    }

    res.status(201).json({
      message: "Mass admission completed",
      total: rows.length,
      created,
      skippedCount: skipped.length,
      skipped, // send detailed info to frontend
    });
  } catch (error) {
    res.status(400).json({
      message: "Error in mass admission",
      error: error.message,
    });
  }
};




/* ================= RESULTS ================= */

export const massResults = async (req, res) => {
  try {
    const {
      academicSession,
      examName,
      class: resultClass,
      maxMarksPerSubject,
      stream 
    } = req.body;

    if (!academicSession || !examName || !resultClass || !maxMarksPerSubject) {
      return res.status(400).json({
        success: false,
        message: "Academic Session, Exam Name, Class and Max Marks are required",
      });
    }

    if (!req.file?.buffer) {
      return res.status(400).json({ success: false, message: "Excel file is required" });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    let created = 0;
    const skipped = [];

    for (const [index, rawRow] of rows.entries()) {
      const rowNum = index + 2;
      
      // 1. CLEAN THE ROW KEYS 
      // This handles "Registration No", "registrationno", "  registrationNo  " etc.
      const row = {};
      Object.keys(rawRow).forEach(key => {
        const cleanKey = key.toString().trim().toLowerCase();
        row[cleanKey] = rawRow[key];
      });

      // Find the registration number using the cleaned key
      const registrationNo = row["registrationno"]?.toString().trim();

      if (!registrationNo) {
        skipped.push({ row: rowNum, registrationNo: "", reason: "Registration number missing or header 'registrationNo' not found" });
        continue;
      }

      // 2. Validate Student Existence
      const studentExists = await Student.findOne({ registrationNo });
      if (!studentExists) {
        skipped.push({ row: rowNum, registrationNo, reason: "Student not found in database" });
        continue;
      }

      // 3. Prevent Duplicate Results
      const duplicate = await Result.findOne({
        registrationNo,
        academicSession,
        examName,
        class: resultClass
      });
      if (duplicate) {
        skipped.push({ row: rowNum, registrationNo, reason: "Result already exists for this exam" });
        continue;
      }

      // 4. Process Marks
      const marks = [];
      let invalidMark = false;
      let exceededMark = false;
      let errorReason = "";

      // List of keys to ignore (metadata/identifiers)
      const ignoreKeys = ["registrationno", "registration no", "__rownumber", "name", "total", "rank"];

      // Iterate through keys in the CLEANED row
      for (const key of Object.keys(row)) {
        if (ignoreKeys.includes(key)) continue;
        
        const val = row[key];
        if (val === "" || val === null || val === undefined) continue;

        // Check if the mark is a valid number
        const numericMark = Number(val);
        if (isNaN(numericMark)) {
          invalidMark = true;
          errorReason = `Non-numeric mark found in column: ${key}`;
          break;
        }

        if (numericMark > Number(maxMarksPerSubject)) {
          exceededMark = true;
          errorReason = `Mark in column '${key}' (${numericMark}) exceeds Max Marks (${maxMarksPerSubject})`;
          break;
        }

        marks.push({
          subject: key, // Use the key as the subject name
          marksObtained: numericMark,
        });
      }

      if (invalidMark || exceededMark) {
        skipped.push({ row: rowNum, registrationNo, reason: errorReason });
        continue;
      }

      if (marks.length === 0) {
        skipped.push({ row: rowNum, registrationNo, reason: "No subject marks found in this row" });
        continue;
      }

      // 5. Create Result
      await Result.create({
        registrationNo,
        academicSession,
        class: resultClass,
        stream: stream || "",
        examName,
        marks,
        maxMarksPerSubject: Number(maxMarksPerSubject),
      });

      created++;
    }

    // 6. Re-calculate Ranks
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

    // 1. Validation
    if (!registrationNo || !academicSession || !resultClass || !examName || !marks?.length || !maxMarksPerSubject) {
      return res.status(400).json({success: false, message: "All required fields must be provided" });
    }

    const studentExists = await Student.exists({ registrationNo });
    if (!studentExists) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // 2. Duplicate Check
    const existing = await Result.findOne({
      registrationNo,
      academicSession,
      examName,
      class: resultClass,
    });

    if (existing) {
      return res.status(400).json({ success: false, message: "Result already exists for this exam" });
    }

    // 3. Mark Range Validation
    const hasExceeded = marks.some(m => Number(m.marksObtained) > Number(maxMarksPerSubject));
    if (hasExceeded) {
      return res.status(400).json({ success: false, message: `Marks cannot exceed max marks (${maxMarksPerSubject})` });
    }

    // 4. Create Result (Rank is initially null/0, let the calculator handle it)
    const result = await Result.create({
      registrationNo,
      academicSession,
      class: resultClass,
      stream: stream || "",
      examName,
      marks,
      maxMarksPerSubject: Number(maxMarksPerSubject),
    });

    // 5. Re-calculate Ranks
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

    res.status(200).json({
      success: true,
      result: { ...result, studentDetails: student }
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
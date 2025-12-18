import mongoose from "mongoose";
import XLSX from "xlsx";
import Student from "../models/Student/student.js";
import Admission from "../models/Student/admission.js";
import Result from "../models/Student/result.js";
import { normalizeKey } from "../utils/utility.js";


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
    const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    let created = 0;
    const skipped = [];

    for (const [index, rawRow] of rawRows.entries()) {
      /* ============================
         NORMALIZE HEADERS
      ============================ */
      const row = {};
      Object.keys(rawRow).forEach((key) => {
        row[normalizeKey(key)] = rawRow[key];
      });

      const registrationNo = row.registrationno?.toString().trim();

      if (
        !registrationNo ||
        !row.name ||
        !row.fathername ||
        !row.mothername
      ) {
        skipped.push({
          row: index + 2,
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
        fatherName: row.fathername.toString().trim(),
        motherName: row.mothername.toString().trim(),
        registrationNo,
        class: studentClass,
        medium,
        stream: stream || "",
        phone: row.phone ? row.phone.toString().trim() : "",
      });

      await Admission.create({
        student: student._id,
        academicSession: row.academicsession?.toString().trim(),
        status: "approved",
      });

      created++;
    }

    res.status(201).json({
      message: "Mass admission completed",
      total: rawRows.length,
      created,
      skippedCount: skipped.length,
      skipped,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error in mass admission",
      error: error.message,
    });
  }
};



export const SearchStudentsByName = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const students = await Student.find({
      name: { $regex: name.trim(), $options: "i" },
    }).sort({ name: 1 }); // optional: alphabetical order

    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No students found",
        students: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      students,
    });
  } catch (error) {
    console.error("SearchStudentsByName error:", error);

    res.status(500).json({
      success: false,
      message: "Error searching students",
      error: error.message,
    });
  }
};

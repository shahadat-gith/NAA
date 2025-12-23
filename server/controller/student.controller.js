import XLSX from "xlsx";
import mongoose from "mongoose";
import Student from "../models/Student/student.js";
import Admission from "../models/Student/admission.js";
import { authorityModel } from "../models/Academic/authorities.js";
import AdmitCardSettings from "../models/Settings/admitcard.js";
import { generateRegistrationNo, normalizeKey } from "../utils/utility.js";



export const createNewStudentAdmission = async (req, res) => {
  try {
    const {
      name,
      fatherName,
      motherName,
      phone,
      aadhar,
      pan,
      address,
      class: studentClass,
      medium,
      stream,
      academicSession,
    } = req.body;

    /* ---------- VALIDATION ---------- */
    if (!name || !studentClass || !medium || !academicSession) {
      return res.status(400).json({
        success: false,
        message: "Name, class, medium and academic session are required",
      });
    }

    /* ---------- GENERATE REGISTRATION NO ---------- */
    const registrationNo = await generateRegistrationNo();

    /* ---------- CREATE STUDENT ---------- */
    const student = await Student.create({
      name,
      fatherName,
      motherName,
      phone,
      aadhar,
      pan,
      address,
      registrationNo,
      class: studentClass,
      medium,
      stream: stream || "",
      isActive: true,
    });

    /* ---------- CREATE ADMISSION ---------- */
    await Admission.create({
      student: student._id,
      academicSession,
      status: "pending",
      admissionType: "new",
    });

    return res.status(201).json({
      success: true,
      message: "Admission created successfully",
    });

  } catch (error) {
    console.error("Admission error:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating new admission",
      error: error.message,
    });
  }
};



export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({ isActive: true })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: students.length,
      students,
    });

  } catch (error) {
    console.error("getAllStudents error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching students",
      error: error.message,
    });
  }
};



export const getStudentById = async (req, res) => {
  try {
    const { academicSession, type } = req.query;
    const studentId = req.params.id;

    const student = await Student.findById(studentId);
    if (!student || student.isActive === false) {
      return res.status(404).json({
        success: false,
        message: "Student not found or inactive",
      });
    }

    let admission = null;
    if (academicSession) {
      admission = await Admission.findOne({
        student: student._id,
        academicSession,
      });
    }

    /* ---------- OPTIONAL: ADMIT CARD ---------- */
    let principal = null;
    let examIncharge = null;
    let admitCard = null;

    if (type === "admit-card") {
      const [p, e] = await Promise.all([
        authorityModel.findOne({ role: /principal/i }),
        authorityModel.findOne({ role: /exam ic/i }),
      ]);

      principal = p;
      examIncharge = e;

      admitCard = await AdmitCardSettings.findOne({
        class: student.class,
        medium: student.medium,
        stream: student.stream || "",
      });
    }

    return res.status(200).json({
      success: true,
      student,
      admission,
      principal,
      examIncharge,
      admitCard,
    });

  } catch (error) {
    console.error("getStudentById error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching student details",
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
      isActive: true,
    }).sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: students.length,
      students,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error searching students",
      error: error.message,
    });
  }
};



export const getAdmissions = async (req, res) => {
  try {
    const { academicSession } = req.query;

    const admissions = await Admission.find({ academicSession })
      .populate("student")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: admissions.length,
      admissions,
    });

  } catch (error) {
    console.error("getAdmissions error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching admissions",
      error: error.message,
    });
  }
};



export const getAdmissionById = async (req, res) => {
  try {
    const { id: admissionId } = req.query;

    if (!admissionId || !mongoose.Types.ObjectId.isValid(admissionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid admission ID",
      });
    }

    const admission = await Admission.findById(admissionId)
      .populate("student")
      .lean();

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: "Admission not found",
      });
    }

    return res.status(200).json({
      success: true,
      admission,
    });

  } catch (error) {
    console.error("getAdmissionById error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching admission details",
      error: error.message,
    });
  }
};



export const verifyAdmission = async (req, res) => {
  try {
    const { admissionId, status} = req.body;

    if (!admissionId || !mongoose.Types.ObjectId.isValid(admissionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid admission ID ",
      });
    }

    const admission = await Admission.findById(admissionId);
    if (!admission) {
      return res.status(404).json({
        success: false,
        message: "Admission not found",
      });
    }

    if(status === "verify"){
      admission.status = "verified";
    }

    if(status === "reject"){
      admission.status = "rejected";
    }
    await admission.save();

    return res.status(200).json({
      success: true,
      message: "Admission verified successfully",
    });

  } catch (error) {
    console.error("verifyAdmission error:", error);
    return res.status(500).json({
      success: false,
      message: "Error verifying admission",
      error: error.message,
    });
  }
};



export const massAdmission = async (req, res) => {
  try {
    const { academicSession, class: studentClass, medium, stream } = req.body;

    if (!academicSession || !studentClass || !medium) {
      return res.status(400).json({
        success: false,
        message: "Academic session, class and medium are required",
      });
    }

    if (!req.file?.buffer) {
      return res.status(400).json({
        success: false,
        message: "Excel file is required",
      });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    let created = 0;
    let updated = 0;
    const skipped = [];

    for (const [index, rawRow] of rawRows.entries()) {
      const row = {};
      Object.keys(rawRow).forEach((key) => {
        row[normalizeKey(key)] = rawRow[key];
      });

      const registrationNo = row.registrationno?.toString().trim();

      if (!registrationNo) {
        skipped.push({
          row: index + 2,
          reason: "Missing registration number",
        });
        continue;
      }

      let student = await Student.findOne({ registrationNo });

      /* ---------- CREATE OR UPDATE STUDENT ---------- */

      if (!student) {
        student = await Student.create({
          name: row.name?.toString().trim(),
          fatherName: row.fathername?.toString().trim(),
          motherName: row.mothername?.toString().trim(),
          registrationNo,
          dob: row.dob ? new Date(row.dob) : null,
          aadhar: row.aadhar?.toString().trim(),
          phone: row.phone?.toString().trim(),
          class: studentClass,
          medium,
          stream: stream || "",
          isActive: true,
        });

        created++;
      } else {
        student.class = studentClass;
        student.medium = medium;
        student.stream = stream || "";
        await student.save();

        updated++;
      }

      /* ---------- ADMISSION HISTORY ---------- */
      const alreadyAdmitted = await Admission.findOne({
        student: student._id,
        academicSession,
      });

      if (!alreadyAdmitted) {
        await Admission.create({
          student: student._id,
          academicSession,
          status: "verified",
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: "Mass admission completed successfully",
      total: rawRows.length,
      created,
      updated,
      skippedCount: skipped.length,
      skipped,
    });

  } catch (error) {
    console.error("Mass admission error:", error);
    return res.status(500).json({
      success: false,
      message: "Error in mass admission",
      error: error.message,
    });
  }
};

import XLSX from "xlsx";
import mongoose from "mongoose";
import Student from "../models/Student/student.js";
import Admission from "../models/Student/admission.js";
import Dues from "../models/Student/dues.js";

import { authorityModel } from "../models/Academic/authorities.js";
import AdmitCardSettings from "../models/Settings/admitcard.js";
import { generateRegistrationNo, normalizeKey } from "../utils/utility.js";
import { getAmountForClass } from "../utils/utility.js";
import Payment from "../models/Student/payment.js";


export const createNewStudentAdmission = async (req, res) => {
  try {
    const {
      name,
      fatherName,
      motherName,
      phone,
      aadhar,
      address,
      class: studentClass,
      medium,
      stream,
      academicSession,
    } = req.body;

    /* ================= VALIDATION ================= */
    if (!name || !studentClass || !medium || !academicSession) {
      return res.status(400).json({
        success: false,
        message: "Name, class, medium and academic session are required",
      });
    }

    /* ================= GENERATE REGISTRATION NO ================= */
    const registrationNo = await generateRegistrationNo();

    /* ================= CREATE STUDENT ================= */
    const student = await Student.create({
      name,
      fatherName,
      motherName,
      phone,
      aadhar,
      address,
      registrationNo,
      class: studentClass,
      medium,
      stream: stream || "",
      isActive: true,
    });

    /* ================= CREATE ADMISSION ================= */
    await Admission.create({
      student: student._id,
      academicSession,
      status: "pending",
      admissionType: "new",
      isAdmissionFeePaid: false,
    });

    const admissionFeeAmount = await getAmountForClass(
      studentClass,
      medium,
      "admissionFee",
      stream
    );

    /* ================= CREATE ADMISSION FEE DUE ================= */
    await Dues.findOneAndUpdate(
      { student: student._id, type: "admissionFee" },
      {
        student: student._id,
        type: "admissionFee",
        dueAmount: admissionFeeAmount, 
      },
      { upsert: true }
    );

    /* ================= RESPONSE ================= */
    return res.status(201).json({
      success: true,
      message: "New student admission created successfully",
      studentId: student._id,
      registrationNo: student.registrationNo,
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


export const massAdmission = async (req, res) => {
  try {
    const { academicSession, class: studentClass, medium, stream } = req.body;

    if (!academicSession || !studentClass || !medium) {
      return res.status(400).json({
        message: "Academic session, class and medium are required",
      });
    }

    if (!req.file?.buffer) {
      return res.status(400).json({ message: "Excel file is required" });
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

      /* ================= CREATE OR UPDATE STUDENT ================= */

      if (!student) {
        // 🆕 Create student (first-time feed)
        student = await Student.create({
          name: row.name?.toString().trim(),
          fatherName: row.fathername?.toString().trim(),
          motherName: row.mothername?.toString().trim(),
          registrationNo,
          dob: row.dob ? new Date(row.dob) : null,
          aadhar: row.aadhar?.toString().trim(),
          phone: row.phone?.toString().trim(),
          address: row.address?.toString().trim(),
          class: studentClass,
          medium,
          stream: stream || "",
          academicSession,
          admissionType: "new",
          isActive: true,
        });

        created++;
      } else {
        // 🔄 Update existing student
        student.class = studentClass;
        student.medium = medium;
        student.stream = stream || "";
        student.academicSession = academicSession;
        student.admissionType = "existing";
        await student.save();

        updated++;
      }

      /* ================= ADMISSION HISTORY ================= */

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

    res.status(201).json({
      success: true,
      message: "Mass admission completed successfully",
      total: rawRows.length,
      created,
      updated,
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

export const getStudentById = async (req, res) => {
  try {
    const { academicSession, type } = req.query;
    const studentId = req.params.id;

    /* ================= STUDENT ================= */
    const student = await Student.findById(studentId);
    if (!student || student.isActive === false) {
      return res.status(404).json({
        success: false,
        message: "Student not found or inactive",
      });
    }

    /* ================= ADMISSION ================= */
    let admission = null;

    if (academicSession) {
      admission = await Admission.findOne({
        student: student._id,
        academicSession,
      });
    }

    /* ================= DUES ================= */
    const dues = await Dues.find({ student: student._id });

    /* ================= OPTIONAL (ADMIT CARD) ================= */
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

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      student,
      admission,       // current admission (session-based)
      dues,            // all dues (admission + monthly)
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

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching students",
      error: error.message,
    });
  }
};


export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({ isActive: true })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error("getAllStudents error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching students",
      error: error.message,
    });
  }
};



export const getAdmissions = async (req, res) => {
  try {
    const admissions = await Admission.find({academicSession: req.query.academicSession})
      .populate("student")
      .sort({ createdAt: -1 });

    res.status(200).json({success: true, count: admissions.length, admissions,});

  }catch (error) {
    console.error("getAdmissions error:", error);
    res.status(500).json({success: false, message: "Error fetching admissions", error: error.message,});
  }
};




export const getAdmissionById = async (req, res) => {
  try {
    const { id: admissionId } = req.query;

    /* ---------- VALIDATE ID ---------- */
    if (!admissionId || !mongoose.Types.ObjectId.isValid(admissionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid admission ID",
      });
    }

    /* ---------- FETCH ADMISSION ---------- */
    const admission = await Admission.findById(admissionId)
      .populate("student")
      .lean();

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: "Admission not found",
      });
    }

    /* ---------- FETCH DUES & PAYMENTS ---------- */
    const [dues, payments] = await Promise.all([
      Dues.find({ student: admission.student._id }).lean(),
      Payment.find({ student: admission.student._id }).lean(),
    ]);

    return res.status(200).json({
      success: true,
      admission,
      dues,
      payments,
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


export const verifyAdmission = async (req, res) =>{
  try {
    const { admissionId, studentId, registrationNo } = req.body;

    /* ---------- VALIDATE INPUTS ---------- */
    if (!admissionId || !mongoose.Types.ObjectId.isValid(admissionId) || !studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid admission ID or student ID",
      });
    }
    if (!registrationNo || !registrationNo.trim()) {
      return res.status(400).json({
        success: false,
        message: "Registration number is required",
      });
    }
    /* ---------- FETCH ADMISSION ---------- */
    const admission = await Admission.findById(admissionId);
    if (!admission) {
      return res.status(404).json({
        success: false,
        message: "Admission not found",
      });
    }
    /* ---------- UPDATE ADMISSION & STUDENT ---------- */
    admission.status = "verified";
    await admission.save();
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }
    student.registrationNo = registrationNo.trim();
    await student.save();
    /* ---------- RESPONSE ---------- */
    return res.status(200).json({
      success: true,
      message: "Admission verified and registration number assigned successfully",
    });
  } catch (error) {
    console.error("verifyAdmission error:", error);
    return res.status(500).json({
      success: false,
      message: "Error verifying admission",
      error: error.message,
    });
  }
}

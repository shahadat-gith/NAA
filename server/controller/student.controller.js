import XLSX from "xlsx";
import mongoose from "mongoose";
import Student from "../models/Student/student.js";
import Admission from "../models/Student/admission.js";
import { authorityModel } from "../models/Academic/authorities.js";
import AdmitCardSettings from "../models/Settings/admitcard.js";
import { generateRegistrationNo, getRegistrationNo } from "../utils/utility.js";



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

export const deleteStudent = async (req, res)=>{
  try {
    const {id} = req.params;
    if(!id || !mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }
    const student = await Student.findByIdAndDelete(id);
    if(!student){
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting student",
      error: error.message,
    });
  }
}


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





/* ================= HELPERS ================= */
const setNestedValue = (obj, path, value) => {
  const keys = path.split(".");
  let current = obj;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (i === keys.length - 1) {
      current[key] = value;
    } else {
      current[key] = current[key] || {};
      current = current[key];
    }
  }
};

/* ================= MASS ADMISSION ================= */
export const massAdmission = async (req, res) => {
  try {
    const { class: studentClass, medium, stream = "" } = req.body;

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    const students = [];
    let rollNo = 1; // starts from 001

    for (const rawRow of rows) {
      const student = {};

      // Dynamic Excel → Schema mapping
      for (const [key, value] of Object.entries(rawRow)) {
        if (!value) continue;

        const finalValue =
          typeof value === "string" ? value.trim() : value;

        if (key.includes(".")) {
          setNestedValue(student, key, finalValue);
        } else {
          student[key] = finalValue;
        }
      }

      // Force controlled fields
      student.class = studentClass;
      student.medium = medium;
      student.stream = stream;
      student.isActive = true;
      
      // Auto-generate registration number
      student.registrationNo = getRegistrationNo({
        studentClass,
        medium,
        rollNo,
      });

      rollNo++;

      students.push(student);
    }

    // Bulk insert (single DB call)
    await Student.insertMany(students);

    return res.status(201).json({
      success: true,
      message: "Students migrated successfully",
      total: students.length,
    });
  } catch (error) {
    console.error("Mass admission error:", error);
    return res.status(500).json({
      success: false,
      message: "Migration failed",
      error: error.message,
    });
  }
};


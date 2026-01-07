import XLSX from "xlsx";
import mongoose from "mongoose";
import Student from "../models/Student/student.js";
import Admission from "../models/Student/admission.js";
import { authorityModel } from "../models/Academic/authorities.js";
import AdmitCardSettings from "../models/Settings/admitcard.js";
import { generateRegistrationNo, getRegistrationNo } from "../utils/utility.js";



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




export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
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
export const addMassStudents = async (req, res) => {
  try {
    const { class: studentClass, medium, stream = "" } = req.body;

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    const students = [];
    let rollNo = 1;

    for (const rawRow of rows) {
      const student = {};

      for (const [key, value] of Object.entries(rawRow)) {
        if (value === "" || value === null || value === undefined) continue;

        let finalValue = value;

        // ✅ keep DOB exactly as in Excel
        if (key !== "dob" && typeof value === "string") {
          finalValue = value.trim().toLowerCase();
        }

        if (key.includes(".")) {
          setNestedValue(student, key, finalValue);
        } else {
          student[key] = finalValue;
        }
      }

      // Controlled fields
      student.class = studentClass;
      student.medium = medium;
      student.stream = stream;
      student.isActive = true;

      // Registration No
      student.registrationNo = getRegistrationNo({
        studentClass,
        medium,
        rollNo,
        stream,
      });

      rollNo++;
      students.push(student);
    }

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


const toLower = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : value;


export const addSingleStudent = async (req, res) => {
  try {
    const {
      name,
      fatherName,
      motherName,
      dob,
      gender,
      phone,
      registrationNo,
      aadhar,
      pen,
      class: studentClass,
      medium,
      stream,

      // Address fields
      village,
      postOffice,
      policeStation,
      district,
      state,
      pincode,
    } = req.body;

    const student = await Student.create({
      /* BASIC */
      name: toLower(name),
      class:studentClass,
      medium: toLower(medium),
      stream: toLower(stream) || "",

      /* PERSONAL */
      fatherName: toLower(fatherName),
      motherName: toLower(motherName),
      dob, 
      gender: toLower(gender),
      phone: phone?.trim(),

      /* ACADEMIC */
      registrationNo,
      aadhar: aadhar?.trim(),
      pen: pen?.trim(),

      /* ADDRESS */
      address: {
        village: toLower(village),
        postOffice: toLower(postOffice),
        policeStation: toLower(policeStation),
        district: toLower(district),
        state: toLower(state),
        pincode: pincode?.trim(),
      },
    });

    return res.status(201).json({
      success: true,
      message: "Student added successfully",
    });
  } catch (error) {
    console.error("student adding error:", error);
    return res.status(500).json({
      success: false,
      message: "Error adding student",
      error: error.message,
    });
  }
};


export const promoteStudents = async (req, res) => {
  try {
    const {
      class: studentClass,
      medium,
      stream = "",
      nextClass,
    } = req.body;

    if (!studentClass || !medium || !nextClass) {
      return res.status(400).json({
        success: false,
        message: "class, medium and nextClass are required",
      });
    }

    const normalizedClass = studentClass.toString().toLowerCase();
    const normalizedNextClass = nextClass.toString().toLowerCase();
    const normalizedMedium = medium.toLowerCase();
    const normalizedStream = stream.toLowerCase();

    /* ================= FILTER ================= */

    const filter = {
      class: normalizedClass,
      medium: normalizedMedium,
      isActive: true,
    };

    // Stream filter only for 11 / 12
    if (["11", "12"].includes(normalizedClass)) {
      if (!normalizedStream) {
        return res.status(400).json({
          success: false,
          message: "Stream is required for class 11 and 12",
        });
      }
      filter.stream = normalizedStream;
    }

    /* ================= UPDATE DATA ================= */

    const updateData = {
      class: normalizedNextClass,
    };

    // Class 10 → 11 : stream MUST be set
    if (normalizedClass === "10" && normalizedNextClass === "11") {
      if (!normalizedStream) {
        return res.status(400).json({
          success: false,
          message: "Stream is required when promoting to class 11",
        });
      }
      updateData.stream = normalizedStream;
    }

    // 11 → 12 : keep same stream
    if (normalizedClass === "11" && normalizedNextClass === "12") {
      updateData.stream = normalizedStream;
    }

    // Any other promotion → remove stream
    if (!["11", "12"].includes(normalizedNextClass)) {
      updateData.stream = "";
    }

    /* ================= PROMOTE ================= */

    const result = await Student.updateMany(filter, {
      $set: updateData,
    });

    return res.status(200).json({
      success: true,
      message: "Students promoted successfully",
      promotedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("student promotion error:", error);
    return res.status(500).json({
      success: false,
      message: "Error promoting students",
      error: error.message,
    });
  }
};




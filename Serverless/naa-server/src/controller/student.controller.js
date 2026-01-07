import XLSX from "xlsx";
import mongoose from "mongoose";
import Student from "../models/Student/student.js";
import Admission from "../models/Student/admission.js";
import { authorityModel } from "../models/Academic/authorities.js";
import AdmitCardSettings from "../models/Settings/admitcard.js";



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




const CLASS_OPTIONS = {
  english: ["nursery", "kg", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  assamese: [
    "ankur",
    "mukul",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ],
};



/* ================= REG NO GENERATOR ================= */

const getRegistrationNo = ({
  studentClass,
  medium,
  sequence,
  stream = "",
}) => {
  const PREFIX = "NAA26";

  const normalizedClass = studentClass.toString().toLowerCase();
  const normalizedMedium = medium.toLowerCase();
  const normalizedStream = stream.toLowerCase();

  const mediumCode = normalizedMedium === "english" ? "E" : "A";

  const classList = CLASS_OPTIONS[normalizedMedium];
  if (!classList) throw new Error("Invalid medium");

  const classIndex = classList.indexOf(normalizedClass);
  if (classIndex === -1)
    throw new Error("Invalid class for selected medium");

  const classCode = String(classIndex).padStart(2, "0");
  const seqCode = String(sequence).padStart(3, "0");

  let streamCode = "";
  if (normalizedClass === "11" || normalizedClass === "12") {
    if (normalizedStream === "arts") streamCode = "A";
    else if (normalizedStream === "science") streamCode = "S";
    else throw new Error("Invalid stream for class 11 or 12");
  }

  return `${PREFIX}${classCode}${seqCode}${mediumCode}${streamCode}`;
};


export const addMassStudents = async (req, res) => {
  try {
    const { class: studentClass, medium, stream = "" } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Excel file required" });
    }

    /* ---------- READ EXCEL ---------- */
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    if (!rows.length) {
      return res
        .status(400)
        .json({ success: false, message: "Excel file is empty" });
    }

    /* ---------- PREPARE STUDENTS ---------- */
    const students = rows.map((row, index) => {
      const sequence = index + 1;

      const registrationNo = getRegistrationNo({
        studentClass,
        medium,
        stream,
        sequence,
      });

      // 🔥 normalize row values (lowercase)
      const normalizedRow = Object.fromEntries(
        Object.entries(row).map(([key, value]) => [
          key,
          typeof value === "string" ? value.trim().toLowerCase() : value,
        ])
      );

      return {
        ...normalizedRow,
        class: studentClass.toString().toLowerCase(),
        medium: medium.toLowerCase(),
        stream: stream.toLowerCase(),
        registrationNo, 
      };
    });

    /* ---------- INSERT ---------- */
    await Student.insertMany(students);

    res.status(201).json({
      success: true,
      message: "Students admitted successfully",
      total: students.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Mass Addition failed",
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




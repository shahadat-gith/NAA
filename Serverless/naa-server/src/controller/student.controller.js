import XLSX from "xlsx";
import mongoose from "mongoose";
import Student from "../models/Student/student.js";
import { authorityModel } from "../models/Academic/authorities.js";
import AdmitCard from "../models/Settings/admitcard.js";
import Exam from "../models/Settings/exam.js";
import ServiceSettings from "../models/Settings/services.js";
import TemporaryFile from "../models/Student/tempFile.js";
import { uploadToCloudinary } from "../config/cloudinary.js";


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
    const { id: studentId } = req.params;

    const student = await Student.findOne({
      _id: studentId,
      isActive: true,
    }).lean();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found or inactive",
      });
    }

    const tempImage = await TemporaryFile.findOne({ studentId }).lean();
    if (!student?.image?.url && tempImage) {
      student.image = tempImage;
    }else{
      student.image = student.image || null;
    }


    /* ---------- PARALLEL QUERIES ---------- */
    const [principal, admitCard, examDetails, services] = await Promise.all([
      authorityModel
        .findOne({ role: /principal/i })
        .select("name designation signature")
        .lean(),

      AdmitCard.findOne({
        class: student.class,
        medium: student.medium,
        stream: student.stream || "",
      }).lean(),

      Exam.findOne().lean(),
      ServiceSettings.findOne().lean(),
    ]);

    return res.status(200).json({
      success: true,
      student,
      principal,
      admitCard,
      examDetails,
      services,
    });
  } catch (error) {
    console.error("getStudentById error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching student details",
    });
  }
};


export const SearchStudent = async (req, res) => {
  try {
    const { registrationNo } = req.body;

    if (!registrationNo || !registrationNo.trim()) {
      return res.status(400).json({
        success: false,
        message: "Registration number is required",
      });
    }

    const student = await Student.findOne({
      registrationNo,
      isActive: true,
    }).lean();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      studentId: student._id,
    });

  } catch (error) {
    console.error("SearchStudentByRegNo error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching student",
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
      address,
    } = req.body;

    const student = await Student.create({
      /* BASIC */
      name,
      class: studentClass,
      medium,
      stream: stream || "",

      /* PERSONAL */
      fatherName,
      motherName,
      dob,
      gender,
      phone,

      /* ACADEMIC */
      registrationNo,
      aadhar,
      pen,

      /* ADDRESS */
      address: {
        village: address?.village || "",
        postOffice: address?.postOffice || "",
        policeStation: address?.policeStation || "",
        district: address?.district || "",
        state: address?.state || "",
        pincode: address?.pincode || "",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Student added successfully",
      student,
    });
  } catch (error) {
    console.error("student adding error:", error);

    // duplicate registration no
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Registration number already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error adding student",
    });
  }
};


export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Whitelisted editable fields
    const allowedFields = [
      "name",
      "fatherName",
      "motherName",
      "dob",
      "gender",
      "phone",
      "aadhar",
      "class",
      "medium",
      "stream",
      "address",
    ];

    const updatedData = {};

    // ✅ Pick only allowed fields
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updatedData[field] = req.body[field];
      }
    }

    const student = await Student.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      student,
    });
  } catch (error) {
    console.error("Update student error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update student",
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


export const toggleAdmitCardPermission = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }
    student.canDownloadAdmitCard = !student.canDownloadAdmitCard;
    await student.save();
    return res.status(200).json({
      success: true,
      message: "Admit card permission updated",
      canDownloadAdmitCard: student.canDownloadAdmitCard,
    });
  } catch (error) {
    console.error("toggleAdmitCardPermission error:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating admit card permission",
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

export const uploadTempProfilePicture = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    const result = await uploadToCloudinary(
      req.file.buffer,
      "naa_temp_profile_pictures"
    );

    const temporaryFile = new TemporaryFile({
      studentId: id,
      public_id: result.public_id,
      url: result.secure_url,
    });

    await temporaryFile.save();


    res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully",
      data: temporaryFile,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Profile picture upload failed",
      error: error.message,
    });
  }
};

export const acceptProfilePicture = async (req, res) => {
  try {
    const { studentId, accepted } = req.body;

    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const temporaryFile = await TemporaryFile.findOne({ studentId });
    if (!temporaryFile) {
      return res.status(404).json({
        success: false,
        message: "Picture not found",
      });
    }

    if (accepted) {
      await Student.findByIdAndUpdate(studentId, {
        image: {
          url: temporaryFile.url,
          public_id: temporaryFile.public_id,
        },
      });
    }

    await cloudinary.uploader.destroy(temporaryFile.public_id);
    await temporaryFile.remove();

    res.status(200).json({
      success: true,
      message: accepted ? "Profile picture accepted" : "Profile picture rejected",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete temporary profile picture",
      error: error.message,
    });
  }
};
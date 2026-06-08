import XLSX from "xlsx";
import mongoose from "mongoose";
import Student from "../models/Student/student.js";
import { authorityModel } from "../models/Academic/authorities.js";
import AdmitCard from "../models/Settings/admitcard.js";
import Exam from "../models/Settings/exam.js";
import ServiceSettings from "../models/Settings/services.js";
import {
  uploadImageToCloudinary,
  deleteFromCloudinary,
} from "../config/cloudinary.js";

export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({ status: "current" });

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
      status: "current",
    }).lean();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found or inactive",
      });
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
    const { registrationNo, key } = req.body;

    // 1. Initial Input Validation
    if (!registrationNo || !registrationNo.trim()) {
      return res.status(400).json({
        success: false,
        message: "Registration number is required",
      });
    }

    // 2. Fetch Core Student Document First
    const student = await Student.findOne({
      registrationNo: registrationNo.trim(),
      status: "current",
    }).lean();

    // 3. Confirm Existence Before Accessing Properties or Sub-Queries
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // 4. Handle Conditional Logic Based on Client Key Intent
    if (key === "admitCard") {
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

      // Return Student Document appended with relational Admit Card models
      return res.status(200).json({
        success: true,
        student,
        principal: principal || null,
        admitCard: admitCard || null,
        examDetails: examDetails || null,
        services: services || null,
      });
    }
    if (key === "fees") {
      // For fee related lookups, we can add more queries here in the future (e.g., FeePaymentHistory)
    }

    // 5. Default Response fallback (e.g., Profile Lookups)
    return res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    console.error("SearchStudent error:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred while fetching student data",
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

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (student.image && student.image.public_id) {
      try {
        await deleteFromCloudinary(student.image.public_id);
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
      }
    }
    await Student.findByIdAndDelete(id);

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
};

export const updateStudent = async (req, res) => {
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

    if (req.body.address && typeof req.body.address === "string") {
      req.body.address = JSON.parse(req.body.address);
    }

    const blockedFields = ["_id", "__v", "createdAt", "updatedAt", "image"];

    for (const key in req.body) {
      if (!blockedFields.includes(key)) {
        student[key] = req.body[key];
      }
    }

    if (req.file) {
      if (student.image?.public_id) {
        try {
          await deleteFromCloudinary(student.image.public_id);
        } catch (err) {
          console.error("Old image delete failed:", err);
        }
      }

      const result = await uploadImageToCloudinary(
        req.file,
        "naa_profile_pictures"
      );

      student.image = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    await student.save();

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      student,
    });
  } catch (error) {
    console.error("Update student error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Registration number already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update student",
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

export const promoteStudents = async (req, res) => {
  try {
    const { studentIds, nextClass, stream = "" } = req.body;

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "studentIds must be a non-empty array",
      });
    }

    if (!nextClass) {
      return res.status(400).json({
        success: false,
        message: "next class is required",
      });
    }

    const invalidIds = studentIds.filter(
      (id) => !mongoose.Types.ObjectId.isValid(id)
    );

    if (invalidIds.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Some student IDs are invalid",
        invalidIds,
      });
    }

    const normalizedNextClass = nextClass.toString().toLowerCase();
    const normalizedStream = stream.toString().toLowerCase();

    const updateData = {
      class: normalizedNextClass,
    };

    if (["11", "12"].includes(normalizedNextClass)) {
      if (!normalizedStream) {
        return res.status(400).json({
          success: false,
          message: "Stream is required when promoting to class 11 or 12",
        });
      }

      updateData.stream = normalizedStream;
    } else {
      updateData.stream = "";
    }

    const result = await Student.updateMany(
      {
        _id: { $in: studentIds },
      },
      {
        $set: updateData,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Students promoted successfully",
      matchedCount: result.matchedCount,
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
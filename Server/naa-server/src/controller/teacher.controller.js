import { teacherModel } from "../models/Teacher/teacher.js";
import Timetable from "../models/Teacher/timetable.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";
import TeacherPayment from "../models/Teacher/payment.js";
import TeacherDues from "../models/Teacher/dues.js";
import TeacherAttendance from "../models/Teacher/attendance.js";




const uploadToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "teachers" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    Readable.from(fileBuffer).pipe(stream);
  });
};


export const addTeacher = async (req, res) => {
  try {
    const {
      name,
      email,
      contact,
      degree,
      experience,
      subjectClassMappings,
    } = req.body;

    let password = "12345";

    if (!name || !contact || !degree || !experience) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    if (email && email !== "N/A" && !validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Teacher image is required",
      });
    }

    const uploadedImage = await uploadToCloudinary(req.file.buffer);

    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const teacher = await teacherModel.create({
      name,
      email,
      contact,
      degree,
      experience,
      image: uploadedImage.secure_url,
      imagePublicId: uploadedImage.public_id,
      subjectClassMappings: subjectClassMappings
        ? JSON.parse(subjectClassMappings)
        : [],
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Teacher added successfully",
      teacher,
    });
  } catch (error) {
    console.error("addTeacher error:", error);
    return res.status(500).json({
      success: false,
      message: "Error adding teacher",
      error: error.message,
    });
  }
};


export const updateTeacherDetails = async (req, res) => {
  try {
    const { id } = req.user;

    const teacher = await teacherModel.findById(id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // Image update

    if (req.file) {
      if (teacher.imagePublicId) {
        await cloudinary.uploader.destroy(teacher.imagePublicId);
      }

      const uploadedImage = await uploadToCloudinary(req.file.buffer);
      teacher.image = uploadedImage.secure_url;
      teacher.imagePublicId = uploadedImage.public_id;
    }

    // Password update

    if (req.body.password) {
      teacher.password = await bcrypt.hash(req.body.password,10);
    }

    // Subject mapping update

    if (req.body.subjectClassMappings) {
      teacher.subjectClassMappings = JSON.parse(req.body.subjectClassMappings);
    }

    // Partial field updates

    const allowedFields = [
      "name",
      "email",
      "contact",
      "degree",
      "experience",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        teacher[field] = req.body[field];
      }
    });

    await teacher.save();

    return res.status(200).json({
      success: true,
      message: "Teacher updated successfully",
      teacher,
    });
  } catch (error) {
    console.error(
      "updateTeacherDetails error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Error updating teacher",
      error: error.message,
    });
  }
};

export const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await teacherModel.findById(id);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    if (teacher.imagePublicId) {
      await cloudinary.uploader.destroy(teacher.imagePublicId);
    }

    await teacher.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Teacher deleted successfully",
    });
  } catch (error) {
    console.error("deleteTeacher error:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting teacher",
      error: error.message,
    });
  }
};

export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await teacherModel.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: teachers.length,
      teachers,
    });
  } catch (error) {
    console.error("getAllTeachers error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching teachers",
      error: error.message,
    });
  }
};

export const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await teacherModel.findById(id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    return res.status(200).json({
      success: true,
      teacher,
    });
  } catch (error) {
    console.error("getOneTeacher error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching teacher",
      error: error.message,
    });
  }
};


export const updateTimetable = async (req, res) => {
  try {
    const { id } = req.user; 
    const { schedule } = req.body;

    // 1. Array Validation Safeguard
    if (!schedule || !Array.isArray(schedule)) {
      return res.status(400).json({
        success: false,
        message: "Invalid schedule data payload. It must be an array.",
      });
    }

    // 2. Verify the teacher exists in the system
    const teacher = await teacherModel.findById(id);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher profile not found",
      });
    }

    // 3. Atomically update or insert (upsert) the timetable documentation
    const timetable = await Timetable.findOneAndUpdate(
      { teacher: id },
      { schedule },
      { new: true, upsert: true, runValidators: true } // runValidators ensures the schema rules are checked
    );

    return res.status(200).json({
      success: true,
      message: "Timetable updated successfully",
      timetable,
    });
  } catch (error) {
    console.error("updateTimetable error:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating timetable",
      error: error.message,
    });
  }
};


export const getTimetable = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await teacherModel.findById(id);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }
    const timetable = await Timetable.findOne({ teacher: id });
    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found",
      });
    }

    return res.status(200).json({
      success: true,
      timetable,
    });
  } catch (error) {
    console.error("getTimetable error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching timetable",
      error: error.message,
    });
  }
};


export const getTeacherDashboard = async (req, res) => {
  try {
    const { id } = req.user;
    
    // 1. Verify teacher quickly
    const teacher = await teacherModel.findById(id).select("-password");
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // 2. Fetch dependencies concurrently with optimization safeguards
    const [timetable, attendance, payments, dues] = await Promise.all([
      Timetable.findOne({ teacher: id }),
      TeacherAttendance.find({ teacher: id }).sort({ createdAt: -1 }).limit(30),
      TeacherPayment.find({ teacher: id }).sort({ createdAt: -1 }).limit(10),
      TeacherDues.findOne({ teacher: id }),
    ]);

    return res.status(200).json({
      success: true,
      dashboard: {
        teacher,
        timetable: timetable || { schedule: [] },
        attendance,
        payments,
        dues: dues || { totalDue: 0, dueMonths: [] },
      },
    });
  } catch (error) {
    console.error("getTeacherDashboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching dashboard",
      error: error.message,
    });
  }
};





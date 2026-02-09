import { teacherModel } from "../models/Academic/teacher.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";



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

/* ===============================
   UPDATE TEACHER
================================ */

export const updateTeacherDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await teacherModel.findById(id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    if (req.file) {
      if (teacher.imagePublicId) {
        await cloudinary.uploader.destroy(teacher.imagePublicId);
      }

      const uploadedImage = await uploadToCloudinary(req.file.buffer);
      teacher.image = uploadedImage.secure_url;
      teacher.imagePublicId = uploadedImage.public_id;
    }

    if (req.body.password) {
      teacher.password = await bcrypt.hash(req.body.password, 10);
    }

    if (req.body.subjectClassMappings) {
      teacher.subjectClassMappings = JSON.parse(
        req.body.subjectClassMappings
      );
    }

    Object.assign(teacher, req.body);

    await teacher.save();

    return res.status(200).json({
      success: true,
      message: "Teacher updated successfully",
      teacher,
    });
  } catch (error) {
    console.error("updateTeacherDetails error:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating teacher",
      error: error.message,
    });
  }
};

/* ===============================
   DELETE TEACHER
================================ */

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

/* ===============================
   GET ALL TEACHERS
================================ */

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

/* ===============================
   GET ONE TEACHER
================================ */

export const getOneTeacher = async (req, res) => {
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

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
      gender,
      address,          // Passed down from frontend as an absolute JSON string via FormData
      subjectTaught,
      degree,
      experience,
    } = req.body;

    // Default generic starting credential password for a manually added teacher profile
    let defaultPassword = "12345";

    // --- Validation Guards ---
    if (!name || !contact || !gender || !address || !subjectTaught || !degree || experience === undefined) {
      return res.status(400).json({
        success: false,
        message: "All structural required parameters must be completed.",
      });
    }

    if (email && email !== "N/A" && !validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address sequence.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Teacher profile image attachment file is required.",
      });
    }

    // --- Address Parsing Execution ---
    let parsedAddress;
    try {
      parsedAddress = typeof address === "string" ? JSON.parse(address) : address;
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        message: "Invalid formatting structure received for address elements.",
      });
    }

    // Confirm structural children inside the address object block
    const { village, po, ps, pin, district, state } = parsedAddress;
    if (!village || !po || !ps || !pin || !district || !state) {
      return res.status(400).json({
        success: false,
        message: "Complete address specifications (Village, P.O, P.S, PIN, District, State) are mandatory.",
      });
    }

    // --- Media Storage & Encryption Processing ---
    const uploadedImage = await uploadToCloudinary(req.file.buffer);

    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // --- Database Engine Execution ---
    const teacher = await teacherModel.create({
      name,
      email: email || "N/A",
      contact,
      gender,
      address: {
        village,
        po,
        ps,
        pin,
        district,
        state,
      },
      subjectTaught,
      degree,
      experience: Number(experience),
      image: {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      },
      password: hashedPassword,
      // Manually inserted profiles from the Admin panel bypass onboarding review queues
      status: "Active", 
    });

    return res.status(201).json({
      success: true,
      message: "Teacher account configured and added successfully.",
      teacher: {
        _id: teacher._id,
        name: teacher.name,
        contact: teacher.contact,
        subjectTaught: teacher.subjectTaught,
        status: teacher.status,
      },
    });
  } catch (error) {
    console.error("addTeacher error profile sequence:", error);
    return res.status(500).json({
      success: false,
      message: "Server runtime breakdown encountered while adding teacher record.",
      error: error.message,
    });
  }
};


export const updateTeacherDetails = async (req, res) => {
  try {
    const { id } = req.user; // Pulled dynamically from auth validation middleware

    const teacher = await teacherModel.findById(id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher profile data trace not found.",
      });
    }

    // --- Asset Cloud Media Refactoring & Garbage Cleanup ---
    if (req.file) {
      // Look for the historical asset token inside the newly structured nested document path
      if (teacher.image && teacher.image.publicId) {
        await cloudinary.v2.uploader.destroy(teacher.image.publicId);
      }

      const uploadedImage = await uploadToCloudinary(req.file.buffer);
      teacher.image = {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      };
    }

    // --- Secured Access Token Configurations ---
    if (req.body.password) {
      teacher.password = await bcrypt.hash(req.body.password, 10);
    }

    // --- Nested Address Parsing Engine ---
    if (req.body.address) {
      try {
        const parsedAddress = typeof req.body.address === "string" 
          ? JSON.parse(req.body.address) 
          : req.body.address;

        // Perform granular field tracking so the client can perform partial mutations on the address block
        const addressFields = ["village", "po", "ps", "pin", "district", "state"];
        
        addressFields.forEach((field) => {
          if (parsedAddress[field] !== undefined) {
            teacher.address[field] = parsedAddress[field];
          }
        });
      } catch (parseError) {
        return res.status(400).json({
          success: false,
          message: "Malformed data structural parsing layout received for address updates.",
        });
      }
    }

    // --- Basic & Professional Fields Mapping Stream ---
    const allowedFields = [
      "name",
      "email",
      "contact",
      "gender",
      "subjectTaught", // Upgraded to track single department stream parameter
      "degree",
      "experience"
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        // Cast numerical constraints accurately
        if (field === "experience") {
          teacher[field] = Number(req.body[field]);
        } else {
          teacher[field] = req.body[field];
        }
      }
    });

    // Mongoose execution fires active document pre-save structural layout validation hooks automatically
    await teacher.save();

    return res.status(200).json({
      success: true,
      message: "Profile information parameters saved and modified successfully.",
      teacher: {
        _id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        contact: teacher.contact,
        gender: teacher.gender,
        address: teacher.address,
        subjectTaught: teacher.subjectTaught,
        degree: teacher.degree,
        experience: teacher.experience,
        image: teacher.image,
      },
    });
  } catch (error) {
    console.error("updateTeacherDetails runtime anomaly sequence:", error);
    return res.status(500).json({
      success: false,
      message: "An operational breakdown was encountered while committing profile updates.",
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
    const teachers = await teacherModel.find().sort({ experience: -1 });

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
    const { day, schedule } = req.body;

    // Validate day

    const validDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    if (!day || !validDays.includes(day)) {
      return res.status(400).json({
        success: false,
        message: "Invalid day provided",
      });
    }

    // Validate schedule array

    if (!schedule || !Array.isArray(schedule)) {
      return res.status(400).json({
        success: false,
        message: "Schedule must be an array",
      });
    }

    // Verify teacher exists

    const teacher = await teacherModel.findById(id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher profile not found",
      });
    }

    // Find existing timetable

    let timetable = await Timetable.findOne({
      teacher: id,
    });

    // Create empty timetable if not exists

    if (!timetable) {

      timetable = await Timetable.create({
        teacher: id,
        schedule: {
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: [],
          Friday: [],
          Saturday: [],
        },
      });
    }

    // Update only selected day

    timetable.schedule[day] = schedule;

    await timetable.save();

    return res.status(200).json({
      success: true,
      message: `${day} timetable updated successfully`,
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

    // Verify teacher exists
    const teacher = await teacherModel.findById(id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // Fetch timetable
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





import { teacherModel } from "../models/teacherModel.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import transporter from "../config/nodemailer.js";
import validator from "validator";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const addTeacher = async (req, res) => {
  try {
    const { name, email, contact, degree, experience, salary, dueBalance, subjectClassMappings } = req.body;
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Teacher image is required!" });
    }

    const image = req.file.path;

    // Validate required fields
    if (!name || !email || !contact || !degree || !experience || !salary || !subjectClassMappings) {
      return res.status(400).json({ success: false, message: "All fields are mandatory!" });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format!" });
    }

    // Validate contact number
    if (!validator.isMobilePhone(contact, "any", { strictMode: false })) {
      return res.status(400).json({ success: false, message: "Invalid contact number!" });
    }

    // Validate experience (must be a non-negative integer)
    const experienceNum = Number(experience);
    if (isNaN(experienceNum) || experienceNum < 0 || !Number.isInteger(experienceNum)) {
      return res.status(400).json({ success: false, message: "Experience must be a non-negative whole number!" });
    }

    // Validate subjectClassMappings
    let parsedMappings;
    try {
      parsedMappings = JSON.parse(subjectClassMappings);
      if (!Array.isArray(parsedMappings) || parsedMappings.length === 0) {
        return res.status(400).json({ success: false, message: "Subject-class mappings must be a non-empty array!" });
      }
      for (const mapping of parsedMappings) {
        if (!mapping.subject || !Array.isArray(mapping.classes) || mapping.classes.length === 0) {
          return res.status(400).json({ success: false, message: "Each subject-class mapping must have a subject and at least one class!" });
        }
      }
    } catch (error) {
      return res.status(400).json({ success: false, message: "Invalid subject-class mappings format!" });
    }

    // Check for existing teacher
    const existingTeacher = await teacherModel.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ success: false, message: "A teacher with this email already exists!" });
    }

    // Generate default password
    const password = "123456";
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new teacher
    const newTeacher = new teacherModel({
      name,
      email,
      password: hashedPassword,
      contact,
      degree,
      experience: experienceNum,
      salary: Number(salary),
      dueBalance: Number(dueBalance) || 0,
      subjectClassMappings: parsedMappings,
      image,
      attendance: [],
      transactions: [],
      notifications: [],
      tasks: [],
    });

    await newTeacher.save();

    // Send welcome email
    try {
      await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Account Created at Nashib Ali Academy",
        text: `Congratulations! Your account has been created at Nashib Ali Academy.\n\nLogin Details:\nEmail: ${email}\nPassword: ${password}\n\nPlease change your password after logging in.`,
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    return res.status(201).json({ success: true, message: "Teacher added successfully!" });
  } catch (error) {
    console.error("Error in addTeacher:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const teacher = await teacherModel.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found!" });
    }

    let imagePath = teacher.image;
    if (imagePath) {
      imagePath = imagePath.replace(/\\/g, "/");
      const filePath = path.resolve(__dirname, "..", imagePath);
      try {
        await fs.unlink(filePath);
        console.log(`Deleted image at ${filePath}`);
      } catch (err) {
        console.error(`Failed to delete image at ${filePath}:`, err.message);
      }
    }

    await teacherModel.findByIdAndDelete(teacherId);

    return res.status(200).json({ success: true, message: "Teacher data deleted successfully!" });
  } catch (error) {
    console.error("Error in deleteTeacher:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await teacherModel.find().select('-password'); // Exclude password for security
    return res.status(200).json({ success: true, teachers });
  } catch (error) {
    console.error("Error in getAllTeachers:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getOneTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const teacher = await teacherModel.findById(teacherId).select('-password'); // Exclude password
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found!" });
    }
    return res.status(200).json({ success: true, teacher });
  } catch (error) {
    console.error("Error in getOneTeacher:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { teacherId, status, latitude, longitude, date } = req.body;
    const isAdmin = req.user.role === 'admin';
    const userTeacherId = req.user.id;

    const targetTeacherId = isAdmin && teacherId ? teacherId : userTeacherId;

    if (!targetTeacherId || !status) {
      return res.status(400).json({ success: false, message: "Teacher ID and status are required!" });
    }

    if (!['Present', 'Absent', 'Late'].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be Present, Absent, or Late!" });
    }

    const teacher = await teacherModel.findById(targetTeacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    if (!isAdmin && (status === 'Present' || status === 'Late')) {
      const SCHOOL_LAT = 26.1157917;
      const SCHOOL_LNG = 91.7085933;
      const MAX_RADIUS = 0.3;

      if (!latitude || !longitude) {
        return res.status(400).json({ success: false, message: "Location data is required for teachers!" });
      }

      const haversine = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
          Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      };

      const distance = haversine(latitude, longitude, SCHOOL_LAT, SCHOOL_LNG);
      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);
      console.log(`Distance from school: ${distance.toFixed(3)} km`);
      if (distance > MAX_RADIUS) {
        return res.status(403).json({
          success: false,
          message: `Must be at school to mark Present or Late. Distance: ${distance.toFixed(3)} km`,
        });
      }
    }

    let targetDate;
    if (date) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate)) {
        return res.status(400).json({ success: false, message: "Invalid date format" });
      }
      targetDate = new Date(Date.UTC(parsedDate.getUTCFullYear(), parsedDate.getUTCMonth(), parsedDate.getUTCDate()));
    } else {
      const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      const localDate = new Date(now);
      targetDate = new Date(Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate()));
    }

    const tomorrow = new Date(targetDate);
    tomorrow.setUTCDate(targetDate.getUTCDate() + 1);

    const existingAttendance = teacher.attendance.find(record => {
      const recordDate = new Date(record.date);
      return recordDate >= targetDate && recordDate < tomorrow;
    });

    if (existingAttendance) {
      if (!isAdmin) {
        return res.status(400).json({ success: false, message: "Attendance already marked for this date" });
      }
      existingAttendance.status = status;
      existingAttendance.location = status !== 'Absent' && latitude && longitude
        ? { latitude, longitude }
        : existingAttendance.location;
      existingAttendance.markedBy = 'Admin';
      existingAttendance.markedAt = new Date();
    } else {
      teacher.attendance.push({
        date: targetDate,
        status,
        location: status !== 'Absent' && latitude && longitude ? { latitude, longitude } : null,
        markedBy: isAdmin ? 'Admin' : 'Teacher',
        markedAt: new Date(),
      });
    }

    await teacher.save();
    return res.status(200).json({
      success: true,
      message: `Attendance ${existingAttendance ? 'updated' : 'marked'} as ${status}`,
    });

  } catch (error) {
    console.error("Error in markAttendance:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const unmarkAttendance = async (req, res) => {
  try {
    const { teacherId, attendanceId } = req.body;
    const isAdmin = req.user.role === 'admin';
    const userTeacherId = req.user.id;

    const targetTeacherId = isAdmin && teacherId ? teacherId : userTeacherId;

    if (!targetTeacherId || !attendanceId) {
      return res.status(400).json({ success: false, message: "Teacher ID and attendance ID are required!" });
    }

    const teacher = await teacherModel.findById(targetTeacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    const attendanceRecord = teacher.attendance.id(attendanceId);
    if (!attendanceRecord) {
      return res.status(404).json({ success: false, message: "Attendance record not found" });
    }

    if (!isAdmin && attendanceRecord.markedBy === 'Admin') {
      return res.status(403).json({ success: false, message: "Only admins can unmark admin-marked attendance" });
    }

    teacher.attendance.pull(attendanceId);
    await teacher.save();

    return res.status(200).json({
      success: true,
      message: "Attendance unmarked successfully",
    });
  } catch (error) {
    console.error("Error in unmarkAttendance:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getAttendanceReport = async (req, res) => {
  try {
    const { teacherId, month, year } = req.body;
    const isAdmin = req.user.role === 'admin';
    const userTeacherId = req.user.id;

    const targetTeacherId = isAdmin && teacherId ? teacherId : userTeacherId;

    if (!targetTeacherId) {
      return res.status(400).json({ success: false, message: "Teacher ID is required!" });
    }

    const teacher = await teacherModel.findById(targetTeacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    let attendanceRecords = teacher.attendance;

    if (month !== undefined && year !== undefined) {
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 1);
      attendanceRecords = attendanceRecords.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= start && recordDate < end;
      });
    }

    const presentDays = attendanceRecords.filter(r => r.status === "Present").length;
    const absentDays = attendanceRecords.filter(r => r.status === "Absent").length;
    const lateDays = attendanceRecords.filter(r => r.status === "Late").length;

    const overallPresent = teacher.attendance.filter(r => r.status === "Present").length;
    const overallAbsent = teacher.attendance.filter(r => r.status === "Absent").length;
    const overallLate = teacher.attendance.filter(r => r.status === "Late").length;

    const attendanceReport = {
      presentDays: overallPresent,
      absentDays: overallAbsent,
      lateDays: overallLate,
      monthlyPresentDays: presentDays,
      monthlyAbsentDays: absentDays,
      monthlyLateDays: lateDays,
      attendance: attendanceRecords.map(record => ({
        _id: record._id,
        date: record.date.toISOString().split("T")[0],
        status: record.status,
        location: record.location,
        markedBy: record.markedBy,
        markedAt: record.markedAt,
      })),
    };

    return res.status(200).json({ success: true, attendanceReport });
  } catch (error) {
    console.error("Error in getAttendanceReport:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getAttendanceHistory = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const teacher = await teacherModel.findById(teacherId).select('-password');
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    const attendance = teacher.attendance
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 30);

    return res.status(200).json({ success: true, attendance });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllTransactions = async (req, res) => {
  const { teacherId } = req.body;
  if (!teacherId) {
    return res.json({ success: false, message: "Teacher Id not found" });
  }

  try {
    const teacher = await teacherModel.findById(teacherId).select('transactions');
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    const transactions = teacher.transactions;
    if (!transactions || transactions.length === 0) {
      return res.json({ success: false, message: "Transactions not available" });
    }

    return res.json({ success: true, data: transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.json({ success: false, message: error.message });
  }
};

export const acknowledgeSalary = async (req, res) => {
  const { transactionId } = req.params;

  try {
    const teacher = await teacherModel.findOne({ "transactions._id": transactionId });
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    const transaction = teacher.transactions.id(transactionId);
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    if (teacher._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized to acknowledge this transaction" });
    }

    if (transaction.acknowledged) {
      return res.status(400).json({ success: false, message: "Transaction already acknowledged" });
    }

    transaction.acknowledged = true;
    transaction.acknowledgedOn = new Date();
    await teacher.save();

    return res.status(200).json({ success: true, message: "Transaction acknowledged successfully" });
  } catch (error) {
    console.error("Error acknowledging salary:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateBankDetails = async (req, res) => {
  try {
    const { bankName, accountNumber, ifscCode, accountHolderName } = req.body;
    const teacherId = req.user.id;

    if (!bankName || !accountNumber || !ifscCode || !accountHolderName) {
      return res.status(400).json({ success: false, message: "All bank details are required" });
    }

    if (!/^[A-Za-z]{4}[0-9]{7}$/.test(ifscCode)) {
      return res.status(400).json({ success: false, message: "Invalid IFSC code format (e.g., ABCD1234567)" });
    }

    const teacher = await teacherModel.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    teacher.bankName = bankName;
    teacher.accountNumber = accountNumber;
    teacher.ifscCode = ifscCode;
    teacher.accountHolderName = accountHolderName;

    await teacher.save();

    return res.status(200).json({ success: true, message: "Bank details updated successfully", teacher });
  } catch (error) {
    console.error("Error updating bank details:", error);
    return res.status(500).json({ success: false, message: "Server error: " + error.message });
  }
};

export const recordTransaction = async (req, res) => {
  try {
    const { teacherId, amount, description, paymentMonth } = req.body;

    if (!teacherId || !amount || !description || !paymentMonth) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const teacher = await teacherModel.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    const newTransaction = {
      amount: Number(amount),
      description,
      paymentMonth,
      status: "Successful",
      acknowledged: false,
      createdAt: new Date(),
    };

    teacher.transactions.push(newTransaction);
    teacher.dueBalance = Math.max(0, teacher.dueBalance - Number(amount));

    // Add notification
    const monthName = new Date(`${paymentMonth}-01`).toLocaleString('default', { month: 'long' });

    const newNotification = {
      title: "Salary Credited",
      message: `Your salary for the month of ${monthName} has been credited. Amount: ₹${amount}.`,
      createdAt: new Date(),
    };

    teacher.notifications.push(newNotification);

    await teacher.save();

    const savedTransaction = teacher.transactions[teacher.transactions.length - 1];

    res.status(201).json({
      success: true,
      message: "Payment recorded successfully",
      transaction: savedTransaction,
    });
  } catch (error) {
    console.error("Error recording transaction:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const updateTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { name, email, contact, degree, experience, salary, dueBalance, subjectClassMappings } = req.body;

    // Validate inputs if provided
    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format!" });
    }
    if (contact && !validator.isMobilePhone(contact, "any", { strictMode: false })) {
      return res.status(400).json({ success: false, message: "Invalid contact number!" });
    }
    if (experience && (isNaN(experience) || experience < 0 || !Number.isInteger(Number(experience)))) {
      return res.status(400).json({ success: false, message: "Experience must be a non-negative whole number!" });
    }
    if (subjectClassMappings) {
      let parsedMappings;
      try {
        parsedMappings = JSON.parse(subjectClassMappings);
        if (!Array.isArray(parsedMappings)) {
          return res.status(400).json({ success: false, message: "Subject-class mappings must be an array!" });
        }
        for (const mapping of parsedMappings) {
          if (!mapping.subject || !Array.isArray(mapping.classes)) {
            return res.status(400).json({ success: false, message: "Each subject-class mapping must have a subject and classes array!" });
          }
        }
      } catch (error) {
        return res.status(400).json({ success: false, message: "Invalid subject-class mappings format!" });
      }
    }

    const updates = {
      ...(name && { name }),
      ...(email && { email }),
      ...(contact && { contact }),
      ...(degree && { degree }),
      ...(experience && { experience: Number(experience) }),
      ...(salary && { salary: Number(salary) }),
      ...(dueBalance !== undefined && { dueBalance: Number(dueBalance) }),
      ...(subjectClassMappings && { subjectClassMappings: parsedMappings }),
    };

    const teacher = await teacherModel.findByIdAndUpdate(teacherId, updates, { new: true, runValidators: true }).select('-password');
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    res.status(200).json({ success: true, teacher });
  } catch (error) {
    console.error("Error updating teacher:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const updateProfilePicture = async (req, res) => {
  try {
    const { teacherId } = req.body;
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Profile picture is required!" });
    }

    if (!teacherId) {
      return res.status(400).json({ success: false, message: "Teacher ID is required!" });
    }

    const teacher = await teacherModel.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found!" });
    }

    // Delete old image if it exists
    if (teacher.image) {
      const oldImagePath = path.resolve(__dirname, "..", teacher.image.replace(/\\/g, "/"));
      try {
        await fs.unlink(oldImagePath);
      } catch (err) {
        console.error(`Failed to delete old image at ${oldImagePath}:`, err.message);
      }
    }

    // Update with new image path
    teacher.image = req.file.path;
    await teacher.save();

    return res.status(200).json({ success: true, message: "Profile picture updated successfully!", teacher });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const UpdateDueBalance = async (req, res) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7); // Format: 'YYYY-MM'
    const teachers = await teacherModel.find();

    const updatedTeachers = [];

    for (const teacher of teachers) {
      if (teacher.updateDueBalanceMonth === currentMonth) continue;

      teacher.dueBalance += teacher.salary;
      teacher.updateDueBalanceMonth = currentMonth;
      await teacher.save();

      updatedTeachers.push(teacher._id);
    }

    return res.status(200).json({
      message: "Due balances updated successfully for eligible teachers.",
      updatedCount: updatedTeachers.length,
    });
  } catch (error) {
    console.error("Update Due Balance Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
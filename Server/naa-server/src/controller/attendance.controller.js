import AttendanceQR from "../models/Teacher/qr.js";
import TeacherAttendance from "../models/Teacher/attendance.js";
import QRCode from "qrcode";
import crypto from "crypto";

const getIndianDateString = () => {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
};

export const generateAttendanceQR = async (req, res) => {
  try {
    const today = getIndianDateString();
    const token = crypto.randomBytes(6).toString("hex");
    const qrPayload = JSON.stringify({ token, date: today });
    const qrImageString = await QRCode.toDataURL(qrPayload);

    const qrDoc = await AttendanceQR.findOneAndUpdate(
      { date: today },
      { token, qrCodeBase64: qrImageString, isExpired: false },
      { new: true, upsert: true, runValidators: true },
    );

    return res.status(200).json({
      success: true,
      message: "Attendance QR processed successfully",
      qrdetails: {
        token: qrDoc.token,
        date: qrDoc.date,
        qrCodeBase64: qrDoc.qrCodeBase64,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error processing attendance QR code",
      error: error.message,
    });
  }
};

export const getAttendanceQR = async (req, res) => {
  try {
    const today = getIndianDateString();
    const qrDoc = await AttendanceQR.findOne({ date: today, isExpired: false });

    if (!qrDoc) {
      return res.status(404).json({
        success: false,
        message: "No active attendance QR code found for today",
      });
    }

    return res.status(200).json({
      success: true,
      qrdetails: {
        token: qrDoc.token,
        date: qrDoc.date,
        qrCodeBase64: qrDoc.qrCodeBase64,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching attendance QR code",
      error: error.message,
    });
  }
};

export const expireAttendanceQR = async (req, res) => {
  try {
    const today = getIndianDateString();
    const qrDoc = await AttendanceQR.findOneAndUpdate(
      { date: today },
      { isExpired: true },
      { new: true },
    );

    if (!qrDoc) {
      return res.status(404).json({
        success: false,
        message: "No active attendance QR code found for today",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Attendance QR code expired successfully",
      qrdetails: qrDoc,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error expiring attendance QR code",
      error: error.message,
    });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { token, markedBy, status } = req.body;
    const teacherId = req.user.id;
    const today = getIndianDateString();

    const qrDoc = await AttendanceQR.findOne({
      date: today,
      token,
      isExpired: false,
    });

    if (!qrDoc) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired QR code",
      });
    }

    const existingAttendance = await TeacherAttendance.findOne({
      teacher: teacherId,
      date: today,
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for this teacher today",
      });
    }

    const newAttendance = new TeacherAttendance({
      teacher: teacherId,
      date: today,
      checkInTime: new Date(),
      status: status || "Present",
      markedBy: markedBy || "Teacher",
    });

    await newAttendance.save();

    const updatedAttendanceList = await TeacherAttendance.find({ date: today })

    return res.status(200).json({
      success: true,
      message: "Attendance marked successfully",
      attendance: updatedAttendanceList,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error marking attendance",
      error: error.message,
    });
  }
};

export const getTeacherAttendanceHistory = async (req, res) => {
  try {
    let teacherId = req.user.id || req.params.teacherId;

    const { month, year } = req.query;

    let query = { teacher: teacherId };

    // Filter by month & year if provided
    if (month && year) {
      const startDate = `${year}-${String(month).padStart(2, "0")}-01`;

      // This automatically finds the exact last day of any month (e.g., 28, 29, 30, or 31)
      const lastDay = new Date(year, month, 0).getDate();
      const endDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

      query.date = { $gte: startDate, $lte: endDate };
    }

    const attendanceRecords = await TeacherAttendance.find(query)
      .populate("teacher", "name image")
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      attendance: attendanceRecords,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching attendance history",
      error: error.message,
    });
  }
};




//for admin only
export const getTodaysAttendanceHistory = async (req, res) => {
  try {
    const today = getIndianDateString();
    const attendanceRecords = await TeacherAttendance.find({ date: today })
      .populate("teacher", "name image")
      .sort({ checkInTime: -1 });

    return res.status(200).json({
      success: true,
      attendance: attendanceRecords,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching today's attendance history",
      error: error.message,
    });
  }
};

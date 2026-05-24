import AttendanceQR from "../models/Teacher/qr.js";
import TeacherAttendance from "../models/Teacher/attendance.js";
import QRCode from "qrcode";
import crypto from "crypto";

// Utility to consistently get India date elements
const getIndianDateDetails = () => {
  const checkDateStr = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); // "YYYY-MM-DD"
  const [year, month, day] = checkDateStr.split("-");
  return { dateString: checkDateStr, year, month, day };
};

export const generateAttendanceQR = async (req, res) => {
  try {
    const { dateString } = getIndianDateDetails();
    const token = crypto.randomBytes(16).toString("hex");
    
    const qrPayload = JSON.stringify({ token, date: dateString });
    const qrImageString = await QRCode.toDataURL(qrPayload);

    // Try to find the single existing document, regardless of its date filter
    let qrDoc = await AttendanceQR.findOne();

    if (qrDoc) {
      // If a document exists, update its fields completely
      qrDoc.date = dateString;
      qrDoc.token = token;
      qrDoc.qrCodeBase64 = qrImageString;
      qrDoc.isExpired = false;
      await qrDoc.save();
    } else {
      // If the database is completely empty (first time setup), create the single record
      qrDoc = await AttendanceQR.create({
        date: dateString,
        token,
        qrCodeBase64: qrImageString,
        isExpired: false
      });
    }

    return res.status(200).json({
      success: true,
      message: "Attendance QR updated successfully",
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

export const getTodayAttendanceDetails = async (req, res) => {
  try {
    const { dateString } = getIndianDateDetails();

    // Fire both database reads simultaneously for better performance
    const [qrDoc, attendanceRecords] = await Promise.all([
      AttendanceQR.findOne(),
      TeacherAttendance.find({ date: dateString })
        .populate("teacher", "name image contact") 
        .sort({ checkInTime: -1 })
    ]);

    // Construct unified payload structure
    const payload = {
      success: true,
      qrdetails: null,
      attendance: attendanceRecords || []
    };

    // If an active QR exists, cleanly expose its formatted profile elements
    if (qrDoc) {
      payload.qrdetails = {
        token: qrDoc.token,
        date: qrDoc.date,
        qrCodeBase64: qrDoc.qrCodeBase64,
        isExpired: qrDoc.isExpired
      };
    }

    return res.status(200).json(payload);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error compilation streaming aggregate dashboard data streams",
      error: error.message,
    });
  }
};

export const expireAttendanceQR = async (req, res) => {
  try {
    const { dateString } = getIndianDateDetails();
    const qrDoc = await AttendanceQR.findOneAndUpdate(
      { date: dateString },
      { isExpired: true },
      { new: true }
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
    const { dateString, year, month } = getIndianDateDetails(); 

    // 1. Verify QR document matches current token and date
    const qrDoc = await AttendanceQR.findOne({
      date: dateString,
      token,
      isExpired: false,
    });

    if (!qrDoc) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired QR code",
      });
    }

    // 2. Prevent double check-ins
    const existingAttendance = await TeacherAttendance.findOne({
      teacher: teacherId,
      date: dateString,
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for this teacher today",
      });
    }

    // 3. Construct and save the new attendance documentation entry
    const newAttendance = new TeacherAttendance({
      teacher: teacherId,
      date: dateString,
      checkInTime: new Date(),
      status: status || "Present",
      markedBy: markedBy || "Teacher",
    });

    await newAttendance.save();

    // 4. Safely compile history range variables relative to India timezone
    const startDate = `${year}-${month}-01`;
    const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
    const endDate = `${year}-${month}-${String(lastDay).padStart(2, "0")}`;

    // 5. Query context strictly limited to this specific logged-in teacher
    const attendanceHistory = await TeacherAttendance.find({
      teacher: teacherId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 }); 

    return res.status(200).json({
      success: true,
      message: "Attendance marked successfully",
      attendance: attendanceHistory, 
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
    // Priority given explicitly to param if provided (for Admin use cases)
    const teacherId = req.params.teacherId || req.user.id;
    const { month, year } = req.query;

    let query = { teacher: teacherId };

    if (month && year) {
      const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
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


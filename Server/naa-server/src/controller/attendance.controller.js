import AttendanceQR from "../models/Staff/qr.js";
import StaffAttendance from "../models/Staff/attendance.js";
import Staff from "../models/Staff/staff.js"; // Imported the new unified Staff schema
import QRCode from "qrcode";
import crypto from "crypto";

// Helper function to extract normalized IST timestamps
const getIndianDateDetails = () => {
  const checkDateStr = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); 
  const [year, month, day] = checkDateStr.split("-");

  const normalizedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 0, 0, 0, 0);

  return { 
    nativeDate: normalizedDate, 
    year: parseInt(year), 
    month: parseInt(month), 
    day: parseInt(day) 
  };
};

// ==========================================
// ADMIN ROUTINES
// ==========================================

// 1. GENERATE OR UPDATE DAILY QR CODE 
export const generateAttendanceQR = async (req, res) => {
  try {
    const { nativeDate } = getIndianDateDetails();
    const token = crypto.randomBytes(16).toString("hex");
    
    const qrPayload = JSON.stringify({ token, date: nativeDate.toISOString() });
    const qrImageString = await QRCode.toDataURL(qrPayload);

    let qrDoc = await AttendanceQR.findOne();

    if (qrDoc) {
      qrDoc.date = nativeDate;
      qrDoc.token = token;
      qrDoc.qrCodeBase64 = qrImageString;
      qrDoc.isExpired = false;
      await qrDoc.save();
    } else {
      qrDoc = await AttendanceQR.create({
        date: nativeDate,
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

// 2. FETCH TODAY'S ENTIRE ROSTER RECORD ENTRIES
export const getTodayAttendanceDetails = async (req, res) => {
  try {
    const { nativeDate } = getIndianDateDetails();

    // Migrated populate and query criteria keys to look up 'staff' properties
    const [qrDoc, attendanceRecords] = await Promise.all([
      AttendanceQR.findOne(),
      StaffAttendance.find({ date: nativeDate })
        .populate("staff", "name image contact designation staffType") 
        .sort({ createdAt: -1 }) 
    ]);

    const payload = {
      success: true,
      qrdetails: null,
      attendance: attendanceRecords || []
    };

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
      message: "Error compiling today's dashboard attendance records",
      error: error.message,
    });
  }
};

// 3. EXPIRE ATTENDANCE QR MANUALLY
export const expireAttendanceQR = async (req, res) => {
  try {
    const { nativeDate } = getIndianDateDetails();
    
    const qrDoc = await AttendanceQR.findOneAndUpdate(
      { date: nativeDate },
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

// ==========================================
// STAFF SELF ROUTINES
// ==========================================

// 4. SCAN AND MARK INDIVIDUAL DAILY ATTENDANCE
export const markAttendance = async (req, res) => {
  try {
    const { token, markedBy, status } = req.body;
    const staffId = req.user.id; // Pulled from staffAuthMiddleware token context
    const { nativeDate, year, month } = getIndianDateDetails(); 

    // Verify current QR token validation tracking states
    const qrDoc = await AttendanceQR.findOne({
      date: nativeDate,
      token,
      isExpired: false,
    });

    if (!qrDoc) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired QR code",
      });
    }

    // Swapped lookups to filter records by the 'staff' field identifier
    const existingAttendance = await StaffAttendance.findOne({
      staff: staffId,
      date: nativeDate,
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for this staff member today",
      });
    }

    // Instantiating fresh record inside the unified StaffAttendance model
    const newAttendance = new StaffAttendance({
      staff: staffId,
      date: nativeDate, 
      status: status || "Present",
      markedBy: markedBy || "Teacher",
    });

    await newAttendance.save();

    // Compile dynamic rolling historical month window array updates
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const attendanceHistory = await StaffAttendance.find({
      staff: staffId,
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

// 5. STAFF SELF HISTORICAL LOOKUP PIPELINE
export const getMyAttendanceHistory = async (req, res) => {
  try {
    const staffId = req.user.id; 
    const { month, year } = req.query;

    let query = { staff: staffId };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1); 
      const endDate = new Date(year, month, 0, 23, 59, 59, 999); 
      query.date = { $gte: startDate, $lte: endDate };
    }

    const attendanceRecords = await StaffAttendance.find(query)
      .populate("staff", "name image designation")
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      attendance: attendanceRecords,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching your attendance history",
      error: error.message,
    });
  }
};

// 6. ADMINISTRATIVE GRANULAR INQUIRY PARAMS TRACE (Admin Looking up specific Staff Member)
export const getStaffAttendanceHistoryForAdmin = async (req, res) => {
  try {
    const { staffId } = req.params; // Remapped path reference from teacherId to staffId
    const { month, year } = req.query;

    let query = { staff: staffId };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1); 
      const endDate = new Date(year, month, 0, 23, 59, 59, 999); 
      query.date = { $gte: startDate, $lte: endDate };
    }

    const attendanceRecords = await StaffAttendance.find(query)
      .populate("staff", "name image email contact designation staffType")
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      attendance: attendanceRecords,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Admin error fetching staff attendance history",
      error: error.message,
    });
  }
};
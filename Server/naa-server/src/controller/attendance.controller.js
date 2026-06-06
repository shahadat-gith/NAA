import AttendanceQR from "../models/Staff/qr.js";
import StaffAttendance from "../models/Staff/attendance.js";
import Staff from "../models/Staff/staff.js";
import QRCode from "qrcode";
import crypto from "crypto";
import mongoose from "mongoose";

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

// 4. SCAN AND MARK INDIVIDUAL DAILY ATTENDANCE
export const markAttendance = async (req, res) => {
  try {
    const { token, markedBy, status } = req.body;
    const staffId = req.user.id;
    const { nativeDate, year, month } = getIndianDateDetails(); 

    const qrDoc = await AttendanceQR.findOne({
      date: nativeDate,
      token,
      isExpired: false,
    });

    if (!qrDoc) {
      return res.status(400).json({
        success: false,
        message: "This attendance QR code is invalid or has expired.",
      });
    }

    const existingAttendance = await StaffAttendance.findOne({
      staff: staffId,
      date: nativeDate,
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "Your attendance has already been marked for today.",
      });
    }

    const newAttendance = new StaffAttendance({
      staff: staffId,
      date: nativeDate, 
      status: status || "Present",
      markedBy: markedBy || "Staff",
    });

    await newAttendance.save();

    // Pure dynamic date matching strings without time gap leaks
    const targetYear = Number(year);
    const targetMonth = Number(month);

    const startISOString = `${targetYear}-${String(targetMonth).padStart(2, "0")}-01T00:00:00.000Z`;
    const nextMonth = targetMonth === 12 ? 1 : targetMonth + 1;
    const nextYear = targetMonth === 12 ? targetYear + 1 : targetYear;
    const endISOString = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01T00:00:00.000Z`;

    const attendanceHistory = await StaffAttendance.find({
      staff: staffId,
      date: { 
        $gte: new Date(startISOString), 
        $lt: new Date(endISOString) 
      }
    }).sort({ date: 1 }); 

    return res.status(200).json({
      success: true,
      message: "Attendance marked successfully.",
      attendance: attendanceHistory, 
    });

  } catch (error) {
    console.error("Attendance marking crash log:", error);
    return res.status(500).json({
      success: false,
      message: "Could not record your attendance. Please try again in a moment.",
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




// =========================================================================
// ==================== ADMINISTRATIVE CONTROL ENDPOINTS ====================
// =========================================================================

export const adminGetStaffList = async (req, res) => {
  try {
    const staffs = await Staff.find().select("name staffId image staffType");
    
    const date = getIndianDateDetails();
    const startOfMonth = new Date(date.year, date.month - 1, 1);
    const endOfMonth = new Date(date.year, date.month, 0, 23, 59, 59, 999);

    const attendanceStats = await StaffAttendance.aggregate([
      { 
        $match: {
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: "$staff",
          totalDays: { $sum: 1 },
          presentDays: { $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] } },
          absentDays: { $sum: { $cond: [{ $eq: ["$status", "Absent"] }, 1, 0] } },
          onLeaveDays: { $sum: { $cond: [{ $eq: ["$status", "On-Leave"] }, 1, 0] } }
        }
      }
    ]);


    const attendanceMap = {};
    attendanceStats.forEach(stat => {
      attendanceMap[stat._id.toString()] = stat;
    });


    const staffList = staffs.map(staff => {
      const stats = attendanceMap[staff._id.toString()] || {
        totalDays: 0,
        presentDays: 0,
        absentDays: 0,
        onLeaveDays: 0
      };

      return {
        _id: staff._id,
        name: staff.name,
        staffId: staff.staffId,
        image: staff.image, 
        staffType: staff.staffType,
        attendanceStats: stats
      };
    });
    return res.status(200).json({
      success: true,
      staffs: staffList 
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Admin error compiling registered staff data records.",
      error: error.message
    });
  }
};


export const adminGetIndividualStaffAttendance = async (req, res) => {
  try {
    const { id } = req.params; // MongoDB Native _id assigned to staff document
    const { startDate, endDate } = req.query; // Expects structural format: YYYY-MM-DD

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid staff object footprint locator signature schema reference." 
      });
    }

    const staffProfile = await Staff.findById(id).select("name staffId image staffType designation contact email");
    if (!staffProfile) {
      return res.status(404).json({ 
        success: false, 
        message: "Requested staff target entity could not be verified." 
      });
    }

    let query = { staff: id };

    // Dynamic chronological date window filtering matching staff self lookup parameters
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(`${startDate}T00:00:00.000Z`),
        $lte: new Date(`${endDate}T23:59:59.999Z`)
      };
    }

    const logs = await StaffAttendance.find(query).sort({ date: -1 });

    return res.status(200).json({
      success: true,
      profile: staffProfile,
      logs: logs || []
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Admin error retrieving targeted staff chronological attendance log metrics.",
      error: error.message
    });
  }
};

export const adminOverrideAttendance = async (req, res) => {
  try {
    const { id, targetDate, status } = req.body; // id: Staff document object native _id, targetDate format: YYYY-MM-DD

    if (!id || !targetDate || !status) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required execution parameters payload fields." 
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid targeted staff identifier token structure references." 
      });
    }

    if (!["Present", "Absent", "On-Leave"].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid status enum mapping layout criteria applied." 
      });
    }

    // Force normalized midnight timestamp matching getIndianDateDetails() criteria schema precisely
    const [year, month, day] = targetDate.split("-");
    const normalizedTargetDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 0, 0, 0, 0);

    // Atomic update or insert tracking parameters loop matching unique index requirements ({ staff: 1, date: 1 })
    const overridenLog = await StaffAttendance.findOneAndUpdate(
      { staff: id, date: normalizedTargetDate },
      {
        status: status,
        markedBy: "Admin"
      },
      { upsert: true, new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: `Staff marked as ${status} successfully for date: ${targetDate}`,
      log: overridenLog
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Admin workspace attendance overwrite modification request failed.",
      error: error.message
    });
  }
};
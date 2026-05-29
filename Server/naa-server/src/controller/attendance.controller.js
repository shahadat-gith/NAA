import AttendanceQR from "../models/Teacher/qr.js";
import TeacherAttendance from "../models/Teacher/attendance.js";
import QRCode from "qrcode";
import crypto from "crypto";


const getIndianDateDetails = () => {
  // 1. Get current date string in IST formatted as "YYYY-MM-DD"
  const checkDateStr = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); 
  const [year, month, day] = checkDateStr.split("-");

  // 2. CRITICAL: Create a native Date object forced to midnight (00:00:00.000) Local/UTC safe representation
  const normalizedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 0, 0, 0, 0);

  return { 
    nativeDate: normalizedDate, // Use this for MongoDB matches/inserts
    year: parseInt(year), 
    month: parseInt(month), 
    day: parseInt(day) 
  };
};

// ==========================================
// ADMIN ROUTINES
// ==========================================

export const generateAttendanceQR = async (req, res) => {
  try {
    const { nativeDate } = getIndianDateDetails();
    const token = crypto.randomBytes(16).toString("hex");
    
    // Payload can pass ISO string representation for frontend parsing safely
    const qrPayload = JSON.stringify({ token, date: nativeDate.toISOString() });
    const qrImageString = await QRCode.toDataURL(qrPayload);

    // Try to find the single existing document structure
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

export const getTodayAttendanceDetails = async (req, res) => {
  try {
    const { nativeDate } = getIndianDateDetails();

    // Fire operations concurrently 
    const [qrDoc, attendanceRecords] = await Promise.all([
      AttendanceQR.findOne(),
      TeacherAttendance.find({ date: nativeDate })
        .populate("teacher", "name image contact") 
        .sort({ createdAt: -1 }) // Sorted by actual insertion time instead of standard date
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

export const expireAttendanceQR = async (req, res) => {
  try {
    const { nativeDate } = getIndianDateDetails();
    
    // Match directly by today's date object reference
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
// TEACHER ROUTINES
// ==========================================

export const markAttendance = async (req, res) => {
  try {
    const { token, markedBy, status } = req.body;
    const teacherId = req.user.id;
    const { nativeDate, year, month } = getIndianDateDetails(); 

    // 1. Verify QR matches token, date object, and validation state
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

    // 2. Prevent duplicate entries using clean Date object validation
    const existingAttendance = await TeacherAttendance.findOne({
      teacher: teacherId,
      date: nativeDate,
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for this teacher today",
      });
    }

    // 3. Create explicit execution entry
    const newAttendance = new TeacherAttendance({
      teacher: teacherId,
      date: nativeDate, // Saving pure midnight date 
      status: status || "Present",
      markedBy: markedBy || "Teacher",
    });

    await newAttendance.save();

    // 4. Calculate current month boundaries with proper offsets
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    // 5. Query active rolling target historical log
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

// FOR TEACHERS: Strictly gets the logged-in teacher's history using req.user.id
export const getMyAttendanceHistory = async (req, res) => {
  try {
    const teacherId = req.user.id; // From authMiddleware
    const { month, year } = req.query;

    let query = { teacher: teacherId };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1); 
      const endDate = new Date(year, month, 0, 23, 59, 59, 999); 
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
      message: "Error fetching your attendance history",
      error: error.message,
    });
  }
};

// FOR ADMINS: Strictly gets a specific teacher's history using URL params
export const getTeacherAttendanceHistoryForAdmin = async (req, res) => {
  try {
    const { teacherId } = req.params; // From URL dynamic parameter /:teacherId
    const { month, year } = req.query;

    let query = { teacher: teacherId };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1); 
      const endDate = new Date(year, month, 0, 23, 59, 59, 999); 
      query.date = { $gte: startDate, $lte: endDate };
    }

    const attendanceRecords = await TeacherAttendance.find(query)
      .populate("teacher", "name image email contact")
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      attendance: attendanceRecords,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Admin error fetching teacher attendance history",
      error: error.message,
    });
  }
};
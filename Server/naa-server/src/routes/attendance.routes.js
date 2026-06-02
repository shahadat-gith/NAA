import express from "express";
import {
  generateAttendanceQR,
  expireAttendanceQR,
  markAttendance,
  getMyAttendanceHistory,              
  getStaffAttendanceHistoryForAdmin, // Imported the newly updated controller function name
  getTodayAttendanceDetails,
} from "../controller/attendance.controller.js";

import { adminAuthMiddleware } from "../middleware/adminAuth.js"; // Admin authentication guard
import { staffAuthMiddleware } from "../middleware/staffAuth.js"; // Unified Staff authentication guard

const attendanceRouter = express.Router();

// =========================================================================
// 🛠️ QR CODE OPERATION ENDPOINTS (Admin Only)
// =========================================================================

/**
 * @route   POST /api/attendance/generate-qr
 * @desc    Generate a fresh, unexpired daily attendance QR code block
 * @access  Private (Admin Only)
 */
attendanceRouter.post("/generate-qr", adminAuthMiddleware, generateAttendanceQR);

/**
 * @route   POST /api/attendance/expire-qr
 * @desc    Manually flag the daily attendance QR token code as expired
 * @access  Private (Admin Only)
 */
attendanceRouter.post("/expire-qr", adminAuthMiddleware, expireAttendanceQR);


// =========================================================================
// 📲 ATTENDANCE RECORD MARKING ENDPOINTS (Staff Only)
// =========================================================================

/**
 * @route   POST /api/attendance/mark-attendance
 * @desc    Submit a daily scanned QR token tracking matrix row to check-in
 * @access  Private (Staff Only)
 */
attendanceRouter.post("/mark-attendance", staffAuthMiddleware, markAttendance);


// =========================================================================
// 📊 HISTORY LOG AND INQUIRY ENDPOINTS
// =========================================================================

/**
 * @route   GET /api/attendance/history/me
 * @desc    Fetch rolling monthly attendance logging history for the logged-in staff member
 * @access  Private (Staff Only)
 */
attendanceRouter.get("/history/me", staffAuthMiddleware, getMyAttendanceHistory);

/**
 * @route   GET /api/attendance/history/:staffId
 * @desc    Fetch rolling monthly attendance logging history for a targeted specific staff member
 * @access  Private (Admin Only)
 */
attendanceRouter.get("/history/:staffId", adminAuthMiddleware, getStaffAttendanceHistoryForAdmin);

/**
 * @route   GET /api/attendance/today-dashboard-details
 * @desc    Fetch current day's complete checked-in institution roster and active QR details
 * @access  Private (Admin Only)
 */
attendanceRouter.get("/today-dashboard-details", adminAuthMiddleware, getTodayAttendanceDetails);


export default attendanceRouter;
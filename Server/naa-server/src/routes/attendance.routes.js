import express from "express";
import {
  generateAttendanceQR,
  expireAttendanceQR,
  markAttendance,
  getMyAttendanceHistory,
  getTodayAttendanceDetails,
  adminGetStaffList,
  adminGetIndividualStaffAttendance,
  adminOverrideAttendance,
} from "../controller/attendance.controller.js";

import { adminAuthMiddleware } from "../middleware/adminAuth.js";
import { staffAuthMiddleware } from "../middleware/staffAuth.js";

const attendanceRouter = express.Router();

// ==================== CORES QR LIFE CYCLE & ROSTERS (ADMIN) ====================

attendanceRouter.post(
  "/generate-qr",
  adminAuthMiddleware,
  generateAttendanceQR,
);

attendanceRouter.post(
  "/expire-qr", 
  adminAuthMiddleware, 
  expireAttendanceQR
);

// Existing endpoint for global daily summary tracking card records
attendanceRouter.get(
  "/today-details",
  adminAuthMiddleware,
  getTodayAttendanceDetails,
);

// ==================== SYSTEM WORKSPACE OVERRIDES (ADMIN) ====================

// Fetch alphabetized staff search rows filter
attendanceRouter.get(
  "/admin/staff-list",
  adminAuthMiddleware,
  adminGetStaffList,
);

// Fetch a single target staff history layout by their native document MongoDB _id
attendanceRouter.get(
  "/admin/staff-history/:id",
  adminAuthMiddleware,
  adminGetIndividualStaffAttendance,
);

// Atomically force or overwrite a staff member's target daily status
attendanceRouter.post(
  "/admin/override-attendance",
  adminAuthMiddleware,
  adminOverrideAttendance,
);

// ==================== STAFF PORTAL BOUND ACTION HANDLERS ====================

attendanceRouter.post(
  "/mark-attendance", 
  staffAuthMiddleware, 
  markAttendance
);

attendanceRouter.get(
  "/history/me",
  staffAuthMiddleware,
  getMyAttendanceHistory,
);

export default attendanceRouter;
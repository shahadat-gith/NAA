import express from "express";
import {
  generateAttendanceQR,
  expireAttendanceQR,
  markAttendance,
  getMyAttendanceHistory,               
  getTeacherAttendanceHistoryForAdmin,     
  getTodayAttendanceDetails,
} from "../controller/attendance.controller.js";

import { adminAuthMiddleware } from "../middleware/adminAuth.js";
import { authMiddleware } from "../middleware/auth.js";

const attendanceRouter = express.Router();

/* ====================== QR CODE ROUTES ====================== */
attendanceRouter.post("/generate-qr", adminAuthMiddleware, generateAttendanceQR);
attendanceRouter.post("/expire-qr", adminAuthMiddleware, expireAttendanceQR);

/* ====================== ATTENDANCE MARKING ====================== */
attendanceRouter.post("/mark-attendance", authMiddleware, markAttendance);

/* ====================== ATTENDANCE HISTORY ====================== */

// 1. TEACHER ROUTE: Uses authMiddleware -> reads req.user.id
attendanceRouter.get("/history/me", authMiddleware, getMyAttendanceHistory);

// 2. ADMIN ROUTE: Uses adminAuthMiddleware -> reads req.params.teacherId
attendanceRouter.get("/history/:teacherId", adminAuthMiddleware, getTeacherAttendanceHistoryForAdmin);

// 3. ADMIN DASHBOARD VIEW
attendanceRouter.get("/today-dashboard-details", adminAuthMiddleware, getTodayAttendanceDetails);

export default attendanceRouter;
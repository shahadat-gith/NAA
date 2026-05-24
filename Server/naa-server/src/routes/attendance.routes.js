import express from "express";
import {
  generateAttendanceQR,
  expireAttendanceQR,
  markAttendance,
  getTeacherAttendanceHistory,
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
// Me route uses authMiddleware -> sets req.user.id
attendanceRouter.get("/history/me", authMiddleware, getTeacherAttendanceHistory);

// Param route uses adminAuthMiddleware -> reads req.params.teacherId
attendanceRouter.get("/history/:teacherId", adminAuthMiddleware, getTeacherAttendanceHistory);

// Admin dashboard view
attendanceRouter.get(
  "/today-dashboard-details", 
  adminAuthMiddleware, 
  getTodayAttendanceDetails
);

export default attendanceRouter;
import express from "express";
import {
  generateAttendanceQR,
  getAttendanceQR,
  expireAttendanceQR,
  markAttendance,
  getTeacherAttendanceHistory,
  getTodaysAttendanceHistory,
} from "../controller/attendance.controller.js";

import { adminAuthMiddleware } from "../middleware/adminAuth.js";
import { authMiddleware } from "../middleware/auth.js";

const attendanceRouter = express.Router();

/* ====================== QR CODE ROUTES ====================== */

attendanceRouter.post(
  "/generate-qr",
  adminAuthMiddleware,
  generateAttendanceQR
);

attendanceRouter.get("/get-qr", getAttendanceQR);

attendanceRouter.post(
  "/expire-qr",
  adminAuthMiddleware,
  expireAttendanceQR
);

/* ====================== ATTENDANCE MARKING ====================== */

attendanceRouter.post(
  "/mark-attendance",
  authMiddleware, 
  markAttendance
);

/* ====================== ATTENDANCE HISTORY ====================== */

// Teacher can view their own history (recommended)
attendanceRouter.get(
  "/history/me",
  authMiddleware,
  getTeacherAttendanceHistory
);

// Admin can view any teacher's history
attendanceRouter.get(
  "/history/:teacherId",
  adminAuthMiddleware,
  getTeacherAttendanceHistory
);

// Admin: Get Today's Full Attendance
attendanceRouter.get(
  "/today",
  adminAuthMiddleware,
  getTodaysAttendanceHistory
);

export default attendanceRouter;
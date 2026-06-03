import express from "express";
import {
  generateAttendanceQR,
  expireAttendanceQR,
  markAttendance,
  getMyAttendanceHistory,
  getStaffAttendanceHistoryForAdmin,
  getTodayAttendanceDetails,
  getStaffAttendanceOverview,
  getDetailedTeacherAttendance,
} from "../controller/attendance.controller.js";

import { adminAuthMiddleware } from "../middleware/adminAuth.js";
import { staffAuthMiddleware } from "../middleware/staffAuth.js";

const attendanceRouter = express.Router();


attendanceRouter.post(
  "/generate-qr",
  adminAuthMiddleware,
  generateAttendanceQR,
);


attendanceRouter.post("/expire-qr", adminAuthMiddleware, expireAttendanceQR);


attendanceRouter.post("/mark-attendance", staffAuthMiddleware, markAttendance);



attendanceRouter.get(
  "/history/me",
  staffAuthMiddleware,
  getMyAttendanceHistory,
);


attendanceRouter.get(
  "/history/:staffId",
  adminAuthMiddleware,
  getStaffAttendanceHistoryForAdmin,
);


attendanceRouter.get(
  "/today-dashboard-details",
  adminAuthMiddleware,
  getTodayAttendanceDetails,
);



attendanceRouter.get(
  "/overview",
  getStaffAttendanceOverview,
);


attendanceRouter.get(
  "/staff/:id",
  getDetailedTeacherAttendance,
);

export default attendanceRouter;

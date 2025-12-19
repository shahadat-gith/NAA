import express from "express";
import { upload } from "../config/multer.js";
import {
  addTeacher,
  getAllTeachers,
  deleteTeacher,
  getOneTeacher,
  recordTransaction,
  getAllTransactions,
  acknowledgeSalary,
  updateBankDetails,
  markAttendance,
  unmarkAttendance,
  getAttendanceReport,
  getAttendanceHistory,
  updateProfilePicture,
  UpdateDueBalance,
} from "../controller/teacher.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const teacherRouter = express.Router();


// Routes
teacherRouter.post("/add-teacher", upload.single("image"), authMiddleware, addTeacher);
teacherRouter.get("/all-teachers", getAllTeachers);
teacherRouter.delete("/delete-teacher/:teacherId", authMiddleware, deleteTeacher);
teacherRouter.get("/teacher/:teacherId", authMiddleware, getOneTeacher);
teacherRouter.post("/record-transaction", authMiddleware, recordTransaction);
teacherRouter.post("/get-all-transactions", authMiddleware, getAllTransactions);
teacherRouter.put("/acknowledge-salary/:transactionId", authMiddleware, acknowledgeSalary);
teacherRouter.put("/update-bank-details", authMiddleware, updateBankDetails);
teacherRouter.post("/mark-attendance", authMiddleware, markAttendance);
teacherRouter.post("/unmark-attendance", authMiddleware, unmarkAttendance);
teacherRouter.post("/get-attendance-report", authMiddleware, getAttendanceReport);
teacherRouter.get("/attendance-history", authMiddleware, getAttendanceHistory);
teacherRouter.post("/update-profile-picture", upload.single("profilePicture"), authMiddleware, updateProfilePicture);
teacherRouter.put("/update-due-balance", authMiddleware, UpdateDueBalance);

export default teacherRouter;
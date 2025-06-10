import express from "express";
import multer from "multer";
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
} from "../controller/teacherController.js";
import { authMiddleware } from "../middleware/auth.js";

const teacherRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/teachers");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

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
teacherRouter.post("/update-profile-picture", upload.single("profilePicture"),updateProfilePicture);
teacherRouter.put("/update-due-balance", authMiddleware, UpdateDueBalance);

export default teacherRouter;
import express from "express";
import multer from "multer";
import path from "path";
import {
  getAllStudents,
  getStudentById,
  updateAdmissionStatus,
  deleteStudent,
  searchStudents,
  recordPayment,
  verifyPayment,
  submitStudentAdmission,
  massAdminAdmission,
  addMonthlyFeeToClass,
  getStudentResults,
  updateDueAmount,
  getTransactions,
  updateHostelFee,
  deleteHostelAdmission,
  promoteStudents,
} from "../controller/StudentControllers.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// ========== Multer Storage for Images ==========
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/admissions/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const imageUpload = multer({
  storage: imageStorage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only JPEG, JPG, and PNG images are allowed"));
  },
});

const storage = multer.memoryStorage();
const upload = multer({ storage });


// ========== Student Routes ==========
router.get("/", getAllStudents);
router.get("/search", searchStudents);
router.get("/:id", getStudentById);
router.put("/:id/status", updateAdmissionStatus);
router.delete("/:id", deleteStudent);
router.post("/payment", recordPayment);
router.post("/payment/verify", verifyPayment);
router.post("/admission", imageUpload.single("image"), submitStudentAdmission);
router.post("/mass-admission", upload.single("file"), massAdminAdmission);
router.post("/add-monthly-fee", addMonthlyFeeToClass);
router.get("/results", getStudentResults);
router.put("/:id/due", updateDueAmount);
router.get("/:studentId/transactions/:type", getTransactions);
router.put("/hostel-fee", updateHostelFee);
router.put("/:studentId/hostel/remove", deleteHostelAdmission);
router.post("/promote-students", authMiddleware, promoteStudents); // Admin only

export default router;

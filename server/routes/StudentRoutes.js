import express from "express";
import { excelUpload } from "../config/multer.js";
import {
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  createAdmission,
  massAdmission,
  createResult,
  massResults,
  getAllResults,
  updateResult,
  deleteResult,
  getSpecificResult,
} from "../controller/StudentController.js";

const studentRouter = express.Router();

/* ================= STUDENTS ================= */
studentRouter.get("/list", getAllStudents); // Changed from "/" to avoid conflicts with other root routes
studentRouter.get("/single/:id", getStudentById);
studentRouter.put("/update/:id", updateStudent);
studentRouter.delete("/delete/:id", deleteStudent);

/* ================= ADMISSIONS ================= */

studentRouter.post("/admission", createAdmission);
studentRouter.post("/admission/mass", excelUpload.single("file"), massAdmission);

/* ================= RESULTS ================= */

// 1. Static/Specific POST routes first
studentRouter.post("/result/fetch", getSpecificResult); // Public search for student result
studentRouter.post("/result/mass", excelUpload.single("file"), massResults); // Admin mass upload
studentRouter.post("/result", createResult); // Admin single create

// 2. Collection GET routes
studentRouter.get("/results", getAllResults); // Admin fetch all results
studentRouter.put("/result/:id", updateResult);
studentRouter.delete("/result/:id", deleteResult);

export default studentRouter;
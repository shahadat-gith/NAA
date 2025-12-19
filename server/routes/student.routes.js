import express from "express";
import { excelUpload } from "../config/multer.js";

import {
    createAdmission, deleteStudent,
    getAllStudents, getStudentById,
    massAdmission, SearchStudentsByName,
    updateStudent
}

    from "../controller/student.controller.js";

import {
    createResult, deleteResult,
    getAllResults, getSpecificResult,
    massResults, updateResult
}
    from "../controller/result.controller.js";

import { adminAuthMiddleware } from "../middleware/adminAuth.js";


const studentRouter = express.Router();

/* ================= STUDENTS ================= */
studentRouter.get("/list", adminAuthMiddleware, getAllStudents);
studentRouter.get("/single/:id", getStudentById);
studentRouter.put("/update/:id", updateStudent);
studentRouter.delete("/delete/:id", deleteStudent);
studentRouter.post("/search", SearchStudentsByName);

/* ================= ADMISSIONS ================= */

studentRouter.post("/admission", createAdmission);
studentRouter.post("/admission/mass", adminAuthMiddleware, excelUpload.single("file"), massAdmission);

/* ================= RESULTS ================= */

// 1. Static/Specific POST routes first
studentRouter.post("/result/fetch", getSpecificResult); // Public search for student result
studentRouter.post("/result/mass", adminAuthMiddleware, excelUpload.single("file"), massResults); // Admin mass upload
studentRouter.post("/result", adminAuthMiddleware, createResult); // Admin single create

// 2. Collection GET routes
studentRouter.get("/results", adminAuthMiddleware, getAllResults); // Admin fetch all results
studentRouter.put("/result/:id", adminAuthMiddleware, updateResult);
studentRouter.delete("/result/:id", adminAuthMiddleware, deleteResult);

export default studentRouter;
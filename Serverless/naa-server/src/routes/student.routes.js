import express from "express";
import { excelUpload } from "../config/multer.js";

import {
    createNewStudentAdmission,
    deleteStudent,
    getAdmissionById,
    getAdmissions,
    getAllStudents, getStudentById,
    massAdmission, SearchStudentsByName,
    verifyAdmission
}

    from "../controller/student.controller.js";

import { adminAuthMiddleware } from "../middleware/adminAuth.js";


const studentRouter = express.Router();

/* ================= STUDENTS ================= */
studentRouter.get("/list", adminAuthMiddleware, getAllStudents);
studentRouter.get("/single/:id", getStudentById);
studentRouter.post("/search", SearchStudentsByName);
studentRouter.delete("/:id", adminAuthMiddleware, deleteStudent)

/* ================= ADMISSIONS ================= */

studentRouter.post("/admission/new", createNewStudentAdmission);
studentRouter.post("/admission/mass", adminAuthMiddleware, excelUpload.single("file"), massAdmission);
studentRouter.get("/admissions", getAdmissions);
studentRouter.get("/admission-data", getAdmissionById);
studentRouter.post("/verify-admission", verifyAdmission);


export default studentRouter;
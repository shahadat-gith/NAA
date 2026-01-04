import express from "express";
import { excelUpload } from "../config/multer.js";

import {
    addMassStudents,
    addSingleStudent,
    createNewStudentAdmission,
    deleteStudent,
    getAdmissionById,
    getAdmissions,
    getAllStudents, getStudentById,
    promoteStudents,
    SearchStudentsByName,
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
studentRouter.post("/add/mass", adminAuthMiddleware, excelUpload.single("file"), addMassStudents);
studentRouter.post("/add/single", adminAuthMiddleware, addSingleStudent);
studentRouter.post("/promote", adminAuthMiddleware, promoteStudents)

/* ================= ADMISSIONS ================= */

studentRouter.post("/admission/new", createNewStudentAdmission);
studentRouter.get("/admissions", getAdmissions);
studentRouter.get("/admission-data", getAdmissionById);
studentRouter.post("/verify-admission", verifyAdmission);


export default studentRouter;
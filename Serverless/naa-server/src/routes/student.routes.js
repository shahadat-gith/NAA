import express from "express";
import { excelUpload } from "../config/multer.js";

import {
    addMassStudents,
    addSingleStudent,
    deleteStudent,
    getAllStudents, getStudentById,
    getStudentByRegistrationNo,
    promoteStudents,
    SearchStudentsByName,
    toggleAdmitCardPermission,
    updateStudent
}

    from "../controller/student.controller.js";

import { adminAuthMiddleware } from "../middleware/adminAuth.js";


const studentRouter = express.Router();

studentRouter.get("/list", adminAuthMiddleware, getAllStudents);
studentRouter.get("/single/:id", getStudentById);
studentRouter.get("/by-registration/:registrationNo", getStudentByRegistrationNo);
studentRouter.post("/search", SearchStudentsByName);
studentRouter.delete("/:id", adminAuthMiddleware, deleteStudent);
studentRouter.post("/add/mass", adminAuthMiddleware, excelUpload.single("file"), addMassStudents);
studentRouter.post("/add/single", adminAuthMiddleware, addSingleStudent);
studentRouter.post("/promote", adminAuthMiddleware, promoteStudents);
studentRouter.put("/toggle-admit-card/:id", adminAuthMiddleware, toggleAdmitCardPermission);
studentRouter.put("/:id", adminAuthMiddleware, updateStudent);


export default studentRouter;
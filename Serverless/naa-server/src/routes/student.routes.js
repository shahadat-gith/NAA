import express from "express";
import { excelUpload, upload } from "../config/multer.js";

import {
    acceptProfilePicture,
    addMassStudents,
    addSingleStudent,
    deleteStudent,
    getAllStudents, getStudentById,
    promoteStudents,
    SearchStudent,
    toggleAdmitCardPermission,
    updateStudent,
    uploadTempProfilePicture
}

    from "../controller/student.controller.js";

import { adminAuthMiddleware } from "../middleware/adminAuth.js";


const studentRouter = express.Router();

studentRouter.get("/list", adminAuthMiddleware, getAllStudents);
studentRouter.get("/single/:id", getStudentById);
studentRouter.post("/search", SearchStudent);
studentRouter.delete("/:id", adminAuthMiddleware, deleteStudent);
studentRouter.post("/add/mass", adminAuthMiddleware, excelUpload.single("file"), addMassStudents);
studentRouter.post("/add/single", adminAuthMiddleware, addSingleStudent);
studentRouter.post("/promote", adminAuthMiddleware, promoteStudents);
studentRouter.put("/toggle-admit-card/:id", adminAuthMiddleware, toggleAdmitCardPermission);
studentRouter.put("/:id", adminAuthMiddleware, updateStudent);

studentRouter.post("/upload-temp-profile-pic/:id", upload.single("file"), uploadTempProfilePicture);
studentRouter.post("/accept-profile-pic", adminAuthMiddleware, acceptProfilePicture);
export default studentRouter;
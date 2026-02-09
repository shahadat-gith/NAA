import express from "express";
import { createAdmission, getAllAdmissions, verifyAdmission, deleteAdmission, getAdmissionById } from "../controller/admission.controller.js";
import { adminAuthMiddleware } from "../middleware/adminAuth.js";

const admissionRouter = express.Router();

// Create a new admission (public)
admissionRouter.post("/create", createAdmission);

// Get all admissions (admin only)
admissionRouter.get("/list", adminAuthMiddleware, getAllAdmissions);

admissionRouter.get("/single/:id", adminAuthMiddleware, getAdmissionById);

// Verify an admission and create a student record (admin only)
admissionRouter.post("/verify", adminAuthMiddleware, verifyAdmission);

// Delete an admission (admin only)
admissionRouter.delete("/:id", adminAuthMiddleware, deleteAdmission);

export default admissionRouter;

import express from "express";
import { excelUpload } from "../config/multer.js";
import { adminAuthMiddleware } from "../middleware/adminAuth.js";
import {
  uploadResults,
  getResultByRegistration,
  updateResult,
  deleteResult,
  getAllResults,
} from "../controller/result.controller.js";

const resultRouter = express.Router();

// Upload results via Excel file (Admin only)
resultRouter.post(
  "/upload",
  adminAuthMiddleware,
  excelUpload.single("file"),
  uploadResults
);


// get all results with optional filters (Admin only)
resultRouter.get("/", adminAuthMiddleware, getAllResults);


// Get result by registration number (Public)
resultRouter.get("/:registrationNo", getResultByRegistration);

// Update result (Admin only)
resultRouter.put(
  "/:registrationNo",
  adminAuthMiddleware,
  updateResult
);

// Delete result (Admin only)
resultRouter.delete("/:registrationNo", adminAuthMiddleware, deleteResult);

export default resultRouter;

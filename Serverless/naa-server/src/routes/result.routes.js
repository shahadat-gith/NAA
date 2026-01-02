import express from "express";
import { excelUpload } from "../config/multer.js";
import { adminAuthMiddleware } from "../middleware/adminAuth.js";

import {
  uploadResults,
  createResult,
  getAllResults,
  getSpecificResult,
  updateResult,
  deleteResult,
  updateResultVisibility,
} from "../controller/result.controller.js";

const resultRouter = express.Router();

// Excel upload (Admin only)
resultRouter.post("/upload", adminAuthMiddleware, excelUpload.single("file"), uploadResults);

// Create single result (Admin only)
resultRouter.post("/create", adminAuthMiddleware, createResult);

// Get all results (Admin only)
resultRouter.post("/all", adminAuthMiddleware, getAllResults);

// Get specific result (Public)
resultRouter.post("/fetch", getSpecificResult);

resultRouter.post("/update-visibility", adminAuthMiddleware, updateResultVisibility);
// Update result (Admin only)
resultRouter.post("/update", adminAuthMiddleware, updateResult);

// Delete result (Admin only)
resultRouter.post("/delete", adminAuthMiddleware, deleteResult);

export default resultRouter;

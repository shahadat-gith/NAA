import express from "express";
import { uploadResult, getSingleResult, uploadSingleResult } from "../controller/resultController.js";
import multer from "multer";
import { authMiddleware } from "../middleware/auth.js";

const resultRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

resultRouter.post("/upload-results",authMiddleware,  upload.single("file"), uploadResult); // Admin only
resultRouter.post("/upload-single-result", authMiddleware, uploadSingleResult); // Admin only
resultRouter.post("/get-single-result", getSingleResult); // Public access


export default resultRouter;
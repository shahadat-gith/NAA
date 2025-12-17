import express from "express";
import { uploadResult, getSingleResult, uploadSingleResult } from "../controller/resultController.js";
import multer from "multer";
import { authMiddleware } from "../middleware/auth.js";

const resultRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

resultRouter.post("/upload-results",authMiddleware,  upload.single("file"), uploadResult);
resultRouter.post("/upload-single-result", authMiddleware, uploadSingleResult); 
resultRouter.post("/get-result", getSingleResult); 


export default resultRouter;
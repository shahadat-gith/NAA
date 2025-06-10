import express from "express";
import { addEvents, addNotice, getEvents, getNotices } from "../controller/adminController.js";
import { authMiddleware } from "../middleware/auth.js";
import multer from "multer";


const adminRouter = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/notices");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
});

// Routes
adminRouter.post("/add-notice", authMiddleware, upload.single("pdf"), addNotice);
adminRouter.get("/get-notices", getNotices);
adminRouter.post("/add-event", authMiddleware, addEvents);
adminRouter.get("/get-events",getEvents);

export default adminRouter;
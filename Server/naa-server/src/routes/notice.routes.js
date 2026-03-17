import express from "express";
import { createNotice, getNotices, getNoticeById, deleteNotice } from "../controller/notice.controller.js";
import { adminAuthMiddleware } from "../middleware/adminAuth.js";
import { upload } from "../config/multer.js";

const noticeRouter = express.Router();
    
noticeRouter.post("/", adminAuthMiddleware, upload.single("file"), createNotice);
noticeRouter.get("/", getNotices);
noticeRouter.get("/:id", getNoticeById);
noticeRouter.delete("/:id", adminAuthMiddleware, deleteNotice);

export default noticeRouter;
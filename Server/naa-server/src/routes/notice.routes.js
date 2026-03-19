import express from "express";
import { createNotice, getNotices, getNoticeById, deleteNotice, updateNotice } from "../controller/notice.controller.js";
import { adminAuthMiddleware } from "../middleware/adminAuth.js";
import { upload } from "../config/multer.js";

const noticeRouter = express.Router();
    
noticeRouter.post("/", adminAuthMiddleware, upload.single("file"), createNotice);
noticeRouter.get("/", getNotices);
noticeRouter.get("/:id", getNoticeById);
noticeRouter.delete("/:id", adminAuthMiddleware, deleteNotice);
noticeRouter.put("/:id", adminAuthMiddleware, upload.single("file"), updateNotice);

export default noticeRouter;
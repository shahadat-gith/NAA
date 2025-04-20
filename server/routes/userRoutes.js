import express from "express";
import { adminLogin, teacherLogin, getTeacherProfile } from "../controller/authController.js";
import { authMiddleware } from "../middleware/auth.js";

export const userRouter = express.Router();
userRouter.post("/teacher-login", teacherLogin);
userRouter.post("/admin-login", adminLogin);
userRouter.get("/teacher/me", authMiddleware, getTeacherProfile);

export default userRouter;
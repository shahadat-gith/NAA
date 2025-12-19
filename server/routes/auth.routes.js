import express from "express";
import { adminLogin, teacherLogin, getTeacherProfile, forgotPasswordTeacher } from "../controller/authController.js";
import { authMiddleware } from "../middleware/auth.js";

export const userRouter = express.Router();

// Teacher login
userRouter.post("/teacher-login", teacherLogin);

// Admin login
userRouter.post("/admin-login", adminLogin);

// Get authenticated teacher profile
userRouter.get("/teacher/me", authMiddleware, getTeacherProfile);

// Teacher password reset (send OTP, verify OTP, reset password)
userRouter.post("/forgot-password/teacher", forgotPasswordTeacher);

export default userRouter;
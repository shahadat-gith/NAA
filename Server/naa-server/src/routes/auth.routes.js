import express from "express";
import { 
  adminLogin, 
  teacherLogin, 
  getTeacherProfile, 
  forgotPasswordTeacher,
  updatePassword // Imported your new in-app change password controller
} from "../controller/auth.controller.js";
import { authMiddleware } from "../middleware/auth.js";

export const userRouter = express.Router();

// Teacher login
userRouter.post("/teacher-login", teacherLogin);

// Admin login
userRouter.post("/admin-login", adminLogin);

// Get authenticated teacher profile
userRouter.get("/teacher/me", authMiddleware, getTeacherProfile);

// Teacher password reset (send OTP, verify OTP, reset password via contact field lookup)
userRouter.post("/forgot-password/teacher", forgotPasswordTeacher);

// In-App Change Password (Requires valid active session authentication token)
userRouter.put("/teacher/update-password", authMiddleware, updatePassword);

export default userRouter;
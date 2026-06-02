import express from "express";
import { 
  adminLogin, 
  staffLogin,          // Updated controller mapping
  getStaffProfile,     // Updated controller mapping
  forgotPasswordStaff, // Updated controller mapping
  updatePassword 
} from "../controller/auth.controller.js";
import { staffAuthMiddleware } from "../middleware/staffAuth.js"; // Swapped out legacy authMiddleware

export const authRouter = express.Router();

// =========================================================================
// 🔓 PUBLIC AUTH ENDPOINTS
// =========================================================================

/**
 * @route   POST /api/auth/staff-login
 * @desc    Authenticate teaching or non-teaching personnel via mobile contact & password
 */
authRouter.post("/staff-login", staffLogin);

/**
 * @route   POST /api/auth/admin-login
 * @desc    Authenticate central academy administration credentials
 */
authRouter.post("/admin-login", adminLogin);

/**
 * @route   POST /api/auth/forgot-password/staff/:step
 * @desc    Multi-step account recovery wizard channel (send-otp -> verify-otp -> reset-password)
 */
authRouter.post("/forgot-password/staff/:step", forgotPasswordStaff);


// =========================================================================
// 🔒 PROTECTED STAFF SELF-SERVICE ENDPOINTS (Requires Valid Staff Token)
// =========================================================================

/**
 * @route   GET /api/auth/staff/me
 * @desc    Fetch active profile properties for the logged-in user
 */
authRouter.get("/staff/me", staffAuthMiddleware, getStaffProfile);

/**
 * @route   PUT /api/auth/staff/update-password
 * @desc    In-App settings credential rotation (requires current password confirmation)
 */
authRouter.put("/staff/update-password", staffAuthMiddleware, updatePassword);


export default authRouter;
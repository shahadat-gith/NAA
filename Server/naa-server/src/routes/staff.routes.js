import express from "express";
import {
  createStaff,
  updateStaffDetails,
  getStaffProfile,
  getStaffById,
  getAllStaff,
  verifyStaff,
  updateTimetable,
  getTimetable,
  getStaffDashboard,
  deleteStaff
} from "../controller/staff.controller.js";

import { adminAuthMiddleware } from "../middleware/adminAuth.js"; // Admin verification guard
import { staffAuthMiddleware } from "../middleware/staffAuth.js"; // Logged-in Staff validation guard
import { upload } from "../config/multer.js";

const staffRouter = express.Router();

// =========================================================================
// 🔓 PUBLIC ENDPOINTS
// =========================================================================

/**
 * @route   POST /api/staff/register
 * @desc    Public staff self-registration portal (Processes profile image via Multer)
 */
staffRouter.post("/register", upload.single("image"), createStaff);


// =========================================================================
// 🔒 STAFF WORKSPACE ENDPOINTS (Requires Staff Token)
// =========================================================================

/**
 * @route   GET /api/staff/profile
 * @desc    Fetch self profile values
 */
staffRouter.get("/profile", staffAuthMiddleware, getStaffProfile);

/**
 * @route   PUT /api/staff/update
 * @desc    Modify self profile parameters, passwords, or swap avatar media assets
 */
staffRouter.put("/update", staffAuthMiddleware, upload.single("image"), updateStaffDetails);

/**
 * @route   GET /api/staff/dashboard
 * @desc    Get cumulative self attendance arrays and conditional class timetables
 */
staffRouter.get("/dashboard", staffAuthMiddleware, getStaffDashboard);

/**
 * @route   PUT /api/staff/timetable/update
 * @desc    Update class slots for a specific day array (Teaching staff restricted)
 */
staffRouter.put("/timetable/update", staffAuthMiddleware, updateTimetable);


// =========================================================================
// 🛠️ ADMINISTRATIVE MANAGEMENT ENDPOINTS (Requires Admin Token Only)
// =========================================================================

/**
 * @route   GET /api/staff/all
 * @desc    Extract master array directory list of all records
 */
staffRouter.get("/all", getAllStaff);

/**
 * @route   PUT /api/staff/verify/:id
 * @desc    Allocate an institutional permanent Staff ID and flag status to "Active"
 */
staffRouter.put("/verify/:id", adminAuthMiddleware, verifyStaff);

/**
 * @route   GET /api/staff/timetable/:id
 * @desc    Inspect a target employee's class scheduling array profile via ID parameter
 */
staffRouter.get("/timetable/me",staffAuthMiddleware, getTimetable);

/**
 * @route   GET /api/staff/:id
 * @desc    Inspect specific profile data attributes
 */
staffRouter.get("/:id", adminAuthMiddleware, getStaffById);

/**
 * @route   DELETE /api/staff/:id
 * @desc    Purge Cloudinary media file, drop attendance history documents, delete timetable and drop account
 */
staffRouter.delete("/:id", adminAuthMiddleware, deleteStaff);


export default staffRouter;
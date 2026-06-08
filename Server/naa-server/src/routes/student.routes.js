import express from "express";

import {
  deleteStudent,
  getAllStudents,
  getStudentById,
  promoteStudents,
  SearchStudent,
  toggleAdmitCardPermission,
  updateStudent,
} from "../controller/student.controller.js";

import { adminAuthMiddleware } from "../middleware/adminAuth.js";
import { upload } from "../config/multer.js";

const studentRouter = express.Router();

studentRouter.get(
  "/list",
  adminAuthMiddleware,
  getAllStudents
);

studentRouter.get(
  "/single/:id",
  getStudentById
);

studentRouter.post(
  "/search",
  SearchStudent
);

studentRouter.delete(
  "/:id",
  adminAuthMiddleware,
  deleteStudent
);

studentRouter.post(
  "/promote",
  adminAuthMiddleware,
  promoteStudents
);

studentRouter.put(
  "/toggle-admit-card/:id",
  adminAuthMiddleware,
  toggleAdmitCardPermission
);

studentRouter.put(
  "/:id",
  adminAuthMiddleware,
  upload.single("image"),
  updateStudent
);

export default studentRouter;
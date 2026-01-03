import express from "express";
import { upload } from "../config/multer.js";
import {
  addTeacher,
  getAllTeachers,
  deleteTeacher,
  getOneTeacher,
  updateTeacherDetails,
} from "../controller/teacher.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const teacherRouter = express.Router();

teacherRouter.post(
  "/add-teacher",
  authMiddleware,
  upload.single("image"),
  addTeacher
);


teacherRouter.get("/all-teachers", getAllTeachers);


teacherRouter.get(
  "/teacher/:id",
  authMiddleware,
  getOneTeacher
);


teacherRouter.put(
  "/update-teacher/:id",
  authMiddleware,
  upload.single("image"),
  updateTeacherDetails
);


teacherRouter.delete(
  "/delete-teacher/:id",
  authMiddleware,
  deleteTeacher
);

export default teacherRouter;

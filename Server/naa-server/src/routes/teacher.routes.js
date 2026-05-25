import express from "express";
import { upload } from "../config/multer.js";
import {
  addTeacher,
  getAllTeachers,
  deleteTeacher,
  getTeacherById,
  updateTeacherDetails,
  getTeacherDashboard,
  updateTimetable,
} from "../controller/teacher.controller.js";

import { authMiddleware } from "../middleware/auth.js";

const teacherRouter = express.Router();

teacherRouter.post("/add-teacher",authMiddleware,upload.single("image"),addTeacher);

teacherRouter.get("/all-teachers", getAllTeachers);

teacherRouter.get("/details/:id",authMiddleware,getTeacherById);
teacherRouter.get("/dashboard",authMiddleware, getTeacherDashboard);
teacherRouter.put("/timetable/update",authMiddleware,updateTimetable);

teacherRouter.post("/update",authMiddleware,upload.single("image"),updateTeacherDetails);

teacherRouter.delete("/delete-teacher/:id",authMiddleware,deleteTeacher);


export default teacherRouter;

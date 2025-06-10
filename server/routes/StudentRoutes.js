import express from "express";
import {
  getAllStudents,
  getStudentById,
  massAddStudents,
  updateStudent,
  deleteStudent,
  createStudent,
  updateMonthlyDuesForClass,
  updateHostelDues,
  addPayment,
  removeHostelStatus,
  createPaymentOrder,
  verifyPayment,
  updateAdmissionFees,
  getPaymentDetails,
} from "../controller/StudentController.js";

const StudentRouter = express.Router();

StudentRouter.post("/create-single", createStudent);
StudentRouter.post("/mass-upload", massAddStudents);

StudentRouter.get("/", getAllStudents);
StudentRouter.get("/:id", getStudentById);

StudentRouter.put("/:id", updateStudent);
StudentRouter.delete("/:id", deleteStudent);

StudentRouter.post("/update-monthly-dues", updateMonthlyDuesForClass);
StudentRouter.post("/update-hostel-dues", updateHostelDues);
StudentRouter.post("/update-admission-fees", updateAdmissionFees);
StudentRouter.post("/:id/payments", addPayment);
StudentRouter.put("/:id/hostel/remove", removeHostelStatus);

StudentRouter.post("/:id/payment", createPaymentOrder);
StudentRouter.post("/:id/payment/verify", verifyPayment);
StudentRouter.get("/:id/payments/:paymentId", getPaymentDetails);

export default StudentRouter;
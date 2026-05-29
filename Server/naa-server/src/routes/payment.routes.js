import { teacherCashPayment, teacherPaymentDashboardData,createDuesForTeacher,
    getPaymentDetailsByTeacherId, acknowledgePayment} from "../controller/payment.controller.js";
import express from "express";

import { adminAuthMiddleware } from "../middleware/adminAuth.js";
import { authMiddleware } from "../middleware/auth.js";


const paymentRouter = express.Router();

//for admin
paymentRouter.get("/admin/dashboard-data", adminAuthMiddleware, teacherPaymentDashboardData);
paymentRouter.post("/teacher/pay-cash", adminAuthMiddleware, teacherCashPayment);
paymentRouter.post("/teacher/create-dues", adminAuthMiddleware, createDuesForTeacher);
paymentRouter.get("/admin/teacher-payment-details/:teacherId", adminAuthMiddleware, getPaymentDetailsByTeacherId);
//for teacher
paymentRouter.get("/teacher/details", authMiddleware, getPaymentDetailsByTeacherId);
paymentRouter.patch("/teacher/acknowledge/:paymentId", authMiddleware, acknowledgePayment);

export default paymentRouter;
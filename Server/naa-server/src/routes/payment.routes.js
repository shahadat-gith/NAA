import { teacherCashPayment, paymentDashboardData,createDuesForTeacher } from "../controller/payment.controller.js";
import express from "express";

import { adminAuthMiddleware } from "../middleware/adminAuth.js";


const paymentRouter = express.Router();

paymentRouter.get("/admin/dashboard-data", adminAuthMiddleware, paymentDashboardData);
paymentRouter.post("/teacher/pay-cash", adminAuthMiddleware, teacherCashPayment);
paymentRouter.post("/teacher/create-dues", adminAuthMiddleware, createDuesForTeacher);

export default paymentRouter;
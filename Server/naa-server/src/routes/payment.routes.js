import express from "express";

import { createOrder, paymentVerification } from "../controller/payment.controller.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-order", createOrder);
paymentRouter.post("/payment-verification", paymentVerification);

export default paymentRouter;
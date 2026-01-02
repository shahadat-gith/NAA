import Razorpay from "razorpay";
import Payment from "../models/Student/payment.js";
import Student from "../models/Student/student.js";
import Dues from "../models/Student/dues.js";
import Admission from "../models/Student/admission.js";
import crypto from "crypto";
import mongoose from "mongoose";
import { getAmountForClass } from "../utils/utility.js";

const rzp_instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});


export const createOrder = async (req, res) => {
  try {
    const { class: studentClass, medium, stream, type } = req.body;

    const amount = await getAmountForClass(
      studentClass,
      medium,
      type,
      stream
    );

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await rzp_instance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
      key: process.env.RAZORPAY_API_KEY,
    });
  } catch (error) {
    console.error("createOrder error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating order",
    });
  }
};


export const paymentVerification = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      studentId,
      academicSession,
      feeType,
      month,
    } = req.body;

    /* ---------- VERIFY SIGNATURE ---------- */
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    /* ---------- CHECK DUPLICATE PAYMENT ---------- */
    const alreadyPaid = await Payment.findOne(
      {
        student: studentId,
        academicSession,
        feeType,
        ...(feeType === "monthlyFee" ? { month } : {}),
        status: "success",
      },
      null,
      { session }
    );

    if (alreadyPaid) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Fee already paid",
      });
    }

    /* ---------- FETCH STUDENT ---------- */
    const student = await Student.findById(studentId).session(session);
    if (!student) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    /* ---------- CALCULATE AMOUNT (SECURITY) ---------- */
    const amount = await getAmountForClass(
      student.class,
      student.medium,
      feeType,
      student.stream
    );

    /* ---------- SAVE PAYMENT ---------- */
    const [payment] = await Payment.create(
      [
        {
          student: studentId,
          academicSession,
          feeType,
          month: feeType === "monthlyFee" ? month : null,
          amount,
          paymentMode: "online",
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: "success",
        },
      ],
      { session }
    );

    /* ---------- UPDATE DUES ---------- */
    await Dues.findOneAndUpdate(
      { student: studentId, type: feeType },
      { dueAmount: 0, lastUpdated: new Date() },
      { session }
    );

    /* ---------- UPDATE ADMISSION ---------- */
    if (feeType === "admissionFee") {
      await Admission.findOneAndUpdate(
        { student: studentId, academicSession },
        { isAdmissionFeePaid: true },
        { session }
      );
    }

    await session.commitTransaction();

    /* ---------- SEND DATA TO FRONTEND ---------- */
    return res.status(200).json({
      success: true,
      message: "Payment verified and recorded successfully",
      payment,
      student,
    });

  } catch (error) {
    await session.abortTransaction();
    console.error("paymentVerification error:", error);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

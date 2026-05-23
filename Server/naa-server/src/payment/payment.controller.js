import Razorpay from "razorpay";
import Payment from "./payment.js"; // Capitalized to match model export standards
import Student from "../models/Student/student.js";
import Dues from "../models/Student/dues.js";
import { teacherModel } from "../models/Teacher/teacher.js";
import crypto from "crypto";
import mongoose from "mongoose";
import Fee from "../models/Settings/fees.js";

export const getAmountForClass = async (studentClass,medium,stream = null) => {
  try {
    const feesSettings = await Fee.findOne().lean();
    if (!feesSettings) {
      throw new Error("Fees settings not found");
    }

    /* ---------- VALIDATE MEDIUM ---------- */
    if (!feesSettings[medium]) {
      throw new Error("Invalid medium selection");
    }

    let amount;

    /* ---------- HANDLE HIGHER SECONDARY ---------- */
    if (studentClass === "11" || studentClass === "12") {
      if (!stream) {
        throw new Error("Stream is required for class 11 and 12");
      }

      amount = feesSettings[medium]?.[studentClass]?.[stream];
    }
    /* ---------- NORMAL CLASSES ---------- */
    else {
      amount = feesSettings[medium]?.[studentClass];
    }

    if (amount === undefined) {
      throw new Error("Invalid class configurations for selected medium");
    }

    return amount || 0;
  } catch (error) {
    throw error;
  }
};

const razorpay = new Razorpay({
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
      amount: amount * 100, // Razorpay works in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

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
      month, // e.g., "May"
      year,  // e.g., 2026
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

    /* ---------- CHECK DUPLICATE PAYMENT (UPDATED) ---------- */
    const alreadyPaid = await Payment.findOne(
      {
        userType: "Student",
        user: studentId,
        month,
        year,
        status: "success",
      },
      null,
      { session }
    );

    if (alreadyPaid) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Fee for this month and year has already been paid",
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

    /* ---------- CALCULATE AMOUNT ---------- */
    const amount = await getAmountForClass(
      student.class,
      student.medium,
      student.stream
    );

    /* ---------- SAVE PAYMENT RECORD (UPDATED) ---------- */
    const [paymentRecord] = await Payment.create(
      [
        {
          userType: "Student",
          user: studentId,
          transactionType: "income",
          month,
          year,
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
      { student: studentId },
      { dueAmount: 0, lastUpdated: new Date() },
      { session }
    );

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "Payment verified and recorded successfully",
      payment: paymentRecord,
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
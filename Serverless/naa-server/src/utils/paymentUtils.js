import { instance } from "../config/razorpay.config.js";
import crypto from "crypto";

// Create a Razorpay order
export const createRazorpayOrder = async ({ amount, receiptPrefix, entityId }) => {
  try {
    const shortId = entityId.slice(-6); // Last 6 chars of ID
    const timestamp = Date.now().toString().slice(-6); // Last 6 chars of timestamp
    const receipt = `${receiptPrefix}_${shortId}_${timestamp}`;

    const order = await instance.orders.create({
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt,
    });

    return order;
  } catch (error) {
    throw new Error(`Failed to create Razorpay order: ${error.message}`);
  }
};

// Verify Razorpay payment signature
export const verifyRazorpayPayment = ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    throw new Error("Invalid payment signature");
  }
  return true;
};
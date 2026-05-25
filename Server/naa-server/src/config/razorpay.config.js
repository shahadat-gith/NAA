import Razorpay from "razorpay";
import crypto from "crypto"; // Moved to the top
import dotenv from "dotenv";
dotenv.config();

// Initialize Razorpay instance
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

/**
 * Creates a Razorpay Order
 * @param {number} amount - Amount in INR (e.g., 500 for ₹500)
 * @param {string} receiptId - Optional but recommended internal receipt/order ID
 */
export const createRazorpayOrder = async (amount, receiptId = "") => {
  try {
    const options = {
      amount: Math.round(amount * 100), // Math.round prevents floating-point issues (e.g., 19.99 * 100)
      currency: "INR",
      ...(receiptId && { receipt: receiptId }), // Adds receipt only if provided
    };
    
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw error;
  }
};

/**
 * Verifies the Razorpay Payment Signature securely
 */
export const verifyRazorpayPayment = (
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature
) => {
  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return false;
  }

  const secret = process.env.RAZORPAY_SECRET_KEY;
  
  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  // Use timingSafeEqual to prevent timing attacks
  const a = Buffer.from(generatedSignature);
  const b = Buffer.from(razorpaySignature);

  if (a.length !== b.length) {
    return false;
  }
  
  return crypto.timingSafeEqual(a, b);
};
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    feeType: {
      type: String,
      enum: ["admissionFee", "monthlyFee", "hostelMonthlyFee", "examFee", "other"],
      required: true,
    },

    month: {
      type: String, // "Jan-2025"
      default: null,
    },

    paymentMode: {
      type: String,
      enum: ["cash", "upi", "bank", "online"],
      default: "online",
    },

    /* Razorpay */
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,

    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);


export default mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

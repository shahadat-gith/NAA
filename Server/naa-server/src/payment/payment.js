import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
      required: true,
      enum: ["Student", "Teacher"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "userType",
      index: true,
    },

    transactionType: {
      type: String,
      required: true,
      enum: [
        "income",  // Money coming in (e.g., Student paying fees)
        "expense"  // Money going out (e.g., Teacher receiving salary)
      ],
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    /* ---------- DATE TRACKING SEPARATION ---------- */
    month: {
      type: String, 
      required: true,
      enum: [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
      ],
      index: true,
    },

    year: {
      type: Number,
      required: true,
      min: 2020, // Prevents impossible outlier data entry inputs
      index: true,
    },

    paymentMode: {
      type: String,
      enum: ["cash", "upi", "bank", "online"],
      default: "online",
    },

    /* Gateway / Razorpay details (mostly relevant for Student online collections) */
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


paymentSchema.index({ user: 1, month: 1, year: 1 }, { unique: false });

const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
export default Payment;
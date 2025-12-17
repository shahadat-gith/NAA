const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    amount: { type: Number, required: true, min: 0 },

    paymentType: {
      type: String,
      enum: [
        "admission",
        "monthly",
        "hostel_monthly",
        "hostel_admission",
      ],
      required: true,
    },

    month: { type: String }, // "Jan-2025" (only for monthly)

    paymentMode: {
      type: String,
      enum: ["cash", "upi", "bank", "online"],
      default: "cash",
    },

    transactionId: String,
    orderId: String,
    paymentId: String,
    signature: String,

    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);

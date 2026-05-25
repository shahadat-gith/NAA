import mongoose from "mongoose";

const paymentDetailsSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
      unique: true, // Prevents duplicate payment detail entries for the same teacher
    },
    bank: {
      accountHolderName: { type: String },
      accountNumber: { type: String },
      ifscCode: { type: String },
      bankName: { type: String },
    },
    upi: {
      upiId: { type: String },
      upiHolderName: { type: String },
      upiApp: { type: String }, // e.g., 'GPay', 'PhonePe', 'Paytm'
    },
  },
  { timestamps: true }
);

// 🔥Custom validation to ensure EITHER Bank OR UPI is fully provided
paymentDetailsSchema.pre("validate", function (next) {
  const hasBank = 
    this.bank?.accountHolderName && 
    this.bank?.accountNumber && 
    this.bank?.ifscCode && 
    this.bank?.bankName;

  const hasUpi = 
    this.upi?.upiId && 
    this.upi?.upiHolderName && 
    this.upi?.upiApp;

  if (!hasBank && !hasUpi) {
    this.invalidate(
      "bank",
      "You must provide either complete Bank Details or complete UPI Details."
    );
  }

  next();
});

const TeacherPaymentDetails =
  mongoose.models.TeacherPaymentDetails ||
  mongoose.model("TeacherPaymentDetails", paymentDetailsSchema);

export default TeacherPaymentDetails;
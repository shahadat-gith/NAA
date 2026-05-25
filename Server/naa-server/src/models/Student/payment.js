import mongoose from "mongoose";

const studentPaymentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  paymentDate: {
    type: Date,
    default: () => new Date(), // Defaults to current date
  },

  paymentMethod: {
    type: String,
    enum: ["Bank Transfer", "Cash", "UPI"],
    required: true,
  },

  status: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending",
  },

  //razorpay details
  razorpayPaymentId: {
    type: String,
  },
  razorpayOrderId: {
    type: String,
  },
  razorpaySignature: {
    type: String,
  },
});

studentPaymentSchema.index({ student: 1 });

const StudentPayment =
  mongoose.models.StudentPayment ||
  mongoose.model("StudentPayment", studentPaymentSchema);

export default StudentPayment;

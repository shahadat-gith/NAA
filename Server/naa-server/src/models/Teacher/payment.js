import mongoose from "mongoose";

const teacherPaymentSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    salaryMonth: {
      type: String, // Format: YYYY-MM
      required: true,
    },

    paymentDate: {
      type: String, // Format: YYYY-MM-DD
      default: () => new Date().toISOString().split("T")[0], // Defaults to current date
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
  });

  teacherPaymentSchema.index({ teacher: 1, salaryMonth: 1 });

const TeacherPayment = mongoose.models.TeacherPayment || mongoose.model("TeacherPayment", teacherPaymentSchema);

export default TeacherPayment;
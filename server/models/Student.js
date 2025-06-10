import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true, min: 0 },
  paymentDate: { type: Date, default: Date.now },
  transactionId: { type: String },
  orderId: { type: String },
  paymentId: { type: String },
  signature: { type: String },
  paymentType: {
    type: String,
    required: true,
    enum: ["admissionfee", "hosteladmissionfee", "monthlyfee", "hostelmonthlyfee"],
  },
  paymentMode: { type: String, required: true, default: "cash" },
  status: { type: String, default: "pending" },
});

// Result Schema (unchanged)
const resultSchema = new mongoose.Schema({
  examName: { type: String, required: true },
  academicSession: { type: String, required: true },
  marks: { type: mongoose.Schema.Types.Mixed, required: true },
  totalMarks: { type: Number, required: true, min: 0 },
  maxTotalMarks: { type: Number, required: true, min: 0 },
  percentage: { type: Number, required: true, min: 0, max: 100 },
  rollNo: { type: Number},
  maxMarksPerSubject: { type: Number, required: true },
});

// Student Schema for existing students only
const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    father : {type:String, required:true, trim: true},
    mother : {type:String, required:true, trim: true},
    registrationNo: { type: String, required: true, unique: true, trim: true },
    class: { type: String, required: true, trim: true },
    medium: { type: String, required: true, trim: true },
    stream: { type: String, default: "", trim: true },
    hostel: { type: String, required: true, default: "No", enum: ["Yes", "No"] },
    admissionfees:{
      hostelAdmissionFee: {type: Number, default: 0, min: 0},
      admissionFee: {type: Number, default: 0, min: 0},
    },
    phone: { type: String, trim: true },
    isSpecial: { type: Boolean, default: false },
    specialMonthlyFee: { type: Number, default: 0, min: 0 },

    dues: {
      monthlyDue: {
        amount: { type: Number, default: 0, min: 0 },
        lastUpdatedMonth: { type: String, default: "" },
      },
      hostelDue: {
        amount: { type: Number, default: 0, min: 0 },
        lastUpdatedMonth: { type: String, default: "" },
      },
    },

    payments: [paymentSchema],
    results: [resultSchema],
  },
);

const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);
export default Student;

import mongoose from "mongoose";

// Unified Payment Schema
const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true, min: 0 },
  paymentDate: { type: Date, default: Date.now },
  month: { type: String },
  transactionId: { type: String },
  orderId: { type: String },
  paymentId: { type: String },
  signature: { type: String },
  paymentType: {
    type: String,
    required: true,
    enum: ["admissionfee", "hosteladmissionfee", "monthlyfee", "hostelmonthlyfee"],
  },
  paymentMode: {
    type: String,
    required: true,
    default: "cash",
  },
  status: { type: String, default: "pending" },
});

// Result Schema
const resultSchema = new mongoose.Schema({
  examName: { type: String, required: true },
  academicSession: { type: String, required: true },
  marks: { type: mongoose.Schema.Types.Mixed, required: true },
  totalMarks: { type: Number, required: true, min: 0 },
  maxTotalMarks: { type: Number, required: true, min: 0 },
  percentage: { type: Number, required: true, min: 0, max: 100 },
  maxMarksPerSubject: { type: Number, required: true },
});

// Central Student Schema
const studentSchema = new mongoose.Schema(
  {
    // Personal Details
    firstName: { type: String, required: true, trim: true },
    middleName: { type: String, trim: true },
    lastName: { type: String, required: true, trim: true },
    aadhar: { type: String, required: true, trim: true, unique: true },
    dob: { type: Date, required: true },
    gender: { type: String, required: true },
    caste: { type: String, required: true },
    religion: { type: String, required: true },
    phone: { type: String, required: true, trim: true },
    fatherName: { type: String, required: true, trim: true },
    motherName: { type: String, required: true, trim: true },
    guardianContact: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    parentsOccupation: { type: String, required: true },

    // Academic Details
    registrationNo: { type: String, default: "", unique: true, trim: true },
    rollNo: { type: String, trim: true },
    medium: {
      type: String,
      required: true,
      enum: ["english", "assamese"],
    },
    class: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          const englishClasses = ["nursery", "kg", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
          const assameseClasses = ["ankur", "mukul", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
          return (
            (this.medium === "english" && englishClasses.includes(v)) ||
            (this.medium === "assamese" && assameseClasses.includes(v))
          );
        },
        message: (props) => `${props.value} is not a valid class for ${props.path.medium} medium`,
      },
    },
    stream: {
      type: String,
      default: "",
      validate: {
        validator: function (v) {
          return (
            this.medium !== "assamese" ||
            !["11", "12"].includes(this.class) ||
            ["science", "arts"].includes(v)
          );
        },
        message: "Stream must be 'science' or 'arts' for Assamese medium classes 11 and 12",
      },
    },

    // Hostel Details
    hostel: { type: String, required: true, default: "No" },
    hostelDueAmount: { type: Number, default: 0, min: 0 },

    // Admission Details
    transport: { type: String, required: true, default: "No" },
    admissionFee: { type: Number, required: true, min: 0 },
    hostelAdmissionFee: { type: Number, default: 0, min: 0 },
    dueAmount: { type: Number, default: 0, min: 0 },
    admissionStatus: { type: String, default: "Pending" },
    image: { type: String },
    isNewAdmission: { type: Boolean, default: false },
    isAdmissionFeesPaid: { type: Boolean, default: false }, // New field

    // Embedded Arrays
    payments: [paymentSchema],
    results: [resultSchema],

    // Tracking
    lastPaymentDate: { type: Date },
  },
  { timestamps: true }
);

// Pre-save hook to update `updatedAt` and `isAdmissionFeesPaid`
studentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  
  // Update isAdmissionFeesPaid based on admissionFee and hostelAdmissionFee
  this.isAdmissionFeesPaid = this.admissionFee === 0 && this.hostelAdmissionFee === 0;
  
  next();
});

// Export Model
const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);
export default Student;
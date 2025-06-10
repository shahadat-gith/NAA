import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contact: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { 
      type: Number, 
      required: true, 
      min: [0, "Experience cannot be negative"], 
      validate: {
        validator: Number.isInteger,
        message: "Experience must be a whole number"
      }
    },
    salary: { type: Number, required: true },
    image: { type: String, required: true },
    dueBalance: { type: Number, default: 0, required: true },
    subjectClassMappings: [
      {
        subject: { type: String, required: true },
        classes: [{ type: String, required: true }]
      }
    ], 
    password: { type: String, default: null }, 
    updateDueBalanceMonth: { type: String, default: null }, 
    verificationOtp: { type: String, default: null }, 
    verifyOtpExpireAt: { type: Date, default: null },
    bankName: { type: String, default: null },
    accountNumber: { type: String, default: null }, 
    ifscCode: { type: String, default: null }, 
    accountHolderName: { type: String, default: null }, 
    attendance: [
      {
        date: { type: Date, required: true },
        status: { type: String, enum: ["Present", "Absent", "Late"], required: true },
        location: {
          latitude: { type: Number },
          longitude: { type: Number },
        },
        markedBy: { type: String, enum: ["Admin", "Teacher"], required: true },
        markedAt: { type: Date, default: Date.now },
      },
    ],
    transactions: [
      {
        amount: { type: Number, required: true },
        description: { type: String, required: true },
        status: { type: String, enum: ["Pending", "Successful"], required: true },
        acknowledged: { type: Boolean, default: false },
        acknowledgedOn: { type: Date, default: null },
        createdAt: { type: Date, default: Date.now },
        paymentMonth: { type: String, required: true },
      },
    ], 
    notifications: [
      {
        title: { type: String, required: true },
        message: { type: String, required: true },
        type: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ], 
    tasks: [
      {
        taskName: { type: String },
        taskDescription: { type: String },
        dueDate: { type: Date },
        priority: { type: String },
        assignedBy: { type: String },
        isCompleted: { type: Boolean, default: false },
        uploadedFile: { type: String, default: null },
        createdAt: { type: Date, default: Date.now },
      },
    ], 
  },
);

// Pre-save hook to limit the number of notifications
teacherSchema.pre('save', function(next) {
  if (this.notifications.length > 5) {
    this.notifications = this.notifications.slice(-5); // Keep the latest 5 notifications
  }
  next();
});

// Create model
export const teacherModel = mongoose.models.teachers || mongoose.model("teachers", teacherSchema);
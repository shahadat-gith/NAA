import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, default: "N/A"},
    contact: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: Number, required: true },
    salary: { type: Number, required: true },
    image: { type: String, required: true },
    imagePublicId: { type: String, default: null },
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

  },
);



// Create model
export const teacherModel = mongoose.models.teachers || mongoose.model("teachers", teacherSchema);
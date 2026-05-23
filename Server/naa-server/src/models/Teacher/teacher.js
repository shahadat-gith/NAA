import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, default: "N/A"},
    contact: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: Number, required: true },
    image: { type: String, required: true },
    imagePublicId: { type: String, default: null },
    subjectClassMappings: [
      {
        subject: { type: String, required: true },
        classes: [{ type: String, required: true }]
      }
    ], 
    password: { type: String, default: null }, 
    verificationOtp: { type: String, default: null }, 
    verifyOtpExpireAt: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true });



// Create model
export const teacherModel = mongoose.models.Teacher || mongoose.model("Teacher", teacherSchema);

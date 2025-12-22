import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },

  academicSession: {
    type: String, // "2025-2026"
    required: true,
  },

  admissionDate: {
    type: Date,
    default: Date.now,
  },

  admissionType: {
    type: String,
    enum: ["new", "existing"],
    required: true,
  },


  isAdmissionFeePaid: {
    type: Boolean,
    default: false,
  },

  status: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  },
});

export default mongoose.model("Admission", admissionSchema);

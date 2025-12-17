import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    academicSession: {
      type: String,
      required: true,
    },


    admissionDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["applied", "approved", "rejected"],
      default: "applied",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Admission", admissionSchema);

const admissionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },

    academicSession: { type: String, required: true }, // 2024-25
    admissionDate: { type: Date, default: Date.now },

    admissionFee: { type: Number, required: true, min: 0 },
    hostelAdmissionFee: { type: Number, default: 0, min: 0 },

    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Admission", admissionSchema);

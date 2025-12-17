import mongoose from "mongoose";


const hostelSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    
  },
  { timestamps: true }
);

export default mongoose.model("Hostel", hostelSchema);
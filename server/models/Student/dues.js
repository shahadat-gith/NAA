import mongoose from "mongoose";

const dueSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    unique: true,
  },

  dueAmount: { type: Number, default: 0, min: 0 },
  type: {
    type: String,
    enum: ["monthlyFee", "admissionFee"],
    required: true,
  },
  month: { type: String }, 

});

export default mongoose.model("Dues", dueSchema);

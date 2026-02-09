import mongoose from "mongoose";

/* ---------- Exam Slot ---------- */
const examSlotSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    shift: {
      type: String,
      enum: ["morning", "afternoon"],
      required: true,
    },

    time: {
      type: String, // e.g. "9:00 AM - 12:00 PM"
      default: "",
    },
  },
  { _id: false }
);

/* ---------- Admit Card Per Class ---------- */
const admitCardSchema = new mongoose.Schema(
  {
    class: {
      type: String,
      required: true, // "1"..."12"
    },

    stream: {
      type: String,
      default: "", // science / arts / empty
    },
    medium: {
      type: String,
    },

    examCenter: {
      type: String,
      default: "",
    },

    exams: [examSlotSchema],
  }
);

export default mongoose.models.AdmitCard || mongoose.model("AdmitCard", admitCardSchema);

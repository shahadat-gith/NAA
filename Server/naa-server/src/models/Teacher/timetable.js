import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    schedule: [
      {
        day: { type: String, required: true },
        class: { type: String, required: true },
        subject: { type: String, required: true },
        timeSlot: { type: String, required: true },
        }
    ],
  },
  { timestamps: true }
);

const Timetable = mongoose.models.Timetable || mongoose.model("Timetable", timetableSchema);
export default Timetable;


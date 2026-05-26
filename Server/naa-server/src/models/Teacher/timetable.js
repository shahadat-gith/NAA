import mongoose from "mongoose";

const classScheduleSchema = new mongoose.Schema(
  {
    class: { type: String, required: true },
    medium: { type: String, required: true },
    subject: { type: String, required: true },
    timeSlot: { type: String, required: true },
  },
  { _id: false }
);

const timetableSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    schedule: {
      Monday: [classScheduleSchema],
      Tuesday: [classScheduleSchema],
      Wednesday: [classScheduleSchema],
      Thursday: [classScheduleSchema],
      Friday: [classScheduleSchema],
      Saturday: [classScheduleSchema],
    },
  },
  { timestamps: true }
);

const Timetable = mongoose.models.Timetable || mongoose.model("Timetable", timetableSchema);

export default Timetable;
import mongoose from "mongoose";

const classScheduleSchema = new mongoose.Schema(
  {
    class: { type: String, required: true },
    medium: { type: String, required: true },
    stream: {type: String, default:"null"},
    subject: { type: String, required: true },
    timeSlot: { type: String, required: true },
  },
  { _id: false }
);

const timetableSchema = new mongoose.Schema(
  {
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
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

const StaffTimetable = mongoose.models.StaffTimetable || mongoose.model("StaffTimetable", timetableSchema);

export default StaffTimetable;
import mongoose from "mongoose";

const teacherAttendanceSchema = new mongoose.Schema(
  {
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["Present", "Absent"], required: true },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

export const teacherAttendance = mongoose.models.TeacherAttendance || mongoose.model("TeacherAttendance", teacherAttendanceSchema);
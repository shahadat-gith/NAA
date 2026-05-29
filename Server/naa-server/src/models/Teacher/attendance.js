import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "On-Leave"],
      default: "Present",
    },
    markedBy: {
      type: String,
      enum: ["Teacher", "Admin"],
      required: true,
    },
  },
  { timestamps: true }
);
  
attendanceSchema.index({ teacher: 1, date: 1 }, { unique: true });

const TeacherAttendance = mongoose.models.TeacherAttendance || 
                         mongoose.model("TeacherAttendance", attendanceSchema);

export default TeacherAttendance;
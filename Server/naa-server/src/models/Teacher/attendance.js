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
      type: String, // YYYY-MM-DD
      required: true,
      index: true,
    },

    checkInTime: {
      type: Date,
      default: null,
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
  });

  
attendanceSchema.index({ teacher: 1, date: 1 }, { unique: true });

const TeacherAttendance = mongoose.models.TeacherAttendance || 
                         mongoose.model("TeacherAttendance", attendanceSchema);

export default TeacherAttendance;
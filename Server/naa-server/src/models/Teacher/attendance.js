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
      enum: ["Present", "Absent", "On-Leave", "Late"],
      default: "Present",
    },

    markedBy: {
      type: String,
      enum: ["Teacher", "Admin"],
      required: true,
    },

    note: {
      type: String,
      default: "",
    },

    deviceInfo: {
      ipAddress: String,
      userAgent: String,
    },
  },
  { timestamps: true }
);

/* Compound Index: One attendance per teacher per day */
attendanceSchema.index({ teacher: 1, date: 1 }, { unique: true });

/* Index for sorting */
attendanceSchema.index({ teacher: 1, checkInTime: -1 });

const TeacherAttendance = mongoose.models.TeacherAttendance || 
                         mongoose.model("TeacherAttendance", attendanceSchema);

export default TeacherAttendance;
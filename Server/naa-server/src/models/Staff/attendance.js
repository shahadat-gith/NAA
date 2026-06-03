import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
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
      enum: ["Staff", "Admin"],
      required: true,
    },
  },
  { timestamps: true }
);
  
attendanceSchema.index({ staff: 1, date: 1 }, { unique: true });

const StaffAttendance = mongoose.models.StaffAttendance || mongoose.model("StaffAttendance", attendanceSchema);

export default StaffAttendance;
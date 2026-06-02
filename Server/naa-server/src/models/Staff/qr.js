import mongoose from "mongoose";

const attendanceQRSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },


    date: {
      type: Date, 
      required: true,
      index: true, 
    },

    qrCodeBase64: { 
      type: String, 
      required: true 
    },

    isExpired: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


const AttendanceQR = mongoose.models.AttendanceQR || mongoose.model("AttendanceQR", attendanceQRSchema);
export default AttendanceQR;
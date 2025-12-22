import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    village: { type: String, trim: true },
    postOffice: { type: String, trim: true },
    policeStation: { type: String, trim: true },
    district: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
  },
  { _id: false } 
);

const studentSchema = new mongoose.Schema(
  {
    /* ================= BASIC ================= */
    name: { type: String, required: true, trim: true },

    class: { type: String, required: true },
    stream: { type: String, default: "" },
    medium: { type: String, required: true },

    /* ================= PERSONAL ================= */
    fatherName: { type: String, trim: true },
    motherName: { type: String, trim: true },
    dob: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"] },

    phone: { type: String, trim: true },

    address: addressSchema, 

    aadhar: { type: String, trim: true },

    /* ================= ACADEMIC ================= */
    registrationNo: {
      type: String,
      unique: true,
      required: true, // generated once, admin-verified
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true, // false = TC / pass-out
    },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);

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

const admissionSchema = new mongoose.Schema(
  {
    /* ================= BASIC ================= */
    name: { type: String, required: true, trim: true },

    class: { type: String, required: true },
    stream: { type: String, default: "" },
    medium: { type: String, required: true },

    /* ================= PERSONAL ================= */
    fatherName: { type: String, trim: true },
    motherName: { type: String, trim: true },
    dob: { type: String , trim: true },
    gender: { type: String, enum: ["male", "female", "other"] },

    phone: { type: String, trim: true },

    address: addressSchema, 
    aadhar: { type: String, trim: true },
    pen: { type: String, trim: true },
  }, { timestamps: true }
);



export default mongoose.models.Admission || mongoose.model("Admission", admissionSchema);


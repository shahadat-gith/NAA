import mongoose from "mongoose";

const serviceSettingsSchema = new mongoose.Schema(
  {
    feeMonthly: { type: Boolean, default: true },
    feeAdmission: { type: Boolean, default: true },
    feeHostel: { type: Boolean, default: true },
    result: { type: Boolean, default: true },
    admitCard: { type: Boolean, default: true },
    admission: { type: Boolean, default: true },
  }
);

export default mongoose.models.ServiceSettings || mongoose.model("ServiceSettings", serviceSettingsSchema);

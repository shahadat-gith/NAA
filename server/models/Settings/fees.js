import mongoose from "mongoose";

// Reusable structure for every class
const FeeDetail = {
  monthlyFee: { type: Number, default: 0 },
  admissionFee: { type: Number, default: 0 },
};

const feesSettingsSchema = new mongoose.Schema(
  {
    hostelFee: FeeDetail,

    classFees: {
      /* ---------- ENGLISH MEDIUM ---------- */
      english: {
        nursery: FeeDetail,
        kg: FeeDetail,
        "1": FeeDetail,
        "2": FeeDetail,
        "3": FeeDetail,
        "4": FeeDetail,
        "5": FeeDetail,
        "6": FeeDetail,
        "7": FeeDetail,
        "8": FeeDetail,
        "9": FeeDetail,
        "10": FeeDetail,
      },

      /* ---------- ASSAMESE MEDIUM ---------- */
      assamese: {
        ankur: FeeDetail,
        mukul: FeeDetail,
        "1": FeeDetail,
        "2": FeeDetail,
        "3": FeeDetail,
        "4": FeeDetail,
        "5": FeeDetail,
        "6": FeeDetail,
        "7": FeeDetail,
        "8": FeeDetail,
        "9": FeeDetail,
        "10": FeeDetail,
        
        // Higher Secondary (Stream-based)
        "11": {
          science: FeeDetail,
          arts: FeeDetail,
        },
        "12": {
          science: FeeDetail,
          arts: FeeDetail,
        },
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("FeesSettings", feesSettingsSchema);
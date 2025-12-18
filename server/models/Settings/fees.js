import mongoose from "mongoose";

const feesSettingsSchema = new mongoose.Schema(
  {
    hostelFee: {
      type: Number,
      default: 0,
    },

    classFees: {
      /* ---------- COMMON (1–10) ---------- */
      common: {
        "1": { type: Number, default: 0 },
        "2": { type: Number, default: 0 },
        "3": { type: Number, default: 0 },
        "4": { type: Number, default: 0 },
        "5": { type: Number, default: 0 },
        "6": { type: Number, default: 0 },
        "7": { type: Number, default: 0 },
        "8": { type: Number, default: 0 },
        "9": { type: Number, default: 0 },
        "10": { type: Number, default: 0 },
      },

      /* ---------- ENGLISH ---------- */
      english: {
        nursery: { type: Number, default: 0 },
        kg: { type: Number, default: 0 },
      },

      /* ---------- ASSAMESE ---------- */
      assamese: {
        ankur: { type: Number, default: 0 },
        mukul: { type: Number, default: 0 },

        "11": {
          science: { type: Number, default: 0 },
          arts: { type: Number, default: 0 },
        },

        "12": {
          science: { type: Number, default: 0 },
          arts: { type: Number, default: 0 },
        },
      },
    },
  }
);

export default mongoose.model("FeesSettings", feesSettingsSchema);

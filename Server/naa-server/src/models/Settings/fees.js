import mongoose from "mongoose";

const feeSchema = new mongoose.Schema(
  {
    /* ---------- ENGLISH MEDIUM ---------- */
    english: {
      nursery: { type: Number, default: 0 },
      kg: { type: Number, default: 0 },
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

    /* ---------- ASSAMESE MEDIUM ---------- */
    assamese: {
      ankur: { type: Number, default: 0 },
      mukul: { type: Number, default: 0 },
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
      
      // Higher Secondary (Stream-based)
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
  { timestamps: true }
);

const Fee = mongoose.models.Fee || mongoose.model("Fee", feeSchema);

export default Fee;
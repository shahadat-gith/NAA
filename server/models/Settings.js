import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  hostelFee: { type: Number, default: 4000, min: 0 },

  classFees: {
    english: {
      nursery: { type: Number, default: 800 },
      kg: { type: Number, default: 800 },
      "1": { type: Number, default: 900 },
      "2": { type: Number, default: 900 },
      "3": { type: Number, default: 1000 },
      "4": { type: Number, default: 1000 },
      "5": { type: Number, default: 1100 },
      "6": { type: Number, default: 1100 },
      "7": { type: Number, default: 1200 },
      "8": { type: Number, default: 1200 },
      "9": { type: Number, default: 1300 },
      "10": { type: Number, default: 1300 },
    },
    assamese: {
      ankur: { type: Number, default: 700 },
      mukul: { type: Number, default: 700 },
      "1": { type: Number, default: 900 },
      "2": { type: Number, default: 900 },
      "3": { type: Number, default: 1000 },
      "4": { type: Number, default: 1000 },
      "5": { type: Number, default: 1100 },
      "6": { type: Number, default: 1100 },
      "7": { type: Number, default: 1200 },
      "8": { type: Number, default: 1200 },
      "9": { type: Number, default: 1300 },
      "10": { type: Number, default: 1300 },
      "11": {
        science: { type: Number, default: 1500 },
        arts: { type: Number, default: 1400 },
      },
      "12": {
        science: { type: Number, default: 1600 },
        arts: { type: Number, default: 1500 },
      },
    },
  },

  admitCardConfig: {
    isEnabled: { type: Boolean, default: false },
    examName: { type: String, default: "" },
    examDate: { type: Date, default: null },
    examCenter: { type: String, default: "Nashib Ali Academy Campus" },
  },

  lastUpdated: { type: Date, default: Date.now },
});

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;

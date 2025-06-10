import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  hostelFee: { type: String, default: "0" },

  classFees: {
    english: {
      nursery: { type: String, default: "0" },
      kg: { type: String, default: "0" },
      "1": { type: String, default: "0" },
      "2": { type: String, default: "0" },
      "3": { type: String, default: "0" },
      "4": { type: String, default: "0" },
      "5": { type: String, default: "0" },
      "6": { type: String, default: "0" },
      "7": { type: String, default: "0" },
      "8": { type: String, default: "0" },
      "9": { type: String, default: "0" },
      "10": { type: String, default: "0" },
    },
    assamese: {
      ankur: { type: String, default: "0" },
      mukul: { type: String, default: "0" },
      "1": { type: String, default: "0" },
      "2": { type: String, default: "0" },
      "3": { type: String, default: "0" },
      "4": { type: String, default: "0" },
      "5": { type: String, default: "0" },
      "6": { type: String, default: "0" },
      "7": { type: String, default: "0" },
      "8": { type: String, default: "0" },
      "9": { type: String, default: "0" },
      "10": { type: String, default: "0" },
      "11": {
        science: { type: String, default: "0" },
        arts: { type: String, default: "0" },
      },
      "12": {
        science: { type: String, default: "0" },
        arts: { type: String, default: "0" },
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
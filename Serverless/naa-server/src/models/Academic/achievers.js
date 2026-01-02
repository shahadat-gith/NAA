import mongoose from "mongoose";

const achiversSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  father: { type: String },
  mother: { type: String },
  village: { type: String },
  percentage: { type: String, required: true },
  year: { type: String, required: true },
  className: { type: String, required: true },
  image: { type: String },
});

const Achievers = mongoose.models.achievers || mongoose.model("achievers", achiversSchema);

export default Achievers;
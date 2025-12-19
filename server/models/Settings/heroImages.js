import mongoose from "mongoose";

const heroImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
      unique: true, // ensures no duplicate cloudinary images
    },
  }
);

export default mongoose.model("HeroImage", heroImageSchema);

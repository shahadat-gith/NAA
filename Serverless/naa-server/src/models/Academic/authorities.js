import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const authoritySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: fileSchema,
      required: true,
    },

    signature: {
      type: fileSchema,
      required: true,
    },
  },
  
);


export const authorityModel = mongoose.models.authorities ||mongoose.model("authorities", authoritySchema);

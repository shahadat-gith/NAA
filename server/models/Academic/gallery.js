import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  public_id: { type: String, required: true },
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Image', imageSchema);
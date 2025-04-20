import mongoose from 'mongoose'

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true, // Ensure no duplicate subscriptions
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"], // Basic email validation
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
});

export const newsLetterModel = mongoose.models.Newsletters || mongoose.model("Newsletter", newsletterSchema);
import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['academic', 'administrative', 'extracurricular'],
      message: 'Category must be one of: academic, administrative, extracurricular'
    },
    lowercase: true
  },
  pdf: {
    type: String, // Stores the file path or URL of the uploaded PDF
    default: null // Optional field
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});


// Index for efficient querying by category and date
noticeSchema.index({ category: 1, date: -1 });

const Notice = mongoose.model('Notice', noticeSchema);

export default Notice
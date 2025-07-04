import mongoose from "mongoose";

const studentResultSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rollNumber: { type: String, required: true, index: false }, // No unique index
    class: { type: String, required: true },
    medium: { type: String, required: true }, // Added Medium field
    stream: { type: String, required: function () { return parseInt(this.class) > 10; } }, // Stream required for class > 10
    marks: { type: mongoose.Schema.Types.Mixed, required: true }, // Dynamic subjects
    totalMarks: { type: Number, required: true, min: 0 },
    maxTotalMarks: { type: Number, required: true, min: 0 },
    percentage: { type: Number, required: true, min: 0, max: 100 },
    maxMarksPerSubject: { type: Number, required: true },
  }
);

const studentResultModel =
  mongoose.models.studentsResults || mongoose.model("studentsResults", studentResultSchema);

export default studentResultModel;

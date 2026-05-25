import mongoose from "mongoose";

const monthlyDueBreakdownSchema = new mongoose.Schema({
  month: { 
    type: String, 
    required: true // Format: "YYYY-MM"
  },
  amount: { 
    type: Number, 
    required: true 
  },
  updatedOn: { 
    type: Date, 
    default: Date.now 
  }
}, { _id: false }); // Prevents Mongoose from auto-generating subdocument IDs

const teacherDuesSchema = new mongoose.Schema({
  teacher: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Teacher", 
    required: true,
    unique: true // Strict 1:1 rule. Only ONE dues document per teacher.
  },
  totalDue: { 
    type: Number, 
    default: 0 
  },
  dueMonths: [monthlyDueBreakdownSchema] // Stores individual unpaid months
}, { timestamps: true });

const TeacherDues = mongoose.models.TeacherDues || mongoose.model("TeacherDues", teacherDuesSchema);
export default TeacherDues;
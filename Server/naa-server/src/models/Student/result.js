import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    registrationNo: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    academicSession: {
      type: String,
      required: true,
      index: true,
    },

    examName: {
      type: String,
      required: true,
    },
    class: {
      type: String,
      required: true,
      
    },
    stream: {
      type: String,
    },

    medium: {
      type: String,
      required: true,
    },

    rank: {
      type: Number,
    },

    marks: [
      {
        subject: {
          type: String,
          required: true,
        },
        mark: {
          type: Number,
          required: true,
          min: 0,
        },
        _id: false
      },
    ],

    maxMarksPerSubject: {
      type: Number,
      required: true,
      min: 0,
    },

    totalMarks: {
      type: Number,
      default: 0,
    },

    percentage: {
      type: Number,
      default: 0,
    },

    grade: {
      type: String,
    },

    resultStatus: {
      type: String,
      enum: ["PASS", "FAIL"],
      default: "PASS",
    },

    canSee: {
      type: Boolean,
      default: true,
    },
  },
 
);


resultSchema.pre("save", function (next) {
  const subjectCount = this.marks.length;

  const obtainedMarks = this.marks.reduce(
    (sum, m) => sum + m.mark,
    0
  );

  const maxTotalMarks = subjectCount * this.maxMarksPerSubject;

  this.totalMarks = obtainedMarks;
  this.percentage = maxTotalMarks
    ? Number(((obtainedMarks / maxTotalMarks) * 100).toFixed(2))
    : 0;

  // PASS / FAIL logic (example: fail if any subject < 33%)
  const hasFailed = this.marks.some(
    (m) => m.mark < this.maxMarksPerSubject * 0.33
  );

  this.resultStatus = hasFailed ? "FAIL" : "PASS";

  // Grade logic
  if (this.percentage >= 90) this.grade = "A+";
  else if (this.percentage >= 80) this.grade = "A";
  else if (this.percentage >= 70) this.grade = "B+";
  else if (this.percentage >= 60) this.grade = "B";
  else if (this.percentage >= 50) this.grade = "C+";
  else if (this.percentage >= 40) this.grade = "C";
  else if (this.percentage >= 33) this.grade = "D";
  else this.grade = "F";

  next();
});


export default mongoose.models.Result || mongoose.model("Result", resultSchema);
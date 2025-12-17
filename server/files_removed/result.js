// Result Schema (unchanged)
const resultSchema = new mongoose.Schema({
  studentId : {type : mongoose.Schema.Types.ObjectId, ref: 'Student', required: true},
  examName: { type: String, required: true },
  academicSession: { type: String, required: true },
  marksDetails: [
    {
      subject : {type : String, required : true},
      mark: { type: Number, required: true, min: 0 },
    }
  ],
  rollNo: { type: Number},
  maxMarksPerSubject: { type: Number, required: true },
});

const Result = mongoose.model("Result", resultSchema);

export default Result;

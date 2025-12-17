import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
    {
        registrationNo: {
            type: String,
            required: true,
            trim: true,
        },
        academicSession: { type: String, required: true },
        class: { type: String, required: true },
        stream: { type: String, default: "" },
        examName: { type: String, required: true },
        rank: { type: Number },
        marks: [
            {
                subject: { type: String, required: true },
                marksObtained: { type: Number, required: true, min: 0 },
            },
        ],
        maxMarksPerSubject: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Result", resultSchema);
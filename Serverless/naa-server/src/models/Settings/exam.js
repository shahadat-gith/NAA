import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
    examName: {
        type: String,
        required: true,
    },

    academicSession: {
        type: String,
        required: true,
    }
})

export default mongoose.models.Exam || mongoose.model("Exam", examSchema);
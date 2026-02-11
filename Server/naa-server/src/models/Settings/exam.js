import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
    examName: {
        type: String,
        required: true,
    },

    academicSession: {
        type: String,
        required: true,
    },

    time:{
        morning: {
            type: String,
            default: false,
        },
        afternoon: {
            type: String,
            default: false,
        }
    }
})

export default mongoose.models.Exam || mongoose.model("Exam", examSchema);
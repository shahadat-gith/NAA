import mongoose from "mongoose";


const temporaryFileSchema = new mongoose.Schema(
    {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
        public_id: { type: String, required: true },
        url: { type: String, required: true },
    },
    { timestamps: true }
);
const TemporaryFile = mongoose.models.TemporaryFile || mongoose.model("TemporaryFile", temporaryFileSchema);

export default TemporaryFile;
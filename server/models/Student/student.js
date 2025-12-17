import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        fatherName: {
            type: String,
            trim: true,
        },

        motherName: {
            type: String,
            trim: true,
        },

        registrationNo: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        class: {
            type: String,
            required: true,
        },

        stream: {
            type: String,
            default: "",
        },

        medium: {
            type: String,
            required: true,
        },


        phone: {
            type: String,
            trim: true,
        },

        isActive: {
            type: Boolean,
            default: true, // TC / pass-out
        },
    },
    { timestamps: true }
);

export default mongoose.model("Student", studentSchema);

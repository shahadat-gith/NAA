import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    // --- Basic Profile Details ---
    name: { 
      type: String, 
      required: [true, "Teacher name is required"], 
      trim: true 
    },
    email: { 
      type: String, 
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true
    },
    contact: { 
      type: String, 
      required: [true, "Contact number is required"],
      trim: true 
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: [true, "Gender is required"]
    },

// --- Residential Address Details ---
    address: {
      village: { 
        type: String, 
        required: [true, "Village or Town name is required"], 
        trim: true 
      },
      po: { 
        type: String, 
        required: [true, "Post Office (P.O.) is required"], 
        trim: true 
      },
      ps: { 
        type: String, 
        required: [true, "Police Station (P.S.) is required"], 
        trim: true 
      },
      pin: { 
        type: String, 
        required: [true, "PIN code is required"], 
        trim: true,
        match: [/^\d{6}$/, "Please provide a valid 6-digit PIN code"] 
      },
      district: { 
        type: String, 
        required: [true, "District is required"], 
        trim: true 
      },
      state: { 
        type: String, 
        required: [true, "State is required"], 
        default: "Assam", 
        trim: true 
      },
    },

    // --- Academic Profile (Simplified) ---
    subjectTaught: { 
      type: String, 
      default: "N/A",
      trim: true
    },
    degree: { 
      type: String, 
      required: [true, "Educational qualifications are required"],
      trim: true 
    },
    experience: { 
      type: Number, 
      default: 0,
      min: [0, "Experience cannot be negative"]
    },

    // --- Asset Upload Management ---
    image: {
      url: { 
        type: String, 
        default: null
      },
      publicId: { 
        type: String, 
        default: null 
      }
    },

    // --- Critical School Administration Fields ---
    teacherId: {
      type: String,
      unique: true,
      sparse: true, 
      trim: true
    },

    joiningDate: {
      type: String,
      default: "Not Provided",
    },

    designation: {
      type: String,
      enum: ["Principal", "Managing Director", "Head Teacher", "Teacher", "Non Teaching Staff"],
      default: "Not Provided",
      trim: true
    },

    // --- Authentication, Security & Status ---
    password: { 
      type: String, 
      default: null 
    }, 

    verificationOtp: { 
      type: String, 
      default: null 
    }, 
    verifyOtpExpireAt: { 
      type: Date, 
      default: null 
    },

    isOtpVerified:{
      type: Boolean,
      default: false
    },
    
    status: {
      type: String,
      default: "Pending", 
      enum: ["Active", "Inactive", "Pending", "Suspended"]
    },
  },
  { timestamps: true }
);

// Prevent model overwrite compile errors during hot-reloads
export const teacherModel = mongoose.models.Teacher || mongoose.model("Teacher", teacherSchema);
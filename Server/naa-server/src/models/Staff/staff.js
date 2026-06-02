import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    staffType: {
      type: String,
      required: [true, "Staff type is required"],
    },

    // --- Basic Profile Details ---
    name: {
      type: String,
      required: [true, "Staff name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true, // Prevents duplicate registrations
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },

    contact: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: [true, "Gender is required"],
    },

    // --- Residential Address Details ---
    address: {
      village: {
        type: String,
        required: [true, "Village or Town name is required"],
        trim: true,
      },
      po: {
        type: String,
        required: [true, "Post Office (P.O.) is required"],
        trim: true,
      },
      ps: {
        type: String,
        required: [true, "Police Station (P.S.) is required"],
        trim: true,
      },
      pin: {
        type: String,
        required: [true, "PIN code is required"],
        trim: true,
        match: [/^\d{6}$/, "Please provide a valid 6-digit PIN code"],
      },
      district: {
        type: String,
        required: [true, "District is required"],
        trim: true,
      },
      state: {
        type: String,
        required: [true, "State is required"],
        default: "Assam",
        trim: true,
      },
    },

    // --- Professional Details ---
    staffId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null/missing values during drafting stages
      trim: true,
    },

    designation: {
      type: String,
      required: [true, "Designation is required"],
      trim: true,
    },

    qualification: {
      type: String,
      required: [true, "Qualification is required"],
      trim: true,
    },

    experience: {
      type: Number,
      default: 0,
      min: [0, "Experience cannot be negative"],
    },

    subjectTaught: {
      type: String,
      trim: true,
      default: null,
      // Custom validation: If it's a teaching staff, make sure a subject is provided
      validate: { validator: function (value) {
          if (this.staffType === "Teaching" && !value) {
            return false;
          }
          return true;
        },
        message: "Subject taught is required for teaching staff.",
      },
    },

    // --- Asset Upload Management (Cloudinary, etc.) ---
    image: {
      url: {
        type: String,
        default: null,
      },
      publicId: {
        type: String,
        default: null,
      },
    },

    // --- Authentication, Security & Status ---
    password: {
      type: String,
      default: null,
      select: false, 
    },

    verificationOtp: {
      type: String,
      default: null,
      select: false,
    },

    verifyOtpExpireAt: {
      type: Date,
      default: null,
    },

    isOtpVerified: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      default: "Pending",
      enum: ["Active", "Inactive", "Pending", "Suspended"],
    },
  },
  { timestamps: true }
);

const Staff = mongoose.models.Staff || mongoose.model("Staff", staffSchema);

export default Staff;
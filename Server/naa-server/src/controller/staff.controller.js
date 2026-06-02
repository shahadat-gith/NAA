
import Staff from '../models/Staff/staff.js';
import StaffAttendance from '../models/Staff/attendance.js';
import StaffTimetable from '../models/Staff/timetable.js';

import bcrypt from "bcryptjs";
import { uploadImageToCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";

// =========================================================================
// 1. CREATE STAFF (Public Registration Endpoint)
// =========================================================================
export const createStaff = async (req, res) => {
  try {
    let {
      name,
      email,
      contact,
      gender,
      address,
      staffType,
      designation,
      qualification,
      experience,
      subjectTaught,
    } = req.body;

    email = email?.trim().toLowerCase();
    name = name?.trim();
    contact = contact?.trim();
    subjectTaught = subjectTaught?.trim();

    let parsedAddress = address;

    if (typeof address === "string") {
      try {
        parsedAddress = JSON.parse(address);
      } catch (error) {
        return res.status(400).json({
          message: "Invalid format for address data.",
        });
      }
    }

    // 🌟 FIXED: Check if EITHER the email OR the contact number is already registered!
    const duplicateCheck = await Staff.findOne({
      $or: [{ email }, { contact }]
    });

    if (duplicateCheck) {
      if (duplicateCheck.email === email) {
        return res.status(409).json({
          message: "A staff member with this email already exists.",
        });
      }
      if (duplicateCheck.contact === contact) {
        return res.status(409).json({
          message: "This contact number is already linked to another staff account.",
        });
      }
    }

    if (staffType === "Teaching" && !subjectTaught) {
      return res.status(400).json({
        message: "Subject taught is required for teaching staff.",
      });
    }

    if (staffType !== "Teaching") {
      subjectTaught = null;
    }

    // Default static password for freshly onboarded personnel
    const defaultPassword = "123456";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    let imageData = {
      url: null,
      publicId: null,
    };

    if (req.file) {
      try {
        const uploadResult = await uploadImageToCloudinary(
          req.file,
          "staff_profiles"
        );

        imageData = {
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
        };
      } catch (uploadError) {
        console.error("Cloudinary Upload Error:", uploadError);

        return res.status(500).json({
          message: "Failed to upload staff profile image.",
        });
      }
    }

    const newStaff = new Staff({
      staffType,
      name,
      email,
      contact,
      gender,
      address: parsedAddress,
      designation,
      qualification,
      experience: experience ? Number(experience) : 0,
      subjectTaught,
      image: imageData,
      password: hashedPassword,
      status: "Pending",
    });

    await newStaff.save();

    const staffResponse = newStaff.toObject();

    delete staffResponse.password;
    delete staffResponse.verificationOtp;
    delete staffResponse.verifyOtpExpireAt;

    return res.status(201).json({
      message:
        "Staff registration request submitted successfully. Default password is '123456'",
      staff: staffResponse,
    });
  } catch (error) {
    console.error("Error creating staff member:", error);

    return res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};
// =========================================================================
// 2. UPDATE STAFF DETAILS (Self Modification)
// =========================================================================
export const updateStaffDetails = async (req, res) => {
  try {
    const { id } = req.user; 
    const staff = await Staff.findById(id);
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff profile data trace not found.",
      });
    }

    // --- Asset Cloud Media Refactoring & Garbage Cleanup ---
    if (req.file) {
      if (staff.image && staff.image.publicId) {
        try {
          await deleteFromCloudinary(staff.image.publicId);
        } catch (err) {
          console.error("Cloudinary asset cleanup warning:", err.message);
        }
      }

      const uploadedImage = await uploadImageToCloudinary(req.file, "staff_profiles");
      staff.image = {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      };
    }

    // --- Secured Access Token Configurations ---
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      staff.password = await bcrypt.hash(req.body.password, salt);
    }

    // --- Nested Address Parsing Engine ---
    if (req.body.address) {
      try {
        const parsedAddress = typeof req.body.address === "string" 
          ? JSON.parse(req.body.address) 
          : req.body.address;

        const addressFields = ["village", "po", "ps", "pin", "district", "state"];
        addressFields.forEach((field) => {
          if (parsedAddress[field] !== undefined) {
            staff.address[field] = parsedAddress[field];
          }
        });
      } catch (parseError) {
        return res.status(400).json({
          success: false,
          message: "Malformed data structural parsing layout received for address updates.",
        });
      }
    }

    const allowedFields = [
      "name", 
      "email", 
      "contact", 
      "gender", 
      "qualification", 
      "experience", 
      "subjectTaught"
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "experience") {
          staff[field] = Number(req.body[field]);
        } else if (field === "email") {
          staff[field] = req.body[field].toLowerCase().trim();
        } else {
          staff[field] = req.body[field];
        }
      }
    });

    if (staff.staffType === "Non Teaching") {
      staff.subjectTaught = null;
    } else if (staff.staffType === "Teaching" && !staff.subjectTaught) {
      return res.status(400).json({
        success: false,
        message: "Subject taught is mandatory when setting profile to Teaching staff.",
      });
    }

    await staff.save();

    // CRITICAL SECURITY FIX: Sanitize output response payload!
    const staffResponse = staff.toObject();
    delete staffResponse.password;
    delete staffResponse.verificationOtp;

    return res.status(200).json({
      success: true,
      message: "Profile information saved and modified successfully.",
      staff: staffResponse    
    });

  } catch (error) {
    console.error("updateStaffDetails runtime anomaly sequence:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with that email structural address already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "An operational breakdown was encountered while committing profile updates.",
      error: error.message,
    });
  }
};

// =========================================================================
// 3. GET STAFF PROFILE (Self Profile View)
// =========================================================================
export const getStaffProfile = async (req, res) => {
  try {
    const { id } = req.user;
    
    // Clean Projection: Blocks secret auth identifiers from traveling downstream
    const staff = await Staff.findById(id).select("-password -verificationOtp");

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Your profile record could not be located in the system matrix.",
      });
    }

    return res.status(200).json({
      success: true,
      profile: staff,
    });
  } catch (error) {
    console.error("getStaffProfile runtime failure:", error);
    return res.status(500).json({
      success: false,
      message: "Server failed to fetch profile workspace data.",
      error: error.message,
    });
  }
};

// =========================================================================
// 4. GET STAFF BY ID (Admin/Management View)
// =========================================================================
export const getStaffById = async (req, res) => {
  try {
    const { id } = req.params; 
    
    // Clean Projection: Hidden properties stay concealed 
    const staff = await Staff.findById(id).select("-password -verificationOtp");

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Targeted staff tracking ID is invalid or does not exist.",
      });
    }

    return res.status(200).json({
      success: true,
      staff,
    });
  } catch (error) {
    console.error("getStaffById runtime failure:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to extract targeted staff master parameters.",
      error: error.message,
    });
  }
};

// =========================================================================
// 5. GET ALL STAFF (Public Directory / Admin List)
// =========================================================================
export const getAllStaff = async (req, res) => {
  try {
    // Standard system sanitization logic applied to listing vectors
    const staffs = await Staff.find().select("-password -verificationOtp").sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: staffs.length,
      staffs,
    });
  } catch (error) {
    console.error("getAllStaff runtime failure:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load active staff compilation array.",
      error: error.message,
    });
  }
};


// =========================================================================
// 6. VERIFY STAFF (Admin Only)
// =========================================================================
export const verifyStaff = async (req, res) => {
  try {
    // Extracted target document ID from URL path parameter to match standard API route paradigms
    const { id } = req.params;
    const { staffId } = req.body;

    // 1. --- Basic Input Validation ---
    if (!staffId || !staffId.trim()) {
      return res.status(400).json({
        success: false,
        message: "An official Staff ID must be assigned to verify this record.",
      });
    }

    // 2. --- Enforce System-Wide Staff ID Uniqueness ---
    const duplicateIdCheck = await Staff.findOne({ staffId: staffId.trim() });
    if (duplicateIdCheck && duplicateIdCheck._id.toString() !== id) {
      return res.status(409).json({
        success: false,
        message: `The Staff ID '${staffId}' is already allocated to another employee record.`,
      });
    }

    // 3. --- Fetch and Mutate Document ---
    const staff = await Staff.findById(id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff record not found for verification.",
      });
    }

    if (staff.status === "Active") {
      return res.status(400).json({
        success: false,
        message: "Staff member is already verified and active.",
      });
    }

    // Apply simple updates directly
    staff.status = "Active";
    staff.staffId = staffId.trim(); 
    
    await staff.save();

    // Sanitize sensitive credentials output pass before responding
    const staffResponse = staff.toObject();
    delete staffResponse.password;
    delete staffResponse.verificationOtp;

    return res.status(200).json({
      success: true,
      message: "Staff member verified and activated successfully.",
      staff: staffResponse,
    });

  } catch (error) {
    console.error("verifyStaff runtime failure:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during staff verification process.",
      error: error.message,
    });
  }
};



// =========================================================================
// 7. UPDATE TIMETABLE (Logged in teacher access only)
// =========================================================================
export const updateTimetable = async (req, res) => {
  try {
    const { id } = req.user;
    const { day, schedule } = req.body;

    const validDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    if (!day || !validDays.includes(day)) {
      return res.status(400).json({
        success: false,
        message: "Invalid day provided",
      });
    }

    if (!schedule || !Array.isArray(schedule)) {
      return res.status(400).json({
        success: false,
        message: "Schedule must be an array format.",
      });
    }

    // Ensure target staff profile exists and has rights to have a timetable
    const staff = await Staff.findById(id);
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff profile not found",
      });
    }

    if (staff.staffType !== "Teaching") {
      return res.status(403).json({
        success: false,
        message: "Timetable management is restricted to teaching faculty only.",
      });
    }

    // Locate or instantiate a timetable tracking matrix document block
    let timetable = await StaffTimetable.findOne({ staff: id });
    if (!timetable) {
      timetable = new StaffTimetable({
        staff: id,
        schedule: {
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: [],
          Friday: [],
          Saturday: [],
        },
      });
    }

    // Set the target array smoothly
    timetable.schedule[day] = schedule;
    await timetable.save();

    return res.status(200).json({
      success: true,
      message: `${day} schedule updated successfully`,
      timetable,
    });
  } catch (error) {
    console.error("updateTimetable runtime failure:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating timetable parameters",
      error: error.message,
    });
  }
};

// =========================================================================
// 8. GET TIMETABLE BY STAFF ID (Admin or Faculty Directory Tool)
// =========================================================================
export const getTimetable = async (req, res) => {
  try {
    const { id } = req.params; 

    const staff = await Staff.findById(id);
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Targeted staff profile record not found.",
      });
    }

    const timetable = await StaffTimetable.findOne({ staff: id });
    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: "No schedule matrix configured for this staff member.",
      });
    }

    return res.status(200).json({
      success: true,
      timetable,
    });
  } catch (error) {
    console.error("getTimetable runtime failure:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching timetable details.",
      error: error.message,
    });
  }
};

// =========================================================================
// 9. GET STAFF DASHBOARD METRICS (logged in staff access only)
// =========================================================================
export const getStaffDashboard = async (req, res) => {
  try {
    const { id } = req.user;

    // Fetch account identity details first while hiding secret hash parameters
    const staff = await Staff.findById(id).select("-password -verificationOtp");
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff identity could not be verified.",
      });
    }

    // Thread concurrency orchestration array execution layer
    const [timetable, attendance] = await Promise.all([
      StaffTimetable.findOne({ staff: id }),
      StaffAttendance.find({ staff: id }).sort({ date: -1 }).limit(30),
    ]);

    // Construct unified dynamic response array matching the logged-in staff type
    return res.status(200).json({
      success: true,
      dashboard: {
        profile: staff,
        attendance: attendance || [],
        timetable: staff.staffType === "Teaching" ? (timetable || { schedule: { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [] } })
          : null
      },
    });
  } catch (error) {
    console.error("getStaffDashboard runtime failure:", error);
    return res.status(500).json({
      success: false,
      message: "Error compilation encountered loading user workspace dashboard arrays.",
      error: error.message,
    });
  }
};


// =========================================================================
// 10. Delete Staff Member (Admin Only)- delete attendance, timetable
// =========================================================================

export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await Staff.findById(id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff record not found for deletion.",
      });
    }

    if (staff.image && staff.image.publicId) {
      try {
        await deleteFromCloudinary(staff.image.publicId);
      } catch (err) {
        console.error("Cloudinary asset cleanup warning during staff deletion:", err.message);
      }
    }

    await StaffAttendance.deleteMany({ staff: id });
    await StaffTimetable.deleteOne({ staff: id });
    await Staff.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Staff member and all associated records deleted successfully.",
    });
  } catch (error) {
    console.error("deleteStaff runtime failure:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while attempting to delete staff records.",
      error: error.message,
    });
  }
};
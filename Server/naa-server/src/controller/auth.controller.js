import Staff from "../models/Staff/staff.js"; // Updated import reference to unified Staff model
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js"; 

// =========================================================================
// 1. STAFF LOGIN (Teaching & Non-Teaching Portal Entry)
// =========================================================================
export const staffLogin = async (req, res) => {
  const { contact, password } = req.body;
  if (!contact || !password) {
    return res.status(400).json({ success: false, message: "All fields are required!" });
  }

  try {
    const staff = await Staff.findOne({ contact });
    if (!staff) {
      return res.status(401).json({ success: false, message: "Your account does not exist! Please contact an administrator." });
    }

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Wrong password! Please enter a correct password!" });
    }

    // Explicit payload role flag set to 'staff' to support unified token authentication
    const token = jwt.sign({ id: staff._id, staffType: staff.staffType }, process.env.JWT_SECRET, { expiresIn: "365d" });

    // Dynamic response builder supports optional fields gracefully depending on staffType
    const staffData = {
      id: staff._id,
      staffType: staff.staffType,
      name: staff.name,
      email: staff.email,
      contact: staff.contact,
      gender: staff.gender,
      image: staff.image,
      staffId: staff.staffId,
      designation: staff.designation,
      qualification: staff.qualification,
      experience: staff.experience,
      address: staff.address,
      status: staff.status,
      ...(staff.staffType === "Teaching" && { subjectTaught: staff.subjectTaught })
    };

    return res.status(200).json({ 
      success: true, 
      token, 
      staff: staffData, 
      message: "You have successfully logged in!" 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =========================================================================
// 2. ADMIN LOGIN
// =========================================================================
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required!",
    });
  }

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      {
        email: email,      
        role: "naa-admin",        
      },
      process.env.JWT_SECRET,
      { expiresIn: "365d" }
    );

    return res.status(200).json({
      success: true,
      token,
      message: "You have successfully logged in!",
    });
  }

  return res.status(401).json({
    success: false,
    message: "Wrong email or password!",
  });
};

// =========================================================================
// 3. FETCH PROFILE (Self Request Data Resolver)
// =========================================================================
export const getStaffProfile = async (req, res) => {
  try {
    const staff = await Staff.findById(req.user.id)
      .select(
        "name email contact gender image staffType staffId designation subjectTaught qualification experience address status"
      )
      .lean();

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff profile record not found",
      });
    }

    return res.status(200).json({
      success: true,
      staff,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================================================================
// 4. FORGOT PASSWORD (Multi-Step Security Validation Stream)
// =========================================================================
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const forgotPasswordStaff = async (req, res) => {
  const { step } = req.params;
  const { email, otp, newPassword } = req.body;
  const targetEmail = email?.trim().toLowerCase();

  try {
    // -------------------------------------------------------------
    // PATH 1: /forgot-password/staff/send-otp
    // -------------------------------------------------------------
    if (step === "send-otp") {
      if (!targetEmail) return res.status(400).json({ success: false, message: "Email is required" });

      const generatedOtp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 Minutes Lifecycle

      const staff = await Staff.findOneAndUpdate(
        { email: targetEmail },
        { 
          verificationOtp: generatedOtp, 
          verifyOtpExpireAt: otpExpiry,
          isOtpVerified: false 
        },
        { new: true }
      );

      if (!staff) {
        return res.status(404).json({ success: false, message: "No account found matching this email address" });
      }

      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: staff.email,
        subject: "Password Reset OTP - Nashib Ali Academy",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #ff4d2d; text-align: center;">Password Reset Request</h2>
            <p>Dear <strong>${staff.name}</strong>,</p>
            <p>Use the following 6-digit verification code to reset your account credentials:</p>
            <div style="background: #f5f5f5; padding: 16px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <span style="font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #1f2937;">${generatedOtp}</span>
            </div>
            <p style="color: #6b7280; font-size: 13px;">This code will expire in 10 minutes. If you did not make this request, you can safely ignore this email.</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      return res.status(200).json({ success: true, message: "Verification OTP sent to your email." });
    }

    // -------------------------------------------------------------
    // PATH 2: /forgot-password/staff/verify-otp
    // -------------------------------------------------------------
    if (step === "verify-otp") {
      if (!targetEmail || !otp) {
        return res.status(400).json({ success: false, message: "Email and OTP are required" });
      }

      const staff = await Staff.findOneAndUpdate(
        { 
          email: targetEmail,
          verificationOtp: otp,
          verifyOtpExpireAt: { $gt: new Date() } 
        },
        { isOtpVerified: true }, 
        { new: true }
      );

      if (!staff) {
        return res.status(401).json({ success: false, message: "Invalid or expired OTP code." });
      }

      return res.status(200).json({ success: true, message: "OTP verified successfully." });
    }

    // -------------------------------------------------------------
    // PATH 3: /forgot-password/staff/reset-password
    // -------------------------------------------------------------
    if (step === "reset-password") {
      if (!targetEmail || !newPassword) {
        return res.status(400).json({ success: false, message: "Email and new password are required" });
      }

      const staff = await Staff.findOne({ email: targetEmail });
      if (!staff) {
        return res.status(404).json({ success: false, message: "Account instance not found." });
      }

      if (!staff.isOtpVerified) {
        return res.status(403).json({ success: false, message: "Security Violation: OTP has not been verified." });
      }

      const salt = await bcrypt.genSalt(10);
      staff.password = await bcrypt.hash(newPassword, salt);
      
      // Flush tokens entirely to prevent replay attacks
      staff.verificationOtp = null;
      staff.verifyOtpExpireAt = null;
      staff.isOtpVerified = false; 
      
      await staff.save();

      return res.status(200).json({ success: true, message: "Password updated successfully." });
    }

    return res.status(400).json({ success: false, message: `Invalid parameter action step: "${step}"` });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =========================================================================
// 5. IN-APP PASS CHANGING (Settings Modification Routine)
// =========================================================================
export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const staffId = req.user.id; 

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: "Both current and new passwords are required." });
  }

  try {
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ success: false, message: "Staff account instance not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, staff.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect current password." });
    }

    const salt = await bcrypt.genSalt(10);
    staff.password = await bcrypt.hash(newPassword, salt);
    await staff.save();

    return res.status(200).json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
import { teacherModel } from "../models/Teacher/teacher.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js"; // Importing your existing transporter


// Teacher Login
export const teacherLogin = async (req, res) => {
  const { contact, password } = req.body;
  if (!contact || !password) {
    return res.status(400).json({ success: false, message: "All fields are required!" });
  }

  try {
    const teacher = await teacherModel.findOne({ contact });
    if (!teacher) {
      return res.status(401).json({ success: false, message: "Your account does not exist! Create a new account!" });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Wrong password! Please enter a correct password!" });
    }

    const token = jwt.sign({ id: teacher._id, role: "teacher" }, process.env.JWT_SECRET, { expiresIn: "365d" });

    const teacherData = {
      id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      contact: teacher.contact,
      gender: teacher.gender,
      image: teacher.image,
      teacherId: teacher.teacherId,
      designation: teacher.designation,
      subjectTaught: teacher.subjectTaught,
      degree: teacher.degree,
      experience: teacher.experience,
      joiningDate: teacher.joiningDate,
      address: teacher.address,
      status: teacher.status,
    };

    return res.status(200).json({ success: true, token, teacher: teacherData, message: "You have successfully logged in!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin Login
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

// Fetch Authenticated Teacher Profile
export const getTeacherProfile = async (req, res) => {
  try {
    const teacher = await teacherModel
      .findById(req.user.id)
      .select(
        "name email contact gender image teacherId designation subjectTaught degree experience address joiningDate status"
      )
      .lean();

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    return res.status(200).json({
      success: true,
      teacher,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Forgot Password for Teacher - Enters Contact -> Dispatches Email OTP -> Verifies OTP -> Resets Password

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const forgotPasswordTeacher = async (req, res) => {
  const { step } = req.params;
  const { email, otp, newPassword } = req.body;
  const targetEmail = email?.trim().toLowerCase();

  try {
    // -------------------------------------------------------------
    // PATH 1: /forgot-password/teacher/send-otp
    // -------------------------------------------------------------
    if (step === "send-otp") {
      if (!targetEmail) return res.status(400).json({ success: false, message: "Email is required" });

      const generatedOtp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 Minutes Lifecycle

      const teacher = await teacherModel.findOneAndUpdate(
        { email: targetEmail },
        { 
          verificationOtp: generatedOtp, 
          verifyOtpExpireAt: otpExpiry,
          isOtpVerified: false 
        },
        { new: true }
      );

      if (!teacher) {
        return res.status(404).json({ success: false, message: "No account found matching this email address" });
      }

      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: teacher.email,
        subject: "Password Reset OTP - Nashib Ali Academy",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #ff4d2d; text-align: center;">Password Reset Request</h2>
            <p>Dear <strong>${teacher.name}</strong>,</p>
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
    // PATH 2: /forgot-password/teacher/verify-otp
    // -------------------------------------------------------------
    if (step === "verify-otp") {
      if (!targetEmail || !otp) {
        return res.status(400).json({ success: false, message: "Email and OTP are required" });
      }

      const teacher = await teacherModel.findOneAndUpdate(
        { 
          email: targetEmail,
          verificationOtp: otp,
          verifyOtpExpireAt: { $gt: new Date() } // Ensures OTP token is not expired
        },
        { isOtpVerified: true }, // Unlocks the validation switch state flag
        { new: true }
      );

      if (!teacher) {
        return res.status(401).json({ success: false, message: "Invalid or expired OTP code." });
      }

      return res.status(200).json({ success: true, message: "OTP verified successfully." });
    }

    // -------------------------------------------------------------
    // PATH 3: /forgot-password/teacher/reset-password
    // -------------------------------------------------------------
    if (step === "reset-password") {
      if (!targetEmail || !newPassword) {
        return res.status(400).json({ success: false, message: "Email and new password are required" });
      }

      const teacher = await teacherModel.findOne({ email: targetEmail });
      if (!teacher) {
        return res.status(404).json({ success: false, message: "Account instance not found." });
      }

      // Safeguard check blocking forced malicious requests skipping path 2 execution
      if (!teacher.isOtpVerified) {
        return res.status(403).json({ success: false, message: "Security Violation: OTP has not been verified." });
      }

      const salt = await bcrypt.genSalt(10);
      teacher.password = await bcrypt.hash(newPassword, salt);
      
      // Flush tokens completely to avoid replay attacks
      teacher.verificationOtp = null;
      teacher.verifyOtpExpireAt = null;
      teacher.isOtpVerified = false; 
      
      await teacher.save();

      return res.status(200).json({ success: true, message: "Password updated successfully." });
    }

    // Catch-all safety for invalid URL path inputs
    return res.status(400).json({ success: false, message: `Invalid parameter action step: "${step}"` });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Authenticated Change Password (In-App Settings Action)
export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const teacherId = req.user.id; 

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: "Both current and new passwords are required." });
  }

  try {
    const teacher = await teacherModel.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher account instance not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, teacher.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect current password." });
    }

    const salt = await bcrypt.genSalt(10);
    teacher.password = await bcrypt.hash(newPassword, salt);
    await teacher.save();

    return res.status(200).json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
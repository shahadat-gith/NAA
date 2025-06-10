import { teacherModel } from "../models/teacherModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";

// Helper function to generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Teacher Login
export const teacherLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ success: false, message: "All fields are required!" });
  }

  try {
    const teacher = await teacherModel.findOne({ email });
    if (!teacher) {
      return res.json({ success: false, message: "Your account does not exist! Create a new account!" });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Wrong password! Please enter a correct password!" });
    }

    const token = jwt.sign({ id: teacher._id, role: "teacher" }, process.env.JWT_SECRET, { expiresIn: "365d" });
    return res.json({ success: true, token, message: "You have successfully logged in!" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Admin Login
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ success: false, message: "All fields are required!" });
  }

  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ id: "admin", role: "admin" }, process.env.JWT_SECRET, { expiresIn: "365d" });
    return res.json({ success: true, token, message: "You have successfully logged in!" });
  } else {
    return res.json({ success: false, message: "Wrong email or password!" });
  }
};

// Fetch Authenticated Teacher Profile
export const getTeacherProfile = async (req, res) => {
  try {
    const teacher = await teacherModel.findById(req.user.id).select("-password");
    if (!teacher) return res.status(404).json({ success: false, message: "Teacher not found" });
    return res.json({ success: true, data: teacher });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Forgot Password for Teacher
export const forgotPasswordTeacher = async (req, res) => {
  const { email, otp, newPassword, action } = req.body;

  try {
    // Step 1: Send OTP
    if (action === "send-otp") {
      if (!email) {
        return res.json({ success: false, message: "Email is required" });
      }

      const teacher = await teacherModel.findOne({ email });
      if (!teacher) {
        return res.json({ success: false, message: "Teacher with this email does not exist" });
      }

      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

      // Update teacher with OTP and expiry
      teacher.verificationOtp = otp;
      teacher.verifyOtpExpireAt = otpExpiry;
      await teacher.save();

      // Send OTP via email
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: 'Password Reset OTP - Nashib Ali Academy',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Password Reset Request</h2>
            <p>Dear ${teacher.name},</p>
            <p>You have requested to reset your password for your Nashib Ali Academy teacher account. Use the following OTP to proceed:</p>
            <h3 style="background: #f0f0f0; padding: 10px; text-align: center; border-radius: 5px;">${otp}</h3>
            <p>This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
            <p>Best regards,<br>Nashib Ali Academy Team</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      return res.json({ success: true, message: "OTP sent to your email" });
    }

    // Step 2: Verify OTP
    else if (action === "verify-otp") {
      if (!email || !otp) {
        return res.json({ success: false, message: "Email and OTP are required" });
      }

      const teacher = await teacherModel.findOne({ email });
      if (!teacher) {
        return res.json({ success: false, message: "Teacher with this email does not exist" });
      }

      if (!teacher.verificationOtp || teacher.verifyOtpExpireAt < Date.now()) {
        return res.json({ success: false, message: "OTP is invalid or expired" });
      }

      if (teacher.verificationOtp !== otp) {
        return res.json({ success: false, message: "Incorrect OTP" });
      }

      // Simulate OTP verification delay (for consistency with frontend)
      setTimeout(() => {
        return res.json({ success: true, message: "OTP verified successfully" });
      }, 2000);
    }

    // Step 3: Reset Password
    else if (action === "reset-password") {
      if (!email || !newPassword) {
        return res.json({ success: false, message: "Email and new password are required" });
      }

      const teacher = await teacherModel.findOne({ email });
      if (!teacher) {
        return res.json({ success: false, message: "Teacher with this email does not exist" });
      }

      if (!teacher.verificationOtp || teacher.verifyOtpExpireAt < Date.now()) {
        return res.json({ success: false, message: "OTP is invalid or expired. Please request a new OTP" });
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password and clear OTP fields
      teacher.password = hashedPassword;
      teacher.verificationOtp = null;
      teacher.verifyOtpExpireAt = null;
      await teacher.save();

      // Simulate password reset delay (for consistency with frontend)
      setTimeout(() => {
        return res.json({ success: true, message: "Password reset successfully" });
      }, 2000);
    }

    else {
      return res.json({ success: false, message: "Invalid action" });
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
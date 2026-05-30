import { teacherModel } from "../models/Teacher/teacher.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js"; // Importing your existing transporter

// Helper function to generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

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

// Forgot Password for Teacher - Enters Contact -> Dispatches Email OTP
export const forgotPasswordTeacher = async (req, res) => {
  const { contact, otp, newPassword, action } = req.body;

  try {
    // Step 1: Look up by contact and send secure OTP via Email
    if (action === "send-otp") {
      if (!contact) {
        return res.status(400).json({ success: false, message: "Contact number is required" });
      }

      const teacher = await teacherModel.findOne({ contact });
      if (!teacher) {
        return res.status(404).json({ success: false, message: "Teacher with this contact number does not exist" });
      }

      if (!teacher.email || teacher.email === "N/A") {
        return res.status(400).json({ 
          success: false, 
          message: "No registered email address found for this account. Please reach out to administration." 
        });
      }

      const generatedOtp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes validation threshold

      teacher.verificationOtp = generatedOtp;
      teacher.verifyOtpExpireAt = otpExpiry;
      await teacher.save();

      // Masking user email for client privacy fallback visibility (e.g., s******@gmail.com)
      const [emailUser, emailDomain] = teacher.email.split("@");
      const maskedEmail = `${emailUser.charAt(0)}******@${emailDomain}`;

      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: teacher.email,
        subject: "Password Reset OTP - Nashib Ali Academy",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #ff4d2d; text-align: center;">Password Reset Request</h2>
            <p>Dear <strong>${teacher.name}</strong>,</p>
            <p>You requested a secure password modification for your Nashib Ali Academy portal account.</p>
            <div style="background: #f5f5f5; padding: 16px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <span style="font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #1f2937;">${generatedOtp}</span>
            </div>
            <p style="color: #6b7280; font-size: 13px;">This verification token parameters frame will expire in 10 minutes. If you did not initiate this request, please safely disregard this email.</p>
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">Nashib Ali Academy Portal System Automated Notification</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      return res.status(200).json({ 
        success: true, 
        message: `Verification code sent smoothly to your registered email (${maskedEmail}).` 
      });
    }

    // Step 2: Verify Mobile Entry against DB token record
    else if (action === "verify-otp") {
      if (!contact || !otp) {
        return res.status(400).json({ success: false, message: "Contact number and OTP are required" });
      }

      const teacher = await teacherModel.findOne({ contact });
      if (!teacher) {
        return res.status(404).json({ success: false, message: "Teacher with this contact number does not exist" });
      }

      if (!teacher.verificationOtp || teacher.verifyOtpExpireAt < Date.now()) {
        return res.status(400).json({ success: false, message: "OTP is invalid or expired" });
      }

      if (teacher.verificationOtp !== otp) {
        return res.status(401).json({ success: false, message: "Incorrect OTP" });
      }

      return res.status(200).json({ success: true, message: "OTP verified successfully" });
    }

    // Step 3: Overwrite and commit password fields
    else if (action === "reset-password") {
      if (!contact || !newPassword) {
        return res.status(400).json({ success: false, message: "Contact number and new password are required" });
      }

      const teacher = await teacherModel.findOne({ contact });
      if (!teacher) {
        return res.status(404).json({ success: false, message: "Teacher with this contact number does not exist" });
      }

      if (!teacher.verificationOtp || teacher.verifyOtpExpireAt < Date.now()) {
        return res.status(400).json({ success: false, message: "OTP session is invalid or expired. Please request a new OTP" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      teacher.password = hashedPassword;
      teacher.verificationOtp = null;
      teacher.verifyOtpExpireAt = null;
      await teacher.save();

      return res.status(200).json({ success: true, message: "Password reset successfully" });
    }

    else {
      return res.status(400).json({ success: false, message: "Invalid action parameters." });
    }
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
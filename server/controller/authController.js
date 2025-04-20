import { teacherModel } from "../models/teacherModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
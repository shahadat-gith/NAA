import mongoose from "mongoose";
import Settings from "../models/Settings.js";
import Student from "../models/Student.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

// Utility for Razorpay signature verification
const verifyRazorpaySignature = (orderId, paymentId, signature) => {
  const sign = `${orderId}|${paymentId}`;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
    .update(sign)
    .digest("hex");
  return expectedSign === signature;
};

const getHostelFee = async () => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = new Settings();
    await settings.save();
  }
  return settings.hostelFee || 0;
};

const getAdmissionFees = async () => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = new Settings();
    await settings.save();
  }
  return {
    admissionFee: settings.admissionFee || 0,
    hostelAdmissionFee: settings.hostelAdmissionFee || 0,
  };
};

const getClassFees = async (className, medium, stream) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = new Settings();
    await settings.save();
  }

  const classFees = settings.classFees || { english: {}, assamese: {} };
  if (medium === "assamese" && ["11", "12"].includes(className)) {
    if (!stream) {
      throw new Error("Stream is required for Assamese Class 11/12");
    }
    return classFees.assamese?.[className]?.[stream] || 0;
  }
  return classFees[medium]?.[className] || 0;
};

const getCurrentMonthString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

export const createStudent = async (req, res) => {
  try {
    const { name, registrationNo, class: className, medium, stream, hostel, father, mother, phone } = req.body;

    if (!name || !registrationNo || !className || !medium || !father || !mother) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    if (!["Yes", "No"].includes(hostel)) {
      return res.status(400).json({ success: false, message: "Hostel must be 'Yes' or 'No'" });
    }

    const existing = await Student.findOne({ registrationNo });
    if (existing) {
      return res.status(409).json({ success: false, message: "Student already exists" });
    }

    const newStudent = new Student({
      name,
      father,
      mother,
      registrationNo,
      class: className,
      medium,
      stream: stream || "",
      hostel,
      phone,
      admissionfees: {
        admissionFee: 0,
        hostelAdmissionFee: 0,
      },
      dues: {
        monthlyDue: { amount: 0, lastUpdatedMonth: "" },
        hostelDue: { amount: 0, lastUpdatedMonth: "" },
      },
      payments: [],
      results: [],
    });

    await newStudent.save();
    res.status(201).json({ success: true, student: newStudent });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating student", error: err.message });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const { name } = req.query;
    const filter = name ? { name: { $regex: name, $options: "i" } } : {};
    const students = await Student.find(filter).lean();
    res.status(200).json({ success: true, students });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching students", error: err.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid student ID" });
    }
    const student = await Student.findById(id).lean();
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }
    res.status(200).json({ success: true, student });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching student", error: err.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid student ID" });
    }
    const { hostel } = req.body;
    if (hostel && !["Yes", "No"].includes(hostel)) {
      return res.status(400).json({ success: false, message: "Hostel must be 'Yes' or 'No'" });
    }
    const updated = await Student.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }
    res.status(200).json({ success: true, student: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating student", error: err.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid student ID" });
    }
    const deleted = await Student.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }
    res.status(200).json({ success: true, message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting student", error: err.message });
  }
};

export const massAddStudents = async (req, res) => {
  try {
    const students = req.body.students;
    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid input array" });
    }

    const toInsert = [];
    const skipped = [];

    for (const stu of students) {
      const { name, registrationNo, class: className, medium, stream, hostel, father, mother, phone } = stu;

      if (!name || !registrationNo || !className || !medium || !father || !mother) {
        skipped.push({ registrationNo, reason: "Missing required fields" });
        continue;
      }

      if (!["Yes", "No"].includes(hostel)) {
        skipped.push({ registrationNo, reason: "Invalid hostel value, must be 'Yes' or 'No'" });
        continue;
      }

      const existing = await Student.findOne({ registrationNo });
      if (existing) {
        skipped.push({ registrationNo, reason: "Already exists" });
        continue;
      }

      toInsert.push({
        name,
        father,
        mother,
        registrationNo,
        class: className,
        medium,
        stream: stream || "",
        hostel,
        phone,
        admissionfees: {
          admissionFee: 0,
          hostelAdmissionFee: 0,
        },
        dues: {
          monthlyDue: { amount: 0, lastUpdatedMonth: "" },
          hostelDue: { amount: 0, lastUpdatedMonth: "" },
        },
        payments: [],
        results: [],
      });
    }

    const inserted = await Student.insertMany(toInsert);
    res.status(201).json({ success: true, insertedCount: inserted.length, skipped });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error in bulk upload", error: err.message });
  }
};

export const updateSpecialStatus = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid student ID" });
    }
    const { isSpecial, specialMonthlyFee } = req.body;

    if (typeof isSpecial !== "boolean" || (isSpecial && (!specialMonthlyFee || specialMonthlyFee < 0))) {
      return res.status(400).json({ success: false, message: "Invalid isSpecial or specialMonthlyFee" });
    }

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    student.isSpecial = isSpecial;
    student.specialMonthlyFee = isSpecial ? specialMonthlyFee : 0;
    await student.save();

    res.status(200).json({ success: true, student });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating special status", error: err.message });
  }
};

export const updateMonthlyDuesForClass = async (req, res) => {
  try {
    const { className, medium, stream } = req.body;

    if (!className || !medium) {
      return res.status(400).json({ success: false, message: "className and medium are required" });
    }

    const filter = { class: className, medium };
    if (["11", "12"].includes(className) && medium === "assamese") {
      if (!stream) {
        return res.status(400).json({ success: false, message: "Stream is required for Assamese Class 11/12" });
      }
      filter.stream = stream;
    }

    const students = await Student.find(filter);
    if (!students.length) {
      return res.status(404).json({
        success: false,
        message: `No students found for class ${className} (${medium}${stream ? `, stream: ${stream}` : ""})`,
      });
    }

    const classFee = await getClassFees(className, medium, stream);
    if (classFee === 0) {
      return res.status(400).json({
        success: false,
        message: `No fee configured for class ${className} (${medium}${stream ? `, stream: ${stream}` : ""})`,
      });
    }

    const lastUpdatedMonth = getCurrentMonthString();
    const result = await Student.updateMany(
      filter,
      {
        $set: {
          "dues.monthlyDue": {
            amount: classFee,
            lastUpdatedMonth,
          },
        },
      }
    );

    res.status(200).json({
      success: true,
      message: `Monthly dues updated to ₹${classFee} for ${result.modifiedCount} students in class ${className} (${medium}${stream ? `, stream: ${stream}` : ""}) for ${lastUpdatedMonth}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update monthly dues", error: err.message });
  }
};

export const updateHostelDues = async (req, res) => {
  try {
    const hostelFee = await getHostelFee();
    const lastUpdatedMonth = getCurrentMonthString();

    // Initialize hostelDue for students missing it
    await Student.updateMany(
      { hostel: "Yes", "dues.hostelDue": { $not: { $type: "object" } } },
      { $set: { "dues.hostelDue": { amount: 0, lastUpdatedMonth: "" } } }
    );

    const result = await Student.updateMany(
      { hostel: "Yes" },
      {
        $set: {
          "dues.hostelDue": {
            amount: hostelFee,
            lastUpdatedMonth,
          },
        },
      }
    );

    res.status(200).json({
      success: true,
      message: `Hostel dues updated to ₹${hostelFee} for ${result.modifiedCount} hostel boarders for ${lastUpdatedMonth}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update hostel dues", error: err.message });
  }
};

export const updateAdmissionFees = async (req, res) => {
  try {
    const { className, medium, stream } = req.body;

    const filter = { class: className, medium };
    if (["11", "12"].includes(className) && medium === "assamese") {
      if (!stream) {
        return res.status(400).json({ success: false, message: "Stream is required for Assamese Class 11/12" });
      }
      filter.stream = stream;
    }

    const students = await Student.find(filter);
    if (!students.length) {
      return res.status(404).json({
        success: false,
        message: `No students found for class ${className} (${medium}${stream ? `, stream: ${stream}` : ""})`,
      });
    }

    const { admissionFee, hostelAdmissionFee } = await getAdmissionFees();
    if (admissionFee === 0) {
      return res.status(400).json({
        success: false,
        message: `No admission fee configured for class ${className} (${medium}${stream ? `, stream: ${stream}` : ""})`,
      });
    }

    const result = await Student.updateMany(
      filter,
      {
        $set: {
          "admissionfees.admissionFee": admissionFee,
          "admissionfees.hostelAdmissionFee": { $cond: [{ $eq: ["$hostel", "Yes"] }, hostelAdmissionFee, 0] },
        },
      }
    );

    res.status(200).json({
      success: true,
      message: `Admission fees updated for ${result.modifiedCount} students in class ${className} (${medium}${stream ? `, stream: ${stream}` : ""})`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update admission fees", error: err.message });
  }
};

export const addPayment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid student ID" });
    }
    const { amount, paymentType, month, paymentMode } = req.body;

    if (!amount || !paymentType || !paymentMode) {
      return res.status(400).json({ success: false, message: "Missing required payment fields" });
    }

    const amountNum = parseInt(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({ success: false, message: "Invalid payment amount" });
    }

    if (paymentType.includes("monthly") && month && !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ success: false, message: "Invalid month format. Use YYYY-MM" });
    }

    const validPaymentTypes = ["admissionfee", "hosteladmissionfee", "monthlyfee", "hostelmonthlyfee"];
    if (!validPaymentTypes.includes(paymentType)) {
      return res.status(400).json({ success: false, message: "Invalid payment type" });
    }

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const payment = {
      amount: amountNum,
      paymentType,
      paymentMode,
      paymentDate: new Date(),
      status: "completed",
      month: paymentType.includes("monthly") ? month : undefined,
    };

    let currentDue = 0;
    if (paymentType === "monthlyfee") {
      currentDue = student.dues.monthlyDue.amount || 0;
      student.dues.monthlyDue.amount = Math.max(0, currentDue - amountNum);
    } else if (paymentType === "hostelmonthlyfee") {
      currentDue = student.dues.hostelDue.amount || 0;
      student.dues.hostelDue.amount = Math.max(0, currentDue - amountNum);
    } else if (paymentType === "admissionfee") {
      currentDue = student.admissionfees.admissionFee || 0;
      student.admissionfees.admissionFee = Math.max(0, currentDue - amountNum);
    } else if (paymentType === "hosteladmissionfee") {
      currentDue = student.admissionfees.hostelAdmissionFee || 0;
      student.admissionfees.hostelAdmissionFee = Math.max(0, currentDue - amountNum);
    }

    if (amountNum > currentDue) {
      return res.status(400).json({ success: false, message: "Payment amount exceeds dues" });
    }

    student.payments.push(payment);
    await student.save();

    res.status(201).json({ success: true, transaction: payment });
  } catch (err) {
    console.error("Error in addPayment:", err);
    res.status(500).json({ success: false, message: "Error recording payment", error: err.message });
  }
};

export const removeHostelStatus = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid student ID" });
    }
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    if (student.hostel !== "Yes") {
      return res.status(400).json({ success: false, message: "Student is not a hostel boarder" });
    }

    student.hostel = "No";
    student.dues.hostelDue = { amount: 0, lastUpdatedMonth: "" };
    student.admissionfees.hostelAdmissionFee = 0;
    await student.save();

    res.status(200).json({ success: true, message: "Student removed from hostel management" });
  } catch (err) {
    console.error("Error in removeHostelStatus:", err);
    res.status(500).json({ success: false, message: "Error removing hostel status", error: err.message });
  }
};

export const createPaymentOrder = async (req, res) => {
  try {
    const { studentId, amount, paymentType, feeType, month } = req.body;

    if (!mongoose.isValidObjectId(studentId)) {
      return res.status(400).json({ success: false, message: "Invalid student ID" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const validPaymentTypes = ["admissionfee", "hosteladmissionfee", "monthlyfee", "hostelmonthlyfee"];
    if (!validPaymentTypes.includes(paymentType)) {
      return res.status(400).json({ success: false, message: "Invalid payment type" });
    }

    let currentDue = 0;
    if (paymentType === "monthlyfee") {
      const feeAmount = student.isSpecial
        ? student.specialMonthlyFee
        : student.dues.monthlyDue?.amount || (await getClassFees(student.class, student.medium, student.stream));
      currentDue = feeAmount;
    } else if (paymentType === "hostelmonthlyfee") {
      currentDue = student.dues.hostelDue?.amount || 0;
    } else if (paymentType === "admissionfee") {
      currentDue = student.admissionfees?.admissionFee || 0;
    } else if (paymentType === "hosteladmissionfee") {
      currentDue = student.admissionfees?.hostelAdmissionFee || 0;
    }

    if (amount > currentDue) {
      return res.status(400).json({ success: false, message: "Amount exceeds dues" });
    }

    const receipt = `Pay-${studentId}-${paymentType}${month ? `-${month}` : ""}`.slice(0, 40);

    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects amount in paisa
      currency: "INR",
      receipt,
      notes: { studentId, paymentType, feeType, month },
    });

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      key: process.env.RAZORPAY_API_KEY,
    });
  } catch (err) {
    console.error("Error in createPaymentOrder:", err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Payment order creation failed",
      error: err,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, studentId, amount, paymentType, feeType, month } = req.body;

    if (!mongoose.isValidObjectId(studentId)) {
      return res.status(400).json({ success: false, message: "Invalid student ID" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const validPaymentTypes = ["admissionfee", "hosteladmissionfee", "monthlyfee", "hostelmonthlyfee"];
    if (!validPaymentTypes.includes(paymentType)) {
      return res.status(400).json({ success: false, message: "Invalid payment type" });
    }

    if (!verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    let currentDue = 0;
    let updateField = {};
    if (paymentType === "monthlyfee") {
      currentDue = student.isSpecial ? student.specialMonthlyFee : student.dues.monthlyDue?.amount || 0;
      updateField = { "dues.monthlyDue.amount": Math.max(0, currentDue - amount) };
    } else if (paymentType === "hostelmonthlyfee") {
      currentDue = student.dues.hostelDue?.amount || 0;
      updateField = { "dues.hostelDue.amount": Math.max(0, currentDue - amount) };
    } else if (paymentType === "admissionfee") {
      currentDue = student.admissionfees?.admissionFee || 0;
      updateField = { "admissionfees.admissionFee": Math.max(0, currentDue - amount) };
    } else if (paymentType === "hosteladmissionfee") {
      currentDue = student.admissionfees?.hostelAdmissionFee || 0;
      updateField = { "admissionfees.hostelAdmissionFee": Math.max(0, currentDue - amount) };
    }

    if (amount > currentDue) {
      return res.status(400).json({ success: false, message: "Amount exceeds dues" });
    }

    const payment = {
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      signature: razorpay_signature,
      amount,
      paymentType,
      paymentMode: "online",
      status: "completed",
      paymentDate: new Date(),
      month: paymentType.includes("monthly") ? month : undefined,
    };

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      {
        $push: { payments: payment },
        $set: updateField,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, message: "Payment verified successfully", student: updatedStudent });
  } catch (err) {
    console.error("Error in verifyPayment:", err);
    res.status(500).json({ success: false, message: "Payment verification failed", error: err.message });
  }
};

export const getPaymentDetails = async (req, res) => {
  try {
    const { id, paymentId } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid student ID" });
    }
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const payment = student.payments.id(paymentId);
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    res.status(200).json({ success: true, payment });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to retrieve payment details", error: err.message });
  }
};

// Add endpoint for fetching settings (used by StudentDetails.jsx)
export const getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      const newSettings = new Settings();
      await newSettings.save();
      return res.status(200).json({ success: true, admitCardConfig: newSettings.admitCardConfig });
    }
    res.status(200).json({ success: true, admitCardConfig: settings.admitCardConfig });
  } catch (err) {
    console.error("Error in getSettings:", err);
    res.status(500).json({ success: false, message: "Failed to fetch settings", error: err.message });
  }
};



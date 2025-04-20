import Student from "../models/StudentModel.js";
import Settings from "../models/Settings.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import XLSX from "xlsx";
import { fileURLToPath } from "url";
import { createRazorpayOrder, verifyRazorpayPayment } from "../utils/paymentUtils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utility Functions
const getHostelFee = async () => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = new Settings();
    await settings.save();
  }
  return settings.hostelFee || 0;
};

const getClassFees = async () => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = new Settings();
    await settings.save();
  }
  return settings.classFees || {};
};

// Get All Students
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    const classFees = await getClassFees();
    const hostelFee = await getHostelFee();

    const enrichedStudents = students.map((student) => ({
      ...student._doc,
      monthlyFee:
        classFees[student.medium]?.[student.class] && typeof classFees[student.medium][student.class] === "object"
          ? classFees[student.medium][student.class][student.stream] || 0
          : classFees[student.medium]?.[student.class] || 0,
      hostelFee: student.hostel === "Yes" ? hostelFee : 0,
    }));

    res.status(200).json({ success: true, count: enrichedStudents.length, data: enrichedStudents });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ success: false, message: "Error fetching students", error: error.message });
  }
};

// Get Student by ID
export const getStudentById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid student ID format" });
    }
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }
    const classFees = await getClassFees();
    const hostelFee = await getHostelFee();

    const enrichedStudent = {
      ...student._doc,
      monthlyFee:
        classFees[student.medium]?.[student.class] && typeof classFees[student.medium][student.class] === "object"
          ? classFees[student.medium][student.class][student.stream] || 0
          : classFees[student.medium]?.[student.class] || 0,
      hostelFee: student.hostel === "Yes" ? hostelFee : 0,
    };

    res.status(200).json({ success: true, data: enrichedStudent });
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ success: false, message: "Error fetching student", error: error.message });
  }
};

// Update Admission Status
export const updateAdmissionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid student ID format" });
    }
    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status. Must be Pending, Approved, or Rejected" });
    }

    const student = await Student.findByIdAndUpdate(req.params.id, { admissionStatus: status }, { new: true, runValidators: true });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    console.error("Error updating admission status:", error);
    res.status(500).json({ success: false, message: "Error updating admission status", error: error.message });
  }
};

// Delete Student
export const deleteStudent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid student ID format" });
    }

    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    if (student.image) {
      const imagePath = path.join(__dirname, "..", "..", student.image);
      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log(`Image deleted: ${imagePath}`);
        }
      } catch (fileError) {
        console.error(`Error deleting image file ${imagePath}:`, fileError);
      }
    }

    res.status(200).json({ success: true, message: "Student and associated data deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ success: false, message: "Error deleting student", error: error.message });
  }
};


// Search Students
export const searchStudents = async (req, res) => {
  try {
    const { name, aadhar, phone } = req.query;

    // Ensure at least one search parameter is provided
    if (!name && !aadhar && !phone) {
      return res.status(400).json({
        success: false,
        message: "At least one search parameter (name, aadhar, phone) is required",
      });
    }

    const query = {};

    // Search by full name (firstName, middleName, lastName)
    if (name) {
      const trimmedName = name.trim();
      if (!trimmedName) {
        return res.status(400).json({ success: false, message: "Name cannot be empty" });
      }

      // Split the name into parts for flexible matching
      const nameParts = trimmedName.split(/\s+/).filter((part) => part.length > 0);

      // Build a query to match any part of the name across firstName, middleName, and lastName
      query.$or = [
        { firstName: { $regex: trimmedName, $options: "i" } },
        { middleName: { $regex: trimmedName, $options: "i" } },
        { lastName: { $regex: trimmedName, $options: "i" } },
      ];

      // If multiple parts are provided, allow flexible matching across fields
      if (nameParts.length > 1) {
        query.$or = nameParts.map((part) => ({
          $or: [
            { firstName: { $regex: part, $options: "i" } },
            { middleName: { $regex: part, $options: "i" } },
            { lastName: { $regex: part, $options: "i" } },
          ],
        }));
        query.$and = query.$or; // Ensure all parts match somewhere
        delete query.$or; // Replace $or with $and for multi-part names
      }
    }

    // Search by Aadhaar
    if (aadhar) {
      const trimmedAadhar = aadhar.trim();
      if (!trimmedAadhar) {
        return res.status(400).json({ success: false, message: "Aadhaar cannot be empty" });
      }
      query.aadhar = { $regex: trimmedAadhar, $options: "i" };
    }

    // Search by Phone
    if (phone) {
      const trimmedPhone = phone.trim();
      if (!trimmedPhone) {
        return res.status(400).json({ success: false, message: "Phone cannot be empty" });
      }
      query.phone = { $regex: trimmedPhone, $options: "i" };
    }

    // Execute the query
    const students = await Student.find(query).lean();
    if (!students.length) {
      return res.status(404).json({
        success: false,
        message: "No students found matching the criteria",
      });
    }

    // Fetch class and hostel fees
    const classFees = await getClassFees();
    const hostelFee = await getHostelFee();

    // Enrich student data with calculated fees
    const enrichedStudents = students.map((student) => ({
      _id: student._id,
      firstName: student.firstName,
      middleName: student.middleName || "", // Include middleName, default to empty string if not present
      lastName: student.lastName,
      fatherName: student.fatherName,
      motherName: student.motherName,
      rollNo: student.rollNo,
      registrationNo: student.registrationNo,
      aadhar: student.aadhar,
      phone: student.phone,
      class: student.class,
      medium: student.medium,
      stream: student.stream,
      dueAmount: student.dueAmount,
      hostelDueAmount: student.hostelDueAmount,
      monthlyFee:
        classFees[student.medium]?.[student.class] && typeof classFees[student.medium][student.class] === "object"
          ? classFees[student.medium][student.class][student.stream] || 0
          : classFees[student.medium]?.[student.class] || 0,
      hostelFee: student.hostel === "Yes" ? hostelFee : 0,
      payments: student.payments,
      lastPaymentDate: student.lastPaymentDate,
    }));

    res.status(200).json({
      success: true,
      count: enrichedStudents.length,
      data: enrichedStudents,
    });
  } catch (error) {
    console.error("Error searching students:", error);
    res.status(500).json({
      success: false,
      message: "Error searching students",
      error: error.message,
    });
  }
};

// Record Payment (Used by both Admin and Client)
export const recordPayment = async (req, res) => {
  try {
    const { studentId, amount, month, paymentType, paymentMode = "cash" } = req.body;

    // Input validation
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ success: false, message: "Invalid student ID" });
    }
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Amount must be positive" });
    }
    if (!paymentType || !["admissionfee", "hosteladmissionfee", "monthlyfee", "hostelmonthlyfee"].includes(paymentType)) {
      return res.status(400).json({
        success: false,
        message: "Payment type must be 'admissionfee', 'hosteladmissionfee', 'monthlyfee', or 'hostelmonthlyfee'",
      });
    }
    if ((paymentType === "monthlyfee" || paymentType === "hostelmonthlyfee") && !month) {
      return res.status(400).json({ success: false, message: "Month is required for monthly payments" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // Determine which field to update
    let dueField, feeField;
    switch (paymentType) {
      case "admissionfee":
        dueField = "dueAmount";
        feeField = "admissionFee";
        break;
      case "hosteladmissionfee":
        if (student.hostel !== "Yes") {
          return res.status(400).json({ success: false, message: "Student is not enrolled in hostel" });
        }
        dueField = "hostelDueAmount";
        feeField = "hostelAdmissionFee";
        break;
      case "monthlyfee":
        dueField = "dueAmount";
        feeField = null; // No fee field to update for monthly payments
        break;
      case "hostelmonthlyfee":
        if (student.hostel !== "Yes") {
          return res.status(400).json({ success: false, message: "Student is not enrolled in hostel" });
        }
        dueField = "hostelDueAmount";
        feeField = null; // No fee field to update for monthly payments
        break;
    }

    if (amount > student[dueField]) {
      return res.status(400).json({ success: false, message: `Amount exceeds due amount for ${paymentType}` });
    }

    const transaction = {
      amount: parseFloat(amount),
      paymentType,
      paymentMode,
      status: paymentMode === "cash" ? "completed" : "pending",
      ...(month && { month }),
      paymentDate: new Date(),
    };

    let orderId = null;
    if (paymentMode === "online") {
      const order = await createRazorpayOrder({
        amount,
        receiptPrefix:
          paymentType === "admissionfee"
            ? "adm"
            : paymentType === "hosteladmissionfee"
            ? "hosteladm"
            : paymentType === "monthlyfee"
            ? "monthly"
            : "hostelmonthly",
        entityId: studentId,
      });
      transaction.orderId = order.id;
      orderId = order.id;
    }

    student.payments.push(transaction);

    // Update fields if payment is cash (admin) or prepare for online (client)
    if (paymentMode === "cash") {
      student[dueField] = Math.max(0, student[dueField] - amount);
      if (feeField) {
        student[feeField] = Math.max(0, student[feeField] - amount);
      }
      student.lastPaymentDate = new Date();
    }

    await student.save();

    res.status(200).json({
      success: true,
      message: `${paymentType} payment recorded`,
      data: {
        transaction,
        orderId: paymentMode === "online" ? orderId : null,
        key: process.env.RAZORPAY_API_KEY,
      },
    });
  } catch (error) {
    console.error("Error recording payment:", error);
    res.status(500).json({ success: false, message: "Error recording payment", error: error.message });
  }
};

// Verify Payment (Used by Client for Online Payments)
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, studentId, amount, paymentType, month } = req.body;

    // Input validation
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !studentId || !amount || !paymentType) {
      return res.status(400).json({ success: false, message: "Missing payment details" });
    }
    if (!["admissionfee", "hosteladmissionfee", "monthlyfee", "hostelmonthlyfee"].includes(paymentType)) {
      return res.status(400).json({ success: false, message: "Invalid payment type" });
    }

    // Verify Razorpay payment
    verifyRazorpayPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature });

    const student = await Student.findById(studentId); // Fixed typo from 'student' to 'studentId'
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const transaction = student.payments.find((t) => t.orderId === razorpay_order_id && t.status === "pending");
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Pending transaction not found" });
    }

    // Determine which field to update
    let dueField, feeField;
    switch (paymentType) {
      case "admissionfee":
        dueField = "dueAmount";
        feeField = "admissionFee";
        break;
      case "hosteladmissionfee":
        dueField = "hostelDueAmount";
        feeField = "hostelAdmissionFee";
        break;
      case "monthlyfee":
        dueField = "dueAmount";
        feeField = null;
        break;
      case "hostelmonthlyfee":
        dueField = "hostelDueAmount";
        feeField = null;
        break;
    }

    // Update transaction and student fields
    transaction.paymentId = razorpay_payment_id;
    transaction.signature = razorpay_signature;
    transaction.status = "completed";
    transaction.paymentDate = new Date();

    student[dueField] = Math.max(0, student[dueField] - amount);
    if (feeField) {
      student[feeField] = Math.max(0, student[feeField] - amount);
    }
    student.lastPaymentDate = new Date();

    await student.save();

    res.status(200).json({
      success: true,
      message: `${paymentType} payment verified successfully`,
      data: student,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ success: false, message: "Error verifying payment", error: error.message });
  }
};

// Submit Student Admission
export const submitStudentAdmission = async (req, res) => {
  try {
    const {
      firstName, middleName, lastName, aadhar, caste, gender, religion, medium, class: className,
      dob, fatherName, motherName, guardianContact, address, district, state, pincode,
      hostel, transport, parentsOccupation, admissionFee, hostelAdmissionFee, phone, stream,
      isNewAdmission,
    } = req.body;

    const requiredFields = {
      firstName, lastName, aadhar, caste, gender, religion, medium, class: className,
      dob, fatherName, motherName, guardianContact, address, district, state, pincode,
      hostel, transport, parentsOccupation, admissionFee, phone,
    };
    for (const [key, value] of Object.entries(requiredFields)) {
      if (value === undefined || value === null || value === "") {
        return res.status(400).json({ success: false, message: `${key} is required` });
      }
    }

    if (!["english", "assamese"].includes(medium)) {
      return res.status(400).json({ success: false, message: "Medium must be 'english' or 'assamese'" });
    }

    const englishClasses = ["nursery", "kg", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    const assameseClasses = ["ankur", "mukul", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
    const validClasses = medium === "english" ? englishClasses : assameseClasses;
    if (!validClasses.includes(className)) {
      return res.status(400).json({ success: false, message: `Invalid class: ${className} for ${medium} medium` });
    }

    if (medium === "assamese" && ["11", "12"].includes(className) && !["science", "arts"].includes(stream)) {
      return res.status(400).json({ success: false, message: "Stream must be 'science' or 'arts' for Assamese classes 11 and 12" });
    }

    if (!/^\d{12}$/.test(aadhar)) {
      return res.status(400).json({ success: false, message: "Aadhaar must be a 12-digit number" });
    }

    const existingStudent = await Student.findOne({ $or: [{ aadhar }, { phone }] });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: existingStudent.aadhar === aadhar ? "Aadhaar already exists" : "Phone number already exists",
      });
    }

    const parsedAdmissionFee = parseFloat(admissionFee);
    const effectiveHostelFee = hostel === "Yes" ? parseFloat(hostelAdmissionFee || (await getHostelFee())) : 0;

    let imagePath = null;
    if (req.file) {
      imagePath = `uploads/admissions/${req.file.filename}`;
    }

    const student = new Student({
      firstName, middleName, lastName, aadhar, caste, gender, religion, medium, class: className,
      dob: new Date(dob), fatherName, motherName, guardianContact, address, district, state, pincode,
      hostel, transport, parentsOccupation, admissionFee: parsedAdmissionFee, phone,
      hostelAdmissionFee: effectiveHostelFee,
      dueAmount: parsedAdmissionFee,
      hostelDueAmount: effectiveHostelFee,
      image: imagePath,
      admissionStatus: "Pending",
      rollNo: `TEMP-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      stream: stream || "",
      isNewAdmission: isNewAdmission === "true" || isNewAdmission === true,
    });

    await student.save();

    res.status(201).json({
      success: true,
      message: "Admission submitted successfully. Proceed to payment if required.",
      data: {
        studentId: student._id,
        dueAmount: student.dueAmount,
        hostelDueAmount: student.hostelDueAmount,
        admissionFee: student.admissionFee,
        hostelAdmissionFee: student.hostelAdmissionFee,
        isNewAdmission: student.isNewAdmission,
      },
    });
  } catch (error) {
    console.error("Error in submitStudentAdmission:", error);
    res.status(500).json({ success: false, message: "Error submitting admission", error: error.message });
  }
};

// Mass Admin Admission


export const massAdminAdmission = async (req, res) => {
  try {
    const studentsData = req.body.students;

    if (!studentsData || !Array.isArray(studentsData) || studentsData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No student data provided (send JSON array in 'students' field)",
      });
    }

    const hostelFee = await getHostelFee(); // Assuming this function exists

    const englishClasses = ["nursery", "kg", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    const assameseClasses = ["ankur", "mukul", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

    const validStudents = await Promise.all(
      studentsData.map(async (student) => {
        const {
          firstName, middleName, lastName, aadhar, caste, gender, religion, medium, class: className,
          dob, fatherName, motherName, guardianContact, address, district, state, pincode,
          hostel, transport, parentsOccupation, admissionFee, hostelAdmissionFee, phone, stream,
          admissionStatus, registrationNo // Parsed from Excel
        } = student;

        const requiredFields = {
          firstName, lastName, aadhar, caste, gender, religion, medium, class: className,
          dob, fatherName, motherName, guardianContact, address, district, state, pincode,
          hostel, transport, parentsOccupation, phone, registrationNo // Add registrationNo to required fields
        };
        for (const [key, value] of Object.entries(requiredFields)) {
          if (!value || String(value).trim() === "") {
            console.warn(`Missing or empty field ${key} for student`, student);
            return null;
          }
        }

        const normalizedMedium = medium.toLowerCase();
        if (!["english", "assamese"].includes(normalizedMedium)) {
          console.warn(`Invalid medium: ${medium}`, student);
          return null;
        }

        const validClasses = normalizedMedium === "english" ? englishClasses : assameseClasses;
        const normalizedClass = className.toLowerCase();
        if (!validClasses.includes(normalizedClass)) {
          console.warn(`Invalid class: ${className} for ${medium}`, student);
          return null;
        }

        if (normalizedMedium === "assamese" && ["11", "12"].includes(normalizedClass)) {
          const normalizedStream = stream ? stream.toLowerCase() : "";
          if (!["science", "arts"].includes(normalizedStream)) {
            console.warn(`Invalid or missing stream: ${stream}`, student);
            return null;
          }
        }

        if (!/^\d{12}$/.test(aadhar)) {
          console.warn(`Invalid Aadhaar: ${aadhar}`, student);
          return null;
        }

        // Check for duplicates
        const exists = await Student.findOne({ $or: [{ aadhar }, { phone }, { registrationNo }] });
        if (exists) {
          console.warn(`Duplicate aadhar, phone, or registrationNo: ${aadhar} / ${phone} / ${registrationNo}`);
          return null;
        }

        const parsedAdmissionFee = parseFloat(admissionFee || 0);
        const effectiveHostelFee = hostel.toLowerCase() === "yes" ? parseFloat(hostelAdmissionFee || hostelFee) : 0;

        return {
          firstName,
          middleName: middleName || "",
          lastName,
          aadhar,
          caste,
          gender,
          religion,
          medium: normalizedMedium,
          class: normalizedClass,
          dob: new Date(dob),
          fatherName,
          motherName,
          guardianContact,
          address,
          district,
          state,
          pincode,
          hostel,
          transport,
          parentsOccupation,
          admissionFee: parsedAdmissionFee,
          phone,
          hostelAdmissionFee: effectiveHostelFee,
          dueAmount: parsedAdmissionFee,
          hostelDueAmount: effectiveHostelFee,
          admissionStatus: admissionStatus || "Pending",
          rollNo: `TEMP-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, // Temporary rollNo
          stream: stream || "",
          registrationNo: String(registrationNo).trim(), // From Excel
          isNewAdmission: false,
        };
      })
    );

    const finalStudents = validStudents.filter(Boolean);
    if (finalStudents.length === 0) {
      return res.status(400).json({ success: false, message: "No valid students to import" });
    }

    const result = await Student.insertMany(finalStudents, { ordered: false });

    res.status(201).json({
      success: true,
      message: `${result.length} students admitted successfully`,
      count: result.length,
      data: result.map((s) => ({
        studentId: s._id,
        name: `${s.firstName} ${s.lastName}`,
        aadhar: s.aadhar,
        registrationNo: s.registrationNo,
        dueAmount: s.dueAmount,
        hostelDueAmount: s.hostelDueAmount,
        isNewAdmission: s.isNewAdmission,
      })),
    });
  } catch (error) {
    console.error("Error in massAdminAdmission:", error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Duplicate Aadhaar, Phone, or RegistrationNo detected" });
    }
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
// Add Monthly Fee to Class
export const addMonthlyFeeToClass = async (req, res) => {
  try {
    const { class: className, medium, stream } = req.body;

    // Validate required fields
    if (!className || !medium) {
      return res.status(400).json({ success: false, message: "Class and medium are required" });
    }

    // Validate stream for Assamese classes 11 and 12
    if (medium === "assamese" && ["11", "12"].includes(className) && !["science", "arts"].includes(stream)) {
      return res.status(400).json({
        success: false,
        message: "Stream must be 'science' or 'arts' for Assamese medium Class 11 and 12",
      });
    }

    // Fetch students matching the criteria
    const students = await Student.find({ class: className, medium, stream: stream || "" });
    if (students.length === 0) {
      return res.status(404).json({ success: false, message: "No students found for the given filters" });
    }

    // Get class fees from Settings
    const classFees = await getClassFees();
    const monthlyFee =
      classFees[medium]?.[className] && typeof classFees[medium][className] === "object"
        ? classFees[medium][className][stream] || 0
        : classFees[medium]?.[className] || 0;

    if (monthlyFee === 0) {
      return res.status(400).json({
        success: false,
        message: `No monthly fee defined for ${medium} medium, class ${className}${stream ? ` (${stream})` : ""} in settings`,
      });
    }

    // Update students' dueAmount without adding a transaction
    const updatedStudents = await Promise.all(
      students.map(async (student) => {
        student.dueAmount += monthlyFee;
        return student.save();
      })
    );

    res.status(200).json({
      success: true,
      message: `Monthly fee of ₹${monthlyFee} added to due balance for ${updatedStudents.length} students`,
      count: updatedStudents.length,
    });
  } catch (error) {
    console.error("Error adding monthly fee:", error);
    res.status(500).json({ success: false, message: "Error adding monthly fee", error: error.message });
  }
};

// Get Student Results
export const getStudentResults = async (req, res) => {
  try {
    const { rollNo, examName, academicSession } = req.query;
    if (!rollNo) {
      return res.status(400).json({ success: false, message: "Roll number is required" });
    }

    const student = await Student.findOne({ rollNo: String(rollNo).trim() }).select("firstName lastName rollNo dueAmount hostelDueAmount results");
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    if (student.dueAmount + student.hostelDueAmount > 0) {
      return res.status(403).json({
        success: false,
        message: `Result access denied. Outstanding dues: ₹${student.dueAmount + student.hostelDueAmount}. Please clear your dues.`,
      });
    }

    let filteredResults = student.results;
    if (examName) filteredResults = filteredResults.filter((r) => r.examName === examName.trim());
    if (academicSession) filteredResults = filteredResults.filter((r) => r.academicSession === academicSession.trim());

    res.status(200).json({
      success: true,
      data: {
        name: `${student.firstName} ${student.lastName}`,
        rollNo: student.rollNo,
        dueAmount: student.dueAmount,
        hostelDueAmount: student.hostelDueAmount,
        results: filteredResults,
      },
    });
  } catch (error) {
    console.error("Error in getStudentResults:", error);
    res.status(500).json({ success: false, message: "Error fetching results", error: error.message });
  }
};

export const updateDueAmount = async (req, res) => {
  try {
    const { dueAmount, hostelDueAmount } = req.body;
    if (
      (dueAmount === undefined && hostelDueAmount === undefined) ||
      (dueAmount !== undefined && dueAmount < 0) ||
      (hostelDueAmount !== undefined && hostelDueAmount < 0)
    ) {
      return res.status(400).json({ success: false, message: "Invalid due amount values" });
    }

    const updateFields = {};
    if (dueAmount !== undefined) updateFields.dueAmount = dueAmount;
    if (hostelDueAmount !== undefined) updateFields.hostelDueAmount = hostelDueAmount;

    const student = await Student.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, message: "Due amount updated successfully", data: student });
  } catch (error) {
    console.error("Error updating due amount:", error);
    res.status(500).json({ success: false, message: "Error updating due amount", error: error.message });
  }
};

// Get Transactions
export const getTransactions = async (req, res) => {
  try {
    const { studentId, type } = req.params;
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });

    const validTypes = ["admissionfee", "hosteladmissionfee", "monthlyfee", "hostelmonthlyfee"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ success: false, message: "Invalid transaction type" });
    }

    const transactions = student.payments.filter((tx) => tx.paymentType === type).map((tx) => ({
      ...tx._doc,
      status: tx.status || "Pending",
    }));

    res.status(200).json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Hostel Fee
export const updateHostelFee = async (req, res) => {
  try {
    const { hostelFee } = req.body;
    if (hostelFee === undefined || hostelFee < 0) {
      return res.status(400).json({ success: false, message: "Invalid hostel fee" });
    }

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({ hostelFee });
    } else {
      settings.hostelFee = hostelFee;
      settings.lastUpdated = new Date();
    }
    await settings.save();

    res.status(200).json({ success: true, message: "Hostel fee updated successfully", data: settings });
  } catch (error) {
    console.error("Error updating hostel fee:", error);
    res.status(500).json({ success: false, message: "Error updating hostel fee", error: error.message });
  }
};

// Delete Hostel Admission
export const deleteHostelAdmission = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ success: false, message: "Invalid student ID format" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    if (student.hostel !== "Yes") {
      return res.status(400).json({ success: false, message: "Student is not currently enrolled in hostel" });
    }

    student.hostel = "No";
    student.hostelDueAmount = 0;
    student.hostelAdmissionFee = 0;

    await student.save();

    res.status(200).json({
      success: true,
      message: "Hostel admission removed successfully",
      data: {
        studentId: student._id,
        hostel: student.hostel,
        hostelDueAmount: student.hostelDueAmount,
      },
    });
  } catch (error) {
    console.error("Error in deleteHostelAdmission:", error);
    res.status(500).json({ success: false, message: "Error removing hostel admission", error: error.message });
  }
};

// Promote students to the next class (Authenticated)
export const promoteStudents = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized: Admin access required" });
    }

    const { currentClass, academicSession } = req.body;

    if (!currentClass || !academicSession) {
      return res.status(400).json({ success: false, message: "Current class and academic session are required." });
    }

    const currentClassNum = parseInt(currentClass);
    if (isNaN(currentClassNum) || currentClassNum >= 12) {
      return res.status(400).json({ success: false, message: "Invalid class or no promotion possible." });
    }

    const nextClass = String(currentClassNum + 1);

    const updatedStudents = await Student.updateMany(
      { class: currentClass },
      { $set: { class: nextClass } }
    );

    res.status(200).json({
      success: true,
      message: `Promoted ${updatedStudents.modifiedCount} students from ${currentClass} to ${nextClass} for session ${academicSession}`,
      updatedCount: updatedStudents.modifiedCount,
    });
  } catch (error) {
    console.error("Error promoting students:", error);
    res.status(500).json({ success: false, message: "Server error: " + error.message });
  }
};


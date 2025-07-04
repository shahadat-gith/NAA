import { teacherModel } from "../models/teacher.js";
import bcrypt from "bcrypt";
import transporter from "../config/nodemailer.js";
import validator from "validator";
import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

export const addTeacher = async (req, res) => {
  try {
    const { name, email, contact, degree, experience, salary, dueBalance, subjectClassMappings } = req.body;


    // Validate required fields
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Teacher image is required!" });
    }
    if (!name || !email || !contact || !degree || !experience || !salary || !subjectClassMappings) {
      return res.status(400).json({ success: false, message: "All fields are mandatory!" });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format!" });
    }

    // Validate contact number
    if (!validator.isMobilePhone(contact, "any", { strictMode: false })) {
      return res.status(400).json({ success: false, message: "Invalid contact number!" });
    }

    // Validate experience (must be a non-negative integer)
    const experienceNum = Number(experience);
    if (isNaN(experienceNum) || experienceNum < 0 || !Number.isInteger(experienceNum)) {
      return res.status(400).json({ success: false, message: "Experience must be a non-negative whole number!" });
    }

    // Validate subjectClassMappings
    let parsedMappings;
    try {
      parsedMappings = JSON.parse(subjectClassMappings);
      if (!Array.isArray(parsedMappings) || parsedMappings.length === 0) {
        return res.status(400).json({ success: false, message: "Subject-class mappings must be a non-empty array!" });
      }
      for (const mapping of parsedMappings) {
        if (!mapping.subject || !Array.isArray(mapping.classes) || mapping.classes.length === 0) {
          return res.status(400).json({ success: false, message: "Each subject-class mapping must have a subject and at least one class!" });
        }
      }
    } catch (error) {
      return res.status(400).json({ success: false, message: "Invalid subject-class mappings format!" });
    }

    // Check for existing teacher
    const existingTeacher = await teacherModel.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ success: false, message: "A teacher with this email already exists!" });
    }

    // Upload image to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "teachers",
          public_id: `teacher_${Date.now()}`,
          resource_type: 'image'
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return reject(new Error("Failed to upload image to Cloudinary"));
          }
          resolve(result);
        }
      );

      const bufferStream = new Readable();
      bufferStream.push(req.file.buffer);
      bufferStream.push(null);
      bufferStream.pipe(uploadStream);
    });


    // Generate default password
    const password = "123456";
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new teacher with Cloudinary image URL
    const newTeacher = new teacherModel({
      name,
      email,
      password: hashedPassword,
      contact,
      degree,
      experience: experienceNum,
      salary: Number(salary),
      dueBalance: Number(dueBalance) || 0,
      subjectClassMappings: parsedMappings,
      image: result.secure_url, // Store Cloudinary URL
      imagePublicId: result.public_id, // Store Cloudinary public_id
      attendance: [],
      transactions: [],
      notifications: [],
    });

    // Save teacher to database
    await newTeacher.save();

    // Send welcome email
    try {
      await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Account Created at Nashib Ali Academy",
        text: `Congratulations! Your account has been created at Nashib Ali Academy.\n\nLogin Details:\nEmail: ${email}\nPassword: ${password}\n\nPlease change your password after logging in.\n\nWebsite link: ${process.env.CLIENT_URL}`,
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    return res.status(201).json({ success: true, message: "Teacher added successfully!" });
  } catch (error) {
    console.error("Error in addTeacher:", error);
    return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};

export const updateProfilePicture = async (req, res) => {
  try {
    const { teacherId } = req.body;
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Profile picture is required!" });
    }

    if (!teacherId) {
      return res.status(400).json({ success: false, message: "Teacher ID is required!" });
    }

    const teacher = await teacherModel.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found!" });
    }

    // Delete old image from Cloudinary if it exists
    if (teacher.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(teacher.imagePublicId);
      } catch (err) {
        console.error(`Failed to delete old image from Cloudinary: ${teacher.imagePublicId}`, err.message);
      }
    }

    // Upload new image to Cloudinary from buffer
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "teachers",
        public_id: `teacher_${Date.now()}`,
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          throw new Error("Failed to upload image to Cloudinary");
        }
        return result;
      }
    );

    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer);
    bufferStream.push(null);
    bufferStream.pipe(uploadStream);

    // Wait for the upload to complete
    const result = await new Promise((resolve, reject) => {
      uploadStream.on("finish", () => resolve(uploadStream));
      uploadStream.on("error", (err) => reject(err));
    });

    // Update teacher with new image URL and public_id
    teacher.image = result.secure_url;
    teacher.imagePublicId = result.public_id;
    await teacher.save();

    return res.status(200).json({ success: true, message: "Profile picture updated successfully!", teacher });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const deleteTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const teacher = await teacherModel.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found!" });
    }

    // Delete image from Cloudinary if it exists
    if (teacher.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(teacher.imagePublicId);
      } catch (err) {
        console.error(`Failed to delete image from Cloudinary: ${teacher.imagePublicId}`, err.message);
      }
    }

    await teacherModel.findByIdAndDelete(teacherId);

    return res.status(200).json({ success: true, message: "Teacher data deleted successfully!" });
  } catch (error) {
    console.error("Error in deleteTeacher:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await teacherModel.find().select('-password'); // Exclude password for security
    return res.status(200).json({ success: true, teachers });
  } catch (error) {
    console.error("Error in getAllTeachers:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getOneTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const teacher = await teacherModel.findById(teacherId).select('-password'); // Exclude password
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found!" });
    }
    return res.status(200).json({ success: true, teacher });
  } catch (error) {
    console.error("Error in getOneTeacher:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { teacherId, status, date } = req.body;

    const rawLat = req.body.latitude;
    const rawLng = req.body.longitude;
    const latitude = rawLat !== undefined ? parseFloat(rawLat) : null;
    const longitude = rawLng !== undefined ? parseFloat(rawLng) : null;

    const isAdmin = req.user.role === 'admin';
    const userTeacherId = req.user.id;

    const targetTeacherId = isAdmin && teacherId ? teacherId : userTeacherId;

    if (!targetTeacherId || !status) {
      return res.status(400).json({ success: false, message: "Teacher ID and status are required!" });
    }

    if (!['Present', 'Absent', 'Late'].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be Present, Absent, or Late!" });
    }

    const teacher = await teacherModel.findById(targetTeacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    if (!isAdmin && (status === 'Present' || status === 'Late')) {
      const SCHOOL_LAT = 26.14164;
      const SCHOOL_LNG = 91.05914;
      const MAX_RADIUS = 0.6; // 400 meters

      if (latitude === null || longitude === null || isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ success: false, message: "Valid latitude and longitude are required!" });
      }

      const haversine = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
          Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      };

      const distance = haversine(latitude, longitude, SCHOOL_LAT, SCHOOL_LNG);
      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);
      console.log(`Distance from school: ${distance.toFixed(3)} km`);

      if (distance > MAX_RADIUS) {
        return res.status(403).json({
          success: false,
          message: `Must be at school to mark Present or Late. Distance: ${distance.toFixed(3)} km`,
        });
      }
    }

    let targetDate;
    if (date) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate)) {
        return res.status(400).json({ success: false, message: "Invalid date format" });
      }
      targetDate = new Date(Date.UTC(parsedDate.getUTCFullYear(), parsedDate.getUTCMonth(), parsedDate.getUTCDate()));
    } else {
      const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      const localDate = new Date(now);
      targetDate = new Date(Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate()));
    }

    const tomorrow = new Date(targetDate);
    tomorrow.setUTCDate(targetDate.getUTCDate() + 1);

    const existingAttendance = teacher.attendance.find(record => {
      const recordDate = new Date(record.date);
      return recordDate >= targetDate && recordDate < tomorrow;
    });

    if (existingAttendance) {
      if (!isAdmin) {
        return res.status(400).json({ success: false, message: "Attendance already marked for this date" });
      }
      existingAttendance.status = status;
      existingAttendance.location = status !== 'Absent' && latitude && longitude
        ? { latitude, longitude }
        : existingAttendance.location;
      existingAttendance.markedBy = 'Admin';
      existingAttendance.markedAt = new Date();
    } else {
      teacher.attendance.push({
        date: targetDate,
        status,
        location: status !== 'Absent' && latitude && longitude ? { latitude, longitude } : null,
        markedBy: isAdmin ? 'Admin' : 'Teacher',
        markedAt: new Date(),
      });
    }

    await teacher.save();
    return res.status(200).json({
      success: true,
      message: `Attendance ${existingAttendance ? 'updated' : 'marked'} as ${status}`,
    });

  } catch (error) {
    console.error("Error in markAttendance:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


export const unmarkAttendance = async (req, res) => {
  try {
    const { teacherId, attendanceId } = req.body;
    const isAdmin = req.user.role === 'admin';
    const userTeacherId = req.user.id;

    const targetTeacherId = isAdmin && teacherId ? teacherId : userTeacherId;

    if (!targetTeacherId || !attendanceId) {
      return res.status(400).json({ success: false, message: "Teacher ID and attendance ID are required!" });
    }

    const teacher = await teacherModel.findById(targetTeacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    const attendanceRecord = teacher.attendance.id(attendanceId);
    if (!attendanceRecord) {
      return res.status(404).json({ success: false, message: "Attendance record not found" });
    }

    if (!isAdmin && attendanceRecord.markedBy === 'Admin') {
      return res.status(403).json({ success: false, message: "Only admins can unmark admin-marked attendance" });
    }

    teacher.attendance.pull(attendanceId);
    await teacher.save();

    return res.status(200).json({
      success: true,
      message: "Attendance unmarked successfully",
    });
  } catch (error) {
    console.error("Error in unmarkAttendance:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getAttendanceReport = async (req, res) => {
  try {
    const { teacherId, month, year } = req.body;
    const isAdmin = req.user.role === 'admin';
    const userTeacherId = req.user.id;

    const targetTeacherId = isAdmin && teacherId ? teacherId : userTeacherId;

    if (!targetTeacherId) {
      return res.status(400).json({ success: false, message: "Teacher ID is required!" });
    }

    const teacher = await teacherModel.findById(targetTeacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    let attendanceRecords = teacher.attendance;

    if (month !== undefined && year !== undefined) {
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 1);
      attendanceRecords = attendanceRecords.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= start && recordDate < end;
      });
    }

    const presentDays = attendanceRecords.filter(r => r.status === "Present").length;
    const absentDays = attendanceRecords.filter(r => r.status === "Absent").length;
    const lateDays = attendanceRecords.filter(r => r.status === "Late").length;

    const overallPresent = teacher.attendance.filter(r => r.status === "Present").length;
    const overallAbsent = teacher.attendance.filter(r => r.status === "Absent").length;
    const overallLate = teacher.attendance.filter(r => r.status === "Late").length;

    const attendanceReport = {
      presentDays: overallPresent,
      absentDays: overallAbsent,
      lateDays: overallLate,
      monthlyPresentDays: presentDays,
      monthlyAbsentDays: absentDays,
      monthlyLateDays: lateDays,
      attendance: attendanceRecords.map(record => ({
        _id: record._id,
        date: record.date.toISOString().split("T")[0],
        status: record.status,
        location: record.location,
        markedBy: record.markedBy,
        markedAt: record.markedAt,
      })),
    };

    return res.status(200).json({ success: true, attendanceReport });
  } catch (error) {
    console.error("Error in getAttendanceReport:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getAttendanceHistory = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const teacher = await teacherModel.findById(teacherId).select('-password');
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    const attendance = teacher.attendance
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 30);

    return res.status(200).json({ success: true, attendance });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllTransactions = async (req, res) => {
  const { teacherId } = req.body;
  if (!teacherId) {
    return res.json({ success: false, message: "Teacher Id not found" });
  }

  try {
    const teacher = await teacherModel.findById(teacherId).select('transactions');
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    const transactions = teacher.transactions;
    if (!transactions || transactions.length === 0) {
      return res.json({ success: false, message: "Transactions not available" });
    }

    return res.json({ success: true, data: transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.json({ success: false, message: error.message });
  }
};
export const recordTransaction = async (req, res) => {
  try {
    const { teacherId, amount, description, paymentMonth } = req.body;

    if (!teacherId || !amount || !description || !paymentMonth) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const teacher = await teacherModel.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    const newTransaction = {
      amount: Number(amount),
      description,
      paymentMonth,
      status: "Successful",
      acknowledged: false,
      createdAt: new Date(),
    };

    teacher.transactions.push(newTransaction);
    teacher.dueBalance = Math.max(0, teacher.dueBalance - Number(amount));

    // Add notification
    const monthName = new Date(`${paymentMonth}-01`).toLocaleString('default', { month: 'long' });

    const newNotification = {
      title: "Salary Credited",
      message: `Your salary for the month of ${monthName} has been credited. Amount: ₹${amount}.`,
      createdAt: new Date(),
    };

    teacher.notifications.push(newNotification);

    await teacher.save();

    const savedTransaction = teacher.transactions[teacher.transactions.length - 1];

    res.status(201).json({
      success: true,
      message: "Payment recorded successfully",
      transaction: savedTransaction,
    });
  } catch (error) {
    console.error("Error recording transaction:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const acknowledgeSalary = async (req, res) => {
  const { transactionId } = req.params;

  try {
    const teacher = await teacherModel.findOne({ "transactions._id": transactionId });
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    const transaction = teacher.transactions.id(transactionId);
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    if (teacher._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized to acknowledge this transaction" });
    }

    if (transaction.acknowledged) {
      return res.status(400).json({ success: false, message: "Transaction already acknowledged" });
    }

    transaction.acknowledged = true;
    transaction.acknowledgedOn = new Date();
    await teacher.save();

    return res.status(200).json({ success: true, message: "Transaction acknowledged successfully" });
  } catch (error) {
    console.error("Error acknowledging salary:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateBankDetails = async (req, res) => {
  try {
    const { bankName, accountNumber, ifscCode, accountHolderName } = req.body;
    const teacherId = req.user.id;

    if (!bankName || !accountNumber || !ifscCode || !accountHolderName) {
      return res.status(400).json({ success: false, message: "All bank details are required" });
    }

    if (!/^[A-Za-z]{4}[0-9]{7}$/.test(ifscCode)) {
      return res.status(400).json({ success: false, message: "Invalid IFSC code format (e.g., ABCD1234567)" });
    }

    const teacher = await teacherModel.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    teacher.bankName = bankName;
    teacher.accountNumber = accountNumber;
    teacher.ifscCode = ifscCode;
    teacher.accountHolderName = accountHolderName;

    await teacher.save();

    return res.status(200).json({ success: true, message: "Bank details updated successfully", teacher });
  } catch (error) {
    console.error("Error updating bank details:", error);
    return res.status(500).json({ success: false, message: "Server error: " + error.message });
  }
};


export const updateTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { name, email, contact, degree, experience, salary, dueBalance, subjectClassMappings } = req.body;

    // Validate inputs if provided
    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format!" });
    }
    if (contact && !validator.isMobilePhone(contact, "any", { strictMode: false })) {
      return res.status(400).json({ success: false, message: "Invalid contact number!" });
    }
    if (experience && (isNaN(experience) || experience < 0 || !Number.isInteger(Number(experience)))) {
      return res.status(400).json({ success: false, message: "Experience must be a non-negative whole number!" });
    }
    if (subjectClassMappings) {
      let parsedMappings;
      try {
        parsedMappings = JSON.parse(subjectClassMappings);
        if (!Array.isArray(parsedMappings)) {
          return res.status(400).json({ success: false, message: "Subject-class mappings must be an array!" });
        }
        for (const mapping of parsedMappings) {
          if (!mapping.subject || !Array.isArray(mapping.classes)) {
            return res.status(400).json({ success: false, message: "Each subject-class mapping must have a subject and classes array!" });
          }
        }
      } catch (error) {
        return res.status(400).json({ success: false, message: "Invalid subject-class mappings format!" });
      }
    }

    const updates = {
      ...(name && { name }),
      ...(email && { email }),
      ...(contact && { contact }),
      ...(degree && { degree }),
      ...(experience && { experience: Number(experience) }),
      ...(salary && { salary: Number(salary) }),
      ...(dueBalance !== undefined && { dueBalance: Number(dueBalance) }),
      ...(subjectClassMappings && { subjectClassMappings: parsedMappings }),
    };

    const teacher = await teacherModel.findByIdAndUpdate(teacherId, updates, { new: true, runValidators: true }).select('-password');
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    res.status(200).json({ success: true, teacher });
  } catch (error) {
    console.error("Error updating teacher:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


export const UpdateDueBalance = async (req, res) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7); // Format: 'YYYY-MM'
    const teachers = await teacherModel.find();

    const updatedTeachers = [];

    for (const teacher of teachers) {
      if (teacher.updateDueBalanceMonth === currentMonth) continue;

      teacher.dueBalance += teacher.salary;
      teacher.updateDueBalanceMonth = currentMonth;
      await teacher.save();

      updatedTeachers.push(teacher._id);
    }

    return res.status(200).json({
      message: "Due balances updated successfully for eligible teachers.",
      updatedCount: updatedTeachers.length,
    });
  } catch (error) {
    console.error("Update Due Balance Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
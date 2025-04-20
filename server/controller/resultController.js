import Student from "../models/StudentModel.js";
import XLSX from "xlsx";

export const uploadResult = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized: Admin access required" });
    }

    const { examName, academicSession, maxMarksPerSubject } = req.body;

    // Validate form inputs
    if (!examName || !academicSession || !maxMarksPerSubject) {
      return res.status(400).json({ success: false, message: "examName, academicSession, and maxMarksPerSubject are required." });
    }
    if (isNaN(maxMarksPerSubject) || maxMarksPerSubject <= 0) {
      return res.status(400).json({ success: false, message: "maxMarksPerSubject must be a positive number." });
    }
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    // Parse Excel file
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
      return res.status(400).json({ success: false, message: "Sheet not found in the Excel file." });
    }

    const jsonData = XLSX.utils.sheet_to_json(sheet);
    if (jsonData.length === 0) {
      return res.status(400).json({ success: false, message: "Excel file is empty." });
    }

    // Define columns to exclude from marks (case-insensitive)
    const excludedColumns = ["registrationno", "name"].map(col => col.toLowerCase());
    
    // Filter headers to include only subject columns (exclude registrationNo and name)
    const headers = Object.keys(jsonData[0]).filter(
      (key) => !excludedColumns.includes(key.toLowerCase())
    );

    const rejectedEntries = [];
    const validResultsByClass = {};

    // Process each row
    for (const row of jsonData) {
      const registrationNo = String(row.registrationNo || row.RegistrationNo || "").trim(); // Handle variations
      const studentName = String(row.name || row.Name || "").trim(); // Handle variations

      if (!registrationNo || !studentName) {
        rejectedEntries.push({ registrationNo, name: studentName, reason: "Missing registrationNo or name" });
        continue;
      }

      // Fetch student by registrationNo
      const student = await Student.findOne({ registrationNo });
      if (!student) {
        rejectedEntries.push({ registrationNo, name: studentName, reason: "Student not found in database" });
        continue;
      }

      // Calculate marks, using only subject columns (explicitly exclude registrationNo and name)
      let totalMarks = 0;
      const maxTotalMarks = headers.length * maxMarksPerSubject;
      const marks = {};
      headers.forEach((subject) => {
        const mark = isNaN(row[subject]) ? 0 : parseInt(row[subject], 10);
        if (mark < 0 || mark > maxMarksPerSubject) {
          rejectedEntries.push({
            registrationNo,
            name: studentName,
            reason: `Invalid mark ${mark} for ${subject} (must be 0-${maxMarksPerSubject})`
          });
          return;
        }
        marks[subject] = mark;
        totalMarks += mark;
      });

      if (Object.keys(marks).length === 0) {
        rejectedEntries.push({ registrationNo, name: studentName, reason: "No valid subject marks provided" });
        continue;
      }

      const percentage = maxTotalMarks > 0 ? (totalMarks / maxTotalMarks) * 100 : 0;

      const result = {
        examName: String(examName).trim().toLowerCase(),
        academicSession: String(academicSession).trim(),
        marks,
        totalMarks,
        maxTotalMarks,
        percentage: Number(percentage.toFixed(2)),
        maxMarksPerSubject: parseInt(maxMarksPerSubject, 10),
      };

      // Group results by class for roll number calculation
      const classKey = `${student.class}-${student.medium}${student.stream ? `-${student.stream}` : ""}`;
      if (!validResultsByClass[classKey]) {
        validResultsByClass[classKey] = [];
      }
      validResultsByClass[classKey].push({
        studentId: student._id,
        registrationNo,
        name: studentName,
        result,
        percentage,
      });

      // Update student with result (without rollNo yet)
      await Student.updateOne(
        { registrationNo },
        {
          $push: { results: result },
          $set: { firstName: studentName.split(" ")[0], lastName: studentName.split(" ").slice(1).join(" ") || "" }
        }
      );
    }

    // Calculate and assign roll numbers based on percentage within each class
    for (const classKey in validResultsByClass) {
      const studentsInClass = validResultsByClass[classKey];
      // Sort by percentage in descending order
      studentsInClass.sort((a, b) => b.percentage - a.percentage);

      // Assign roll numbers as simple integers starting from 1
      for (let i = 0; i < studentsInClass.length; i++) {
        const rollNo = String(i + 1); // e.g., "1", "2", "3", etc.
        await Student.updateOne(
          { _id: studentsInClass[i].studentId },
          { $set: { rollNo } }
        );
      }
    }

    const updatedCount = Object.values(validResultsByClass).reduce((sum, arr) => sum + arr.length, 0);

    res.status(200).json({
      success: true,
      message: updatedCount > 0 ? `Results uploaded successfully for ${updatedCount} students!` : "No valid results uploaded.",
      count: updatedCount,
      rejectedEntries: rejectedEntries.length > 0 ? rejectedEntries : undefined,
    });
  } catch (error) {
    console.error("Error uploading results:", error);
    res.status(500).json({ success: false, message: "Server error: " + error.message });
  }
};

export const uploadSingleResult = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized: Admin access required" });
    }

    const { studentName, registrationNo, maxMarksPerSubject, subjects, examName, academicSession } = req.body;

    if (!studentName || !registrationNo || !maxMarksPerSubject || !subjects || !examName || !academicSession) {
      return res.status(400).json({ success: false, message: "All required fields must be provided" });
    }

    if (!Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({ success: false, message: "At least one subject with marks is required" });
    }

    // Use registrationNo as provided (assumed to be "NAA-2512001A" format from student creation)
    const trimmedRegistrationNo = String(registrationNo).trim();

    const marksObject = {};
    let totalMarks = 0;

    for (const { subject, marks } of subjects) {
      if (!subject || marks === undefined) {
        return res.status(400).json({ success: false, message: "Subject name and marks are required for all entries" });
      }
      const markValue = parseFloat(marks);
      if (isNaN(markValue) || markValue < 0 || markValue > maxMarksPerSubject) {
        return res.status(400).json({
          success: false,
          message: `Marks for ${subject} must be between 0 and ${maxMarksPerSubject}`,
        });
      }
      marksObject[subject] = markValue;
      totalMarks += markValue;
    }

    const maxTotalMarks = maxMarksPerSubject * Object.keys(marksObject).length;
    const percentage = (totalMarks / maxTotalMarks) * 100;

    const resultData = {
      examName: String(examName).trim().toLowerCase(),
      academicSession: String(academicSession).trim(),
      marks: marksObject,
      totalMarks,
      maxTotalMarks,
      percentage: Number(percentage.toFixed(2)),
      maxMarksPerSubject: parseInt(maxMarksPerSubject, 10),
    };

    const student = await Student.findOneAndUpdate(
      { registrationNo: trimmedRegistrationNo },
      {
        $set: {
          firstName: studentName.split(" ")[0],
          lastName: studentName.split(" ").slice(1).join(" ") || "",
        },
        $push: { results: resultData },
      },
      { upsert: true, new: true }
    );

    // Re-rank roll numbers
    const classKey = `${student.class}-${student.medium}${student.stream ? `-${student.stream}` : ""}`;
    const studentsInClass = await Student.find({
      class: student.class,
      medium: student.medium,
      ...(student.stream && { stream: student.stream }),
      "results.examName": examName,
      "results.academicSession": academicSession,
    }).lean();

    const rankedStudents = studentsInClass.map((s) => {
      const result = s.results.find(
        (r) => r.examName === examName.trim().toLowerCase() && r.academicSession === academicSession.trim()
      );
      return { studentId: s._id, percentage: result ? result.percentage : 0 };
    });

    rankedStudents.sort((a, b) => b.percentage - a.percentage);

    let currentRollNo = 1;
    for (let i = 0; i < rankedStudents.length; i++) {
      if (i > 0 && rankedStudents[i].percentage === rankedStudents[i - 1].percentage) {
        await Student.updateOne(
          { _id: rankedStudents[i].studentId },
          { $set: { rollNo: String(currentRollNo - 1) } }
        );
      } else {
        await Student.updateOne(
          { _id: rankedStudents[i].studentId },
          { $set: { rollNo: String(currentRollNo) } }
        );
        currentRollNo++;
      }
    }

    res.status(201).json({ success: true, message: "Result uploaded successfully", data: student });
  } catch (error) {
    console.error("Error uploading single result:", error);
    res.status(500).json({ success: false, message: "Server error while uploading result", error: error.message });
  }
};

export const getSingleResult = async (req, res) => {
  try {
    const { registrationNo, examName, academicSession } = req.body;

    if (!registrationNo || !examName || !academicSession) {
      return res.status(400).json({
        success: false,
        message: "Registration number, exam name, and academic session are required",
      });
    }

    // Normalize registrationNo: "NAA-" prefix + uppercase suffix, no spaces
    const trimmedRegistrationNo = registrationNo.trim();
    const suffix = trimmedRegistrationNo.replace(/^NAA-?/i, "").replace(/\s+/g, "").toUpperCase();
    const normalizedRegistrationNo = "NAA-" + suffix;

    const query = {
      registrationNo: normalizedRegistrationNo,
      "results.examName": examName.trim().toLowerCase(),
      "results.academicSession": academicSession.trim(),
    };

    const student = await Student.findOne(query)
      .select("firstName lastName rollNo registrationNo class medium stream dueAmount results")
      .lean();

    if (!student) {
      return res.status(404).json({ success: false, message: "Student or result not found" });
    }

    // Optional: Enforce dueAmount check server-side
    if (student.dueAmount > 0) {
      return res.status(403).json({
        success: false,
        message: "Please clear your balanced monthly fee !.",
      });
    }

    const filteredResults = student.results.filter(
      (r) =>
        r.examName?.trim().toLowerCase() === examName.trim().toLowerCase() &&
        r.academicSession?.trim() === academicSession.trim()
    );

    if (filteredResults.length === 0) {
      return res.status(404).json({ success: false, message: "No matching result found for this exam and session" });
    }

    const result = filteredResults[0];
    const resultData = {
      firstName: student.firstName,
      lastName: student.lastName || "",
      rollNo: student.rollNo,
      registrationNo: student.registrationNo,
      class: student.class,
      medium: student.medium,
      stream: student.stream || undefined,
      dueAmount: student.dueAmount, // Add dueAmount to resultData
      result: {
        examName: result.examName,
        academicSession: result.academicSession,
        marks: result.marks,
        totalMarks: result.totalMarks,
        maxTotalMarks: result.maxTotalMarks,
        percentage: result.percentage,
        maxMarksPerSubject: result.maxMarksPerSubject,
      },
    };

    return res.status(200).json({ success: true, data: resultData });
  } catch (error) {
    console.error("Error in getSingleResult:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
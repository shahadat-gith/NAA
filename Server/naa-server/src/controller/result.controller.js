import XLSX from "xlsx";
import Result from "../models/Student/result.js";
import Student from "../models/Student/student.js";
import { authorityModel } from '../models/Academic/authorities.js';
import Exam from "../models/Settings/exam.js";
import ServiceSettings from "../models/Settings/services.js";

export const uploadResults = async (req, res) => {
  try {
    const { academicSession, examName, class: className, stream, medium, maxMarksPerSubject } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload an Excel file." });
    }

    // Read Excel
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (data.length === 0) {
      return res.status(400).json({ success: false, message: "Excel file is empty." });
    }

    // Process data
    let resultsData = data.map((row) => {

      const registrationNo = row.registrationNo;
      const name = row.name;

      // Convert canSee
      const canSee =
        row.canSee && String(row.canSee).toLowerCase() === "no"
          ? false
          : true;

      // Subjects = everything except registrationNo, name, canSee
      const marks = Object.keys(row)
        .filter(
          (key) =>
            !["registrationno", "name", "cansee"].includes(
              key.toLowerCase()
            )
        )
        .map((subject) => ({
          subject: subject,
          mark: Number(row[subject]) || 0,
        }));

      const totalObtained = marks.reduce((sum, m) => sum + m.mark, 0);

      return {
        registrationNo,
        name,
        canSee,
        marks,
        totalObtained,
        academicSession,
        examName,
        class: className,
        stream,
        medium,
        maxMarksPerSubject: Number(maxMarksPerSubject),
      };
    });

    // Ranking
    resultsData.sort((a, b) => b.totalObtained - a.totalObtained);

    resultsData = resultsData.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

    // Save
    const savedResults = await Result.create(resultsData);

    res.status(201).json({
      success: true,
      message: "Results uploaded and ranked successfully",
      count: savedResults.length,
    });

  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during upload",
      error: error.message,
    });
  }
};
export const getAllResults = async (req, res) => {
  try {
    const { academicSession, examName } = req.query;
    const filter = {};

    if (academicSession) filter.academicSession = academicSession;
    if (examName) filter.examName = examName;

    const results = await Result.find(filter);

    const resultsWithStudentInfo = await Promise.all(results.map(async (result) => {
      const student = await Student.findOne({ registrationNo: result.registrationNo }).select("name image fatherName motherName");
      return {
        ...result.toObject(),
        name: student ? student.name : "Unknown Student",
        image: student ? student.image : null,
        fatherName: student ? student.fatherName : "N/A",
        motherName: student ? student.motherName : "N/A",
      };
    }));

    res.status(200).json({
      success: true,
      message: "Results fetched successfully",
      data: resultsWithStudentInfo,
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ success: false, message: "Server error during fetch", error: error.message });
  }
};

export const getResultByRegistration = async (req, res) => {
  try {
    const { registrationNo } = req.params;
    const result = await Result.findOne({ registrationNo });

    if (!result) {
      return res.status(404).json({ success: false, message: "Result not found for the given registration number." });
    }

    // Fetch student details
    const student = await Student.findOne({ registrationNo }).select("name image fatherName motherName");

    res.status(200).json({
      success: true,
      message: "Result fetched successfully",
      data: {
        ...result.toObject(),
        name: student ? student.name : "Unknown Student",
        image: student ? student.image : null,
        fatherName: student ? student.fatherName : "N/A",
        motherName: student ? student.motherName : "N/A",
      },
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ success: false, message: "Server error during fetch", error: error.message });
  }
};


export const updateResult = async (req, res) => {
  try {
    const { registrationNo } = req.params;
    const updateData = req.body;
    const result = await Result.findOneAndUpdate({ registrationNo }, updateData, { new: true });

    if (!result) {
      return res.status(404).json({ success: false, message: "Result not found for the given registration number." });
    }

    res.status(200).json({
      success: true,
      message: "Result updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ success: false, message: "Server error during update", error: error.message });
  }
};

export const deleteResult = async (req, res) => {
  try {
    const { registrationNo } = req.params;
    const result = await Result.findOneAndDelete({ registrationNo });

    if (!result) {
      return res.status(404).json({ success: false, message: "Result not found for the given registration number." });
    }
    res.status(200).json({
      success: true,
      message: "Result deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ success: false, message: "Server error during delete", error: error.message });
  }
};



export const fetchResultForStudent = async (req, res) => {
  try {
    const { registrationNo } = req.body;

    if (!registrationNo) {
      return res.status(400).json({
        success: false,
        message: "Registration number is required."
      });
    }

    const [exam, serviceSettings] = await Promise.all([
      Exam.findOne({}).lean(),
      ServiceSettings.findOne({}).lean()
    ]);

    /* ===== RESULT SERVICE CHECK ===== */

    if (serviceSettings && !serviceSettings.result) {
      return res.status(403).json({
        success: false,
        message:
          "Result service is currently unavailable. Please contact the administration."
      });
    }

    /* ===== EXAM CHECK ===== */

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "No active exam found."
      });
    }

    /* ===== FIND RESULT ===== */

    const result = await Result.findOne({
      registrationNo,
      examName: exam.examName,
      academicSession: exam.academicSession
    }).lean();

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found for the given registration number."
      });
    }

    /* ===== FETCH STUDENT + PRINCIPAL ===== */

    const [student, principal] = await Promise.all([
      Student.findOne({ registrationNo })
        .select("name image fatherName motherName")
        .lean(),

      authorityModel
        .findOne({ role: "Principal" })
        .select("name signature")
        .lean()
    ]);

    /* ===== RESPONSE ===== */

    return res.status(200).json({
      success: true,
      result: {
        ...result,
        name: student?.name || "Unknown Student",
        image: student?.image || null,
        fatherName: student?.fatherName || "N/A",
        motherName: student?.motherName || "N/A"
      },
      principal
    });

  } catch (error) {
    console.error("Fetch Result Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during result fetch.",
      error: error.message
    });
  }
};
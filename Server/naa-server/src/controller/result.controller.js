import XLSX from "xlsx";
import Result from "../models/Student/result.js";
import Student from "../models/Student/student.js";
import { authorityModel } from '../models/Academic/authorities.js';
import Exam from "../models/Settings/exam.js";
import ServiceSettings from "../models/Settings/services.js";

export const uploadResults = async (req, res) => {
  try {
    const {
      academicSession,
      examName,
      class: className,
      stream = "",
      medium,
      maxMarksPerSubject,
    } = req.body;

    // ✅ Validation
    if (!academicSession || !examName || !className || !medium || !maxMarksPerSubject) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an Excel file",
      });
    }

    // ✅ Read Excel
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!data.length) {
      return res.status(400).json({
        success: false,
        message: "Excel file is empty",
      });
    }

    // ✅ Convert Excel → JSON
    let resultsData = data.map((row, index) => {
      const registrationNo = row.registrationNo || row.registrationno;

      if (!registrationNo) {
        throw new Error(`Missing registrationNo at row ${index + 2}`);
      }

      const canSee =
        row.canSee && String(row.canSee).toLowerCase() === "no"
          ? false
          : true;

      // Extract subjects dynamically
      const marks = Object.keys(row)
        .filter(
          (key) =>
            !["registrationno", "name", "cansee"].includes(
              key.toLowerCase()
            )
        )
        .map((subject) => ({
          subject,
          mark: Number(row[subject]) || 0,
        }));

      // ✅ IMPORTANT: Calculate total for ranking
      const totalMarks = marks.reduce((sum, m) => sum + m.mark, 0);

      return {
        registrationNo,
        marks,
        totalMarks, // used ONLY for ranking
        canSee,
        academicSession,
        examName,
        class: className,
        stream,
        medium,
        maxMarksPerSubject: Number(maxMarksPerSubject),
      };
    });

    // ✅ GROUPING (class + stream + medium)
    const groupedResults = {};

    resultsData.forEach((student) => {
      const key = `${student.class}-${student.stream || "NA"}-${student.medium}`;

      if (!groupedResults[key]) {
        groupedResults[key] = [];
      }

      groupedResults[key].push(student);
    });

    // ✅ RANKING WITH TIES
    let finalResults = [];

    Object.values(groupedResults).forEach((group) => {
      // Sort by totalMarks DESC
      group.sort((a, b) => b.totalMarks - a.totalMarks);

      let currentRank = 1;
      let prevMarks = null;

      group.forEach((student, index) => {
        if (prevMarks !== null && student.totalMarks < prevMarks) {
          currentRank = index + 1;
        }

        student.rank = currentRank;
        prevMarks = student.totalMarks;
      });

      finalResults.push(...group);
    });

    // ✅ Remove temp totalMarks (schema will recalc)
    finalResults = finalResults.map(({ totalMarks, ...rest }) => rest);

    // ✅ SAVE (Triggers pre-save hook ✅)
    const savedResults = await Result.create(finalResults);

    return res.status(201).json({
      success: true,
      message: "Results uploaded, ranked, and calculated successfully",
      count: savedResults.length,
    });
  } catch (error) {
    console.error("Upload Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server error during upload",
    });
  }
};


export const getAllResults = async (req, res) => {
  try {
    const results = await Result.aggregate([

      {
        $lookup: {
          from: "students",
          localField: "registrationNo",
          foreignField: "registrationNo",
          as: "student"
        }
      },

      {
        $unwind: {
          path: "$student",
          preserveNullAndEmptyArrays: true
        }
      },

      {
        $addFields: {
          name: { $ifNull: ["$student.name", "Unknown Student"] },
          image: "$student.image",
          fatherName: { $ifNull: ["$student.fatherName", "N/A"] },
          motherName: { $ifNull: ["$student.motherName", "N/A"] }
        }
      }

    ]);

    res.status(200).json({
      success: true,
      message: "All results fetched successfully",
      data: results,
    });

  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during fetch",
      error: error.message
    });
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
    const { resultId } = req.params;
    const updateData = req.body;
    const result = await Result.findOneAndUpdate({ _id: resultId }, updateData, { new: true });

    if (!result) {
      return res.status(404).json({ success: false, message: "Result not found for the given ID." });
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

    const result = await Result.findOne({ registrationNo }).lean();

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


export const getAllClassToppers = async (req, res) => {
  try {
    const examName = "Annual Examination";
    const { academicSession = "2025-2026" } = req.query;

    /* ================= CLASS TOPPERS ================= */
    const classToppers = await Result.aggregate([
      {
        $match: {
          academicSession,
          examName,
          rank: 1
        }
      },
      {
        $lookup: {
          from: "students",
          localField: "registrationNo",
          foreignField: "registrationNo",
          as: "student"
        }
      },
      {
        $unwind: {
          path: "$student",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 0,
          session: "$academicSession",
          medium: 1,
          class: 1,
          stream: 1,
          name: "$student.name",
          image: "$student.image",
          percentage: 1,
          rank: 1
        }
      },
      {
        $sort: { class: 1 }
      }
    ]);

    /* ================= SCHOOL TOPPERS ================= */

    // 🔥 Step 1: Get top 3 distinct percentages
    const top3Percentages = (
      await Result.distinct("percentage", {
        academicSession,
        examName
      })
    )
      .sort((a, b) => b - a)
      .slice(0, 3);

    // 🔥 Step 2: Get all students in those percentage groups
    const schoolToppersRaw = await Result.find({
      academicSession,
      examName,
      percentage: { $in: top3Percentages }
    })
      .sort({ percentage: -1 })
      .lean();

    // 🔥 Step 3: Fetch student details
    const regNos = schoolToppersRaw.map(r => r.registrationNo);

    const students = await Student.find({
      registrationNo: { $in: regNos }
    }).lean();

    const studentMap = {};
    students.forEach(s => {
      studentMap[s.registrationNo] = s;
    });

    // 🔥 Step 4: Format final school toppers
    const schoolToppersFlat = schoolToppersRaw.map(r => ({
      session: r.academicSession,
      class: r.class,
      stream: r.stream,
      medium: r.medium,
      percentage: r.percentage,
      rank: r.rank,
      name: studentMap[r.registrationNo]?.name || "N/A",
      image: studentMap[r.registrationNo]?.image || ""
    }));

    // 🔥 Step 5 (Optional but recommended): Group by percentage
    const schoolToppers = top3Percentages.map(p => ({
      percentage: p,
      students: schoolToppersFlat.filter(s => s.percentage === p)
    }));

    /* ================= RESPONSE ================= */

    res.status(200).json({
      success: true,
      toppers: classToppers,
      schoolToppers
    });

  } catch (error) {
    console.error("Fetch Toppers Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during toppers fetch.",
      error: error.message
    });
  }
};
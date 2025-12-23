import Student from "../models/Student/student.js";
import Result from "../models/Student/result.js";
import FeesSettings from "../models/Settings/fees.js";

export const normalizeKey = (key) =>
  key
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")     // remove spaces
    .replace(/_/g, "")       // remove underscores
    .replace(/-/g, "");      // remove hyphens



export const processResultRow = async ({
  rawRow,
  rowNum,
  academicSession,
  examName,
  resultClass,
  maxMarksPerSubject,
}) => {
  /* ============================
     NORMALIZE ROW
  ============================ */
  const row = {};
  Object.keys(rawRow).forEach((key) => {
    row[normalizeKey(key)] = rawRow[key];
  });

  /* ============================
     REGISTRATION NO
  ============================ */
  const registrationNo = row.registrationno?.toString().trim();
  if (!registrationNo) {
    return {
      ok: false,
      registrationNo: "",
      reason: "Registration number missing",
    };
  }

  /* ============================
     STUDENT EXISTS
  ============================ */
  const studentExists = await Student.findOne({ registrationNo });
  if (!studentExists) {
    return {
      ok: false,
      registrationNo,
      reason: "Student not found in database",
    };
  }

  /* ============================
     DUPLICATE RESULT
  ============================ */
  const duplicate = await Result.findOne({
    registrationNo,
    academicSession,
    examName,
    class: resultClass,
  });

  if (duplicate) {
    return {
      ok: false,
      registrationNo,
      reason: "Result already exists for this exam",
    };
  }

  /* ============================
     DUE CLEARED
  ============================ */
  const dueValue = row.duecleared?.toString().trim().toLowerCase();

  if (!["yes", "y", "no", "n", "true", "false"].includes(dueValue)) {
    return {
      ok: false,
      registrationNo,
      reason: "Invalid Due Cleared value (use Yes/No)",
    };
  }

  const isDueCleared = ["yes", "y", "true"].includes(dueValue);

  /* ============================
     MARKS PROCESSING
  ============================ */
  const ignoreKeys = [
    "registrationno",
    "name",
    "total",
    "rank",
    "duecleared",
    "__rownumber",
  ];

  const marks = [];

  for (const key of Object.keys(row)) {
    if (ignoreKeys.includes(key)) continue;

    const val = row[key];
    if (val === "" || val === null || val === undefined) continue;

    const numericMark = Number(val);
    if (isNaN(numericMark)) {
      return {
        ok: false,
        registrationNo,
        reason: `Non-numeric mark in column: ${key}`,
      };
    }

    if (numericMark > Number(maxMarksPerSubject)) {
      return {
        ok: false,
        registrationNo,
        reason: `Mark in '${key}' (${numericMark}) exceeds Max Marks (${maxMarksPerSubject})`,
      };
    }

    marks.push({
      subject: key,
      marksObtained: numericMark,
    });
  }

  if (marks.length === 0) {
    return {
      ok: false,
      registrationNo,
      reason: "No subject marks found",
    };
  }

  /* ============================
     SUCCESS
  ============================ */
  return {
    ok: true,
    data: {
      registrationNo,
      marks,
      isDueCleared,
    },
  };
};




export const validateAndPrepareResult = async ({
  registrationNo,
  academicSession,
  examName,
  resultClass,
  marks,
  maxMarksPerSubject,
}) => {
  /* ============================
     REQUIRED FIELDS
  ============================ */
  if (
    !registrationNo ||
    !academicSession ||
    !resultClass ||
    !examName ||
    !marks?.length ||
    !maxMarksPerSubject
  ) {
    return {
      ok: false,
      reason: "All required fields must be provided",
    };
  }

  /* ============================
     STUDENT EXISTS
  ============================ */
  const studentExists = await Student.exists({ registrationNo });
  if (!studentExists) {
    return {
      ok: false,
      reason: "Student not found",
    };
  }

  /* ============================
     DUPLICATE RESULT
  ============================ */
  const existing = await Result.findOne({
    registrationNo,
    academicSession,
    examName,
    class: resultClass,
  });

  if (existing) {
    return {
      ok: false,
      reason: "Result already exists for this exam",
    };
  }

  /* ============================
     MARKS VALIDATION
  ============================ */
  for (const m of marks) {
    const value = Number(m.marksObtained);

    if (isNaN(value)) {
      return {
        ok: false,
        reason: `Invalid marks for subject: ${m.subject}`,
      };
    }

    if (value > Number(maxMarksPerSubject)) {
      return {
        ok: false,
        reason: `Marks cannot exceed max marks (${maxMarksPerSubject})`,
      };
    }
  }

  /* ============================
     SUCCESS
  ============================ */
  return {
    ok: true,
    data: {
      registrationNo,
      academicSession,
      examName,
      resultClass,
      marks,
      maxMarksPerSubject: Number(maxMarksPerSubject),
    },
  };
};


export const calculateClassRanks = async ({ academicSession, examName, resultClass }) => {
  try {
    // 1. Fetch relevant results
    const results = await Result.find({
      academicSession,
      examName,
      class: resultClass,
    });

    if (!results || results.length === 0) return;

    // 2. Map results with their calculated totals
    const resultsWithTotals = results.map((res) => {
      const totalMarks = res.marks.reduce(
        (sum, m) => sum + Number(m.marksObtained || 0), 
        0
      );
      return {
        _id: res._id,
        totalMarks,
      };
    });

    // 3. Sort by total marks Descending
    resultsWithTotals.sort((a, b) => b.totalMarks - a.totalMarks);

    // 4. Prepare Bulk Operations
    const bulkOps = [];
    let currentRank = 0;
    let lastTotal = null;

    resultsWithTotals.forEach((res, index) => {
      // Logic for handling ties (e.g., two students with 450 marks both get Rank 1)
      if (lastTotal === null || res.totalMarks < lastTotal) {
        currentRank = index + 1;
      }
      
      bulkOps.push({
        updateOne: {
          filter: { _id: res._id },
          update: { $set: { rank: currentRank } },
        },
      });

      lastTotal = res.totalMarks;
    });

    // 5. Execute all updates in ONE database call
    if (bulkOps.length > 0) {
      await Result.bulkWrite(bulkOps);
    }
  } catch (error) {
    console.error("Error calculating class ranks:", error);
    throw error;
  }
};



export const generateRegistrationNo = async () => {
  let regNo;
  let exists = true;

  while (exists) {
    regNo = `NAA-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    exists = await Student.exists({ registrationNo: regNo });
  }

  return regNo;
};



export const getAmountForClass = async (
  studentClass,
  medium,
  type,              // "monthlyFee" | "admissionFee"
  stream = null
) => {
  try {

    const feesSettings = await FeesSettings.findOne().lean();
    if (!feesSettings) {
      throw new Error("Fees settings not found");
    }

    const { classFees } = feesSettings;

    /* ---------- VALIDATE MEDIUM ---------- */
    if (!classFees[medium]) {
      throw new Error("Invalid medium");
    }

    let feeDetail;

    /* ---------- HANDLE HIGHER SECONDARY ---------- */
    if (studentClass === "11" || studentClass === "12") {
      if (!stream) {
        throw new Error("Stream is required for class 11 and 12");
      }

      feeDetail = classFees[medium]?.[studentClass]?.[stream];

      if (!feeDetail) {
        throw new Error("Invalid class or stream for higher secondary");
      }
    }
    /* ---------- NORMAL CLASSES ---------- */
    else {
      feeDetail = classFees[medium]?.[studentClass];

      if (!feeDetail) {
        throw new Error("Invalid class for selected medium");
      }
    }

    /* ---------- VALIDATE FEE TYPE ---------- */
    if (!["monthlyFee", "admissionFee"].includes(type)) {
      throw new Error("Invalid fee type");
    }

    return feeDetail[type] || 0;
  } catch (error) {
    throw error;
  }
};




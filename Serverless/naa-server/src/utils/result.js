import Student from "../models/Student/student.js";
import Result from "../models/Student/result.js";


export const normalizeKey = (key = "") =>
  key.toString().toLowerCase().replace(/[^a-z0-9]/g, "");

export const RESULT_FIELD_MAP = {
  registrationno: "registrationNo",
  registrationnumber: "registrationNo",
  regno: "registrationNo",

  cansee: "canSee",
  canview: "canSee",
  visible: "canSee",

  name: "name", // ignored but allowed
};

export const normalizeExcelRow = (rawRow = {}) => {
  const normalized = {};

  for (const key in rawRow) {
    const cleanKey = normalizeKey(key);
    const mappedKey = RESULT_FIELD_MAP[cleanKey] || cleanKey;
    normalized[mappedKey] = rawRow[key];
  }

  return normalized;
};


export const parseCanSee = (value) => {
  if (value === undefined || value === null || value === "") return true;

  const v = value.toString().trim().toLowerCase();
  return !["no", "n", "0", "false"].includes(v);
};



export const processResultRow = async ({
  rawRow,
  academicSession,
  examName,
  resultClass,
  medium,
  stream,
  maxMarksPerSubject,
}) => {
  const row = normalizeExcelRow(rawRow);

  /* ---------- Registration No ---------- */
  const registrationNo = row.registrationNo?.toString().trim();
  if (!registrationNo) {
    return {
      success: false,
      registrationNo: "",
      reason: "Registration number missing",
    };
  }

  /* ---------- Student Exists ---------- */
  const studentExists = await Student.exists({
    registrationNo,
    class: resultClass,
    medium,
    ...(stream ? { stream } : {}),
  });

  if (!studentExists) {
    return {
      success: false,
      registrationNo,
      reason: "Student not found for given class/medium/stream",
    };
  }

  /* ---------- Duplicate Result ---------- */
  const duplicate = await Result.exists({
    registrationNo,
    academicSession,
    examName,
    class: resultClass,
    medium,
    ...(stream ? { stream } : {}),
  });

  if (duplicate) {
    return {
      success: false,
      registrationNo,
      reason: "Result already exists for this exam",
    };
  }

  /* ---------- Marks Processing ---------- */
  const IGNORE_KEYS = [
    "registrationNo",
    "name",
    "canSee",
    "__rownumber",
    "rank",
    "total",
  ];

  const marks = [];

  for (const key in row) {
    if (IGNORE_KEYS.includes(key)) continue;

    const value = row[key];
    if (value === "" || value === null || value === undefined) continue;

    const numericMark = Number(value);
    if (Number.isNaN(numericMark)) {
      return {
        success: false,
        registrationNo,
        reason: `Invalid mark in subject column: ${key}`,
      };
    }

    if (numericMark > Number(maxMarksPerSubject)) {
      return {
        success: false,
        registrationNo,
        reason: `Marks in '${key}' exceed max marks (${maxMarksPerSubject})`,
      };
    }

    marks.push({
      subject: key,
      mark: numericMark,
    });
  }

  if (!marks.length) {
    return {
      success: false,
      registrationNo,
      reason: "No subject marks found",
    };
  }

  /* ---------- SUCCESS ---------- */
  return {
    success: true,
    data: {
      registrationNo,
      marks,
      canSee: parseCanSee(row.canSee),
    },
  };
};



export const validateAndPrepareResult = async ({
  registrationNo,
  academicSession,
  examName,
  resultClass,
  medium,
  stream,
  marks,
  maxMarksPerSubject,
}) => {
  if (
    !registrationNo ||
    !academicSession ||
    !examName ||
    !resultClass ||
    !medium ||
    !marks?.length ||
    !maxMarksPerSubject
  ) {
    return {
      success: false,
      reason: "All required fields must be provided",
    };
  }

  const studentExists = await Student.exists({
    registrationNo,
    class: resultClass,
    medium,
    ...(stream ? { stream } : {}),
  });

  if (!studentExists) {
    return {
      success: false,
      reason: "Student not found for given class/medium/stream",
    };
  }

  const duplicate = await Result.exists({
    registrationNo,
    academicSession,
    examName,
    class: resultClass,
    medium,
    ...(stream ? { stream } : {}),
  });

  if (duplicate) {
    return {
      success: false,
      reason: "Result already exists for this exam",
    };
  }

  for (const m of marks) {
    const val = Number(m.mark);
    if (Number.isNaN(val)) {
      return {
        success: false,
        reason: `Invalid marks for subject: ${m.subject}`,
      };
    }

    if (val > Number(maxMarksPerSubject)) {
      return {
        success: false,
        reason: `Marks exceed max marks (${maxMarksPerSubject})`,
      };
    }
  }

  return {
    success: true,
    data: {
      registrationNo,
      academicSession,
      examName,
      class: resultClass,
      medium,
      stream,
      marks,
      maxMarksPerSubject: Number(maxMarksPerSubject),
    },
  };
};


export const calculateClassRanks = async ({
  academicSession,
  examName,
  resultClass,
  medium,
  stream,
}) => {
  const filter = {
    academicSession,
    examName,
    class: resultClass,
    medium,
    ...(stream ? { stream } : {}),
  };

  const results = await Result.find(filter);
  if (!results.length) return;

  const ranked = results
    .map((r) => ({
      _id: r._id,
      total: r.marks.reduce(
        (sum, m) => sum + Number(m.mark || 0),
        0
      ),
    }))
    .sort((a, b) => b.total - a.total);

  let rank = 0;
  let lastTotal = null;
  const ops = [];

  ranked.forEach((r, index) => {
    if (lastTotal === null || r.total < lastTotal) {
      rank = index + 1;
    }
    lastTotal = r.total;

    ops.push({
      updateOne: {
        filter: { _id: r._id },
        update: { $set: { rank } },
      },
    });
  });

  if (ops.length) {
    await Result.bulkWrite(ops);
  }
};

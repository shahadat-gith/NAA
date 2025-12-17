import Student from "../models/Student/student.js";


export const processResultRow = async ({row,maxMarksPerSubject,}) => {
  const registrationNo = row.registrationNo;

  // Registration number check
  if (!registrationNo) {
    return {
      success: false,
      reason: "Registration number missing",
    };
  }

  // Student existence check
  const studentExists = await Student.findOne({ registrationNo });
  if (!studentExists) {
    return {
      success: false,
      reason: "Student not found",
    };
  }

  const marks = [];

  for (const [key, value] of Object.entries(row)) {
    if (["registrationNo", "__rowNumber"].includes(key)) continue;
    if (value === "") continue;

    if (isNaN(value)) {
      return {
        success: false,
        reason: "Non-numeric marks found",
      };
    }

    if (Number(value) > Number(maxMarksPerSubject)) {
      return {
        success: false,
        reason: "Marks exceed max marks",
      };
    }

    marks.push({
      subject: key,
      marksObtained: Number(value),
    });
  }

  if (!marks.length) {
    return {
      success: false,
      reason: "No valid marks found",
    };
  }

  return {
    success: true,
    marks,
  };
};

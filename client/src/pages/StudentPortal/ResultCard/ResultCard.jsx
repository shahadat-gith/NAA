import React from "react";
import "./ResultCard.css"; // Adjust path if needed
import { calculateGrade } from "../utils/generateResultPDF";

const ResultCard = ({ resultData, handleDownloadPDF }) => {
  const {
    firstName,
    lastName,
    rollNo,
    registrationNo,
    class: className,
    medium,
    stream,
    result,
  } = resultData; // Destructure top-level fields

  const {
    marks,
    totalMarks,
    maxTotalMarks,
    percentage,
    maxMarksPerSubject,
    examName,
    academicSession,
  } = result; // Destructure nested result object

  const fullName = `${firstName} ${lastName || ""}`.trim(); // Combine firstName and lastName

  return (
    <div className="result-container">
      <div className="result-card">
        {/* Header */}
        <div className="school-header">
          <h2 className="school-name">Nashib Ali Academy</h2>
          <p className="exam-name">
            {examName
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(" ")}{" "}
            {academicSession}
          </p>
          <p className="report-card">Report Card</p>
          <div className="header-line"></div>
        </div>

        {/* Student Details */}
        <div className="student-details-card">
          <h3 className="result-title">Student Information</h3>
          <table className="student-table">
            <tbody>
              <tr>
                <th>Name</th>
                <td>
                  {fullName
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(" ")}
                </td>
              </tr>
              <tr>
                <th>Registration Number</th>
                <td>{registrationNo}</td>
              </tr>
              <tr>
                <th>Roll Number</th>
                <td>{rollNo || "N/A"}</td>
              </tr>
              <tr>
                <th>Class</th>
                <td>{className}</td>
              </tr>
              <tr>
                <th>Medium</th>
                <td>{medium}</td>
              </tr>
              {parseInt(className) > 10 && stream && (
                <tr>
                  <th>Stream</th>
                  <td>{stream}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Marks Details */}
        <div className="marks-details">
          <h4 className="marks-title">Subject-wise Performance</h4>
          <div className="marks-table-container">
            <table className="marks-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Marks Obtained</th>
                  <th>Max Marks</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(marks).map(([subject, mark]) => {
                  const grade = calculateGrade(mark);
                  return (
                    <tr key={subject}>
                      <td className="subject-title">{subject}</td>
                      <td>{mark}</td>
                      <td>{maxMarksPerSubject}</td>
                      <td>{grade}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="summary-card">
            <table className="summary-table">
              <tbody>
                <tr>
                  <th>Total Marks</th>
                  <td>
                    {totalMarks} / {maxTotalMarks}
                  </td>
                </tr>
                <tr>
                  <th>Percentage</th>
                  <td>{percentage}%</td>
                </tr>
                <tr>
                  <th>Result</th>
                  <td className={percentage >= 40 ? "pass" : "fail"}>
                    {percentage >= 40 ? "PASS" : "FAIL"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Download Button */}
          <button className="download-btn" onClick={handleDownloadPDF}>
            Download as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../Styles/ResultDownload.css";
import { generateResultPDF } from "./generateResultPDF";

const ResultDownload = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const resultData = state?.resultData;
  const principal = state?.principal;

  /* ================= SAFETY CHECK ================= */
  if (!resultData) {
    return (
      <div className="report-card-page">
        <p>No result data found. Please go back and try again.</p>
        <button onClick={() => navigate("/result")}>
          Back to Result Portal
        </button>
      </div>
    );
  }

  const student = resultData.studentDetails || {};

  /* ================= HANDLERS ================= */
  const handleDownload = () => {
    generateResultPDF(resultData, principal);
  };

  return (
    <div className="report-card-page">
      {/* ================= HEADER ================= */}
      <div className="report-header">
        <h2>Student Report Card</h2>
        <h3>Nashib Ali Academy</h3>
        <p>
          {resultData.examName} — {resultData.academicSession}
        </p>
      </div>

      {/* ================= STUDENT INFO ================= */}
      <div className="student-info">
        <div className="info-item">
          <span className="info-label">Student Name</span>
          <span className="info-value">{student.name || "N/A"}</span>
        </div>

        <div className="info-item">
          <span className="info-label">Registration No</span>
          <span className="info-value">{resultData.registrationNo}</span>
        </div>

        <div className="info-item">
          <span className="info-label">Father's Name</span>
          <span className="info-value">{student.fatherName || "N/A"}</span>
        </div>

        <div className="info-item">
          <span className="info-label">Mother's Name</span>
          <span className="info-value">{student.motherName || "N/A"}</span>
        </div>

        <div className="info-item">
          <span className="info-label">Class</span>
          <span className="info-value">{resultData.class}</span>
        </div>

        <div className="info-item">
          <span className="info-label">Medium</span>
          <span className="info-value" style={{ textTransform: "capitalize" }}>
            {resultData.medium}
          </span>
        </div>

        {resultData.stream && (
          <div className="info-item">
            <span className="info-label">Stream</span>
            <span className="info-value" style={{ textTransform: "capitalize" }}>
              {resultData.stream}
            </span>
          </div>
        )}

        <div className="info-item">
          <span className="info-label">Rank in Class</span>
          <span className="info-value">{resultData.rank || "N/A"}</span>
        </div>
      </div>

      {/* ================= PERFORMANCE SUMMARY ================= */}
      <div className="marks-section">
        <div className="marks-header">
          <h3 className="marks-title">Performance Summary</h3>

          <div className="performance-res">
            <span className="total-marks">
              Total: {resultData.totalMarks}
            </span>

            <span className="percentage-badge">
              {resultData.percentage}%
            </span>

            <span className="grade-badge">
              Grade: {resultData.grade}
            </span>
          </div>
        </div>

        {/* ================= SUBJECT TABLE ================= */}
        <table className="subjects-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Marks</th>
            </tr>
          </thead>
          <tbody>
            {resultData.marks.map((m, index) => (
              <tr key={index}>
                <td>{m.subject.toUpperCase()}</td>
                <td>
                  <span className="mark-value">{m.mark}</span>
                  <span className="mark-total">
                    /{resultData.maxMarksPerSubject}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="actions-container">
        <button
          className="res-download-btn"
          onClick={handleDownload}
          style={{ cursor: "pointer" }}
        >
          Download PDF Report
        </button>
      </div>
    </div>
  );
};

export default ResultDownload;

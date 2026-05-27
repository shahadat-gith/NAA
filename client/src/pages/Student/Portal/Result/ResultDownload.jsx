import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import "./ResultDownload.css";
import ResultReportPdf from "./resultPdf";
import logo from "/logo.png";
import userImg from "/user.png";

const capitalizeWords = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const ResultDownload = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const result = state?.result;
  const principal = state?.principal;

  // SAFE calculation
  const MAX_MARKS_SUM =
    (result?.marks?.length || 0) * (result?.maxMarksPerSubject || 0);

  if (!result) {
    return (
      <div className="rep-page">
        <div className="rep-empty-state">
          <p>No result data found.</p>
          <button onClick={() => navigate("/result")} className="rep-fallback-btn">
            Back to Result Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rep-page">
      {/* ================= ACTIONS BAR ================= */}
      <div className="rep-actions-container">
        <PDFDownloadLink
          document={<ResultReportPdf result={result} principal={principal} />}
          fileName={`Result-${result.registrationNo || "Student"}.pdf`}
        >
          {({ loading }) => (
            <button className="rep-download-btn" disabled={loading}>
              {loading ? "Generating PDF..." : "Download"}
            </button>
          )}
        </PDFDownloadLink>
      </div>

      {/* ================= PRINT SHEET SURFACE ================= */}
      <div className="rep-sheet">
        <div className="rep-outer-border">
          <div className="rep-inner-border">
            
            {/* ================= HEADER ================= */}
            <div className="rep-header">
              <img src={logo} className="rep-school-logo" alt="school-logo" />

              <h1>NASHIB ALI ACADEMY</h1>

              <div className="rep-header-divider">
                <span>{result.examName || "RESULT"}</span>
              </div>

              <h2>REPORT CARD</h2>

              <div className="rep-session-row">
                <div className="rep-line-short"></div>
                <span>SESSION: {result.academicSession}</span>
                <div className="rep-line-short"></div>
              </div>
            </div>

            {/* ================= STUDENT PROFILE SECTION ================= */}
            <div className="rep-student-section">
              <div className="rep-student-info">
                <Info label="Name" value={capitalizeWords(result.name)} />
                <Info label="Father's Name" value={capitalizeWords(result.fatherName)} />
                <Info label="Mother's Name" value={capitalizeWords(result.motherName)} />
                <Info label="Class" value={capitalizeWords(result.class)} />
                <Info label="Medium" value={capitalizeWords(result.medium)} />
                <Info label="Registration No" value={result.registrationNo} />

                {(result.class === "11" || result.class === "12") && (
                  <Info label="Stream" value={capitalizeWords(result.stream)} />
                )}

                <Info label="Rank" value={result.rank || "-"} />
              </div>

              <div className="rep-photo-frame">
                <img
                  src={result?.image?.url || userImg}
                  alt="student-avatar"
                />
              </div>
            </div>

            {/* ================= RECORD DATA TABLE ================= */}
            <div className="rep-table-title">Marks Details</div>

            <table className="rep-marks-table">
              <thead>
                <tr>
                  <th>SUBJECT</th>
                  <th>MAX MARKS</th>
                  <th>OBTAINED</th>
                  <th>GRADE</th>
                </tr>
              </thead>

              <tbody>
                {result?.marks?.length > 0 ? (
                  result.marks.map((m, i) => (
                    <tr key={i}>
                      <td>{m?.subject?.toUpperCase()}</td>
                      <td>{result.maxMarksPerSubject}</td>
                      <td>{m?.mark ?? "-"}</td>
                      <td>{calculateGrade(m?.mark)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No marks available</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* ================= SCORE SUMMARY METRICS ================= */}
            <div className="rep-summary-section">
              <div className="rep-summary-total">
                Marks Obtained: {result.totalMarks || 0} / {MAX_MARKS_SUM}
              </div>
              <div>Percentage: {result.percentage || 0}%</div>
              <div>Grade: {result.grade || "-"}</div>
              <div>Result: {result.resultStatus || "-"}</div>
            </div>

            {/* ================= FOOTER / SIGNATURES ================= */}
            <div className="rep-footer">
              <div className="rep-principal-sign">
                {principal?.signature?.url && (
                  <img
                    src={principal.signature.url}
                    className="rep-principal-sign-img"
                    alt="principal-signature"
                  />
                )}
                <div className="rep-sign-line"></div>
                <span>Principal</span>
                <div className="rep-principal-name">
                  ({principal?.name || "-"})
                </div>
              </div>

              <div className="rep-school-contact">
                <div className="rep-divider-footer">
                  <span>NASHIB ALI ACADEMY</span>
                </div>
                <div>Mahachara, Kachumara, Barpeta, Assam — 781127</div>
                <div>www.nashibaliacademy.in</div>
                <div>nashibaliacademy.offl@gmail.com | +91-60014-16724</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= HELPER CELL COMPONENT ================= */

const Info = ({ label, value }) => (
  <div className="rep-info-row">
    <span className="rep-info-label">{label}:</span>
    <span className="rep-info-value">{value || "-"}</span>
  </div>
);

/* ================= GRADE ALGORITHM ================= */

const calculateGrade = (marks) => {
  const m = parseInt(marks);

  if (isNaN(m)) return "-";
  if (m >= 90) return "A+";
  if (m >= 80) return "A";
  if (m >= 70) return "B+";
  if (m >= 60) return "B";
  if (m >= 50) return "C+";
  if (m >= 40) return "C";
  if (m > 30) return "D";
  return "F";
};

export default ResultDownload;
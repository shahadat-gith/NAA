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

  if (!result) {
    return (
      <div className="report-page">
        <p>No result data found.</p>
        <button onClick={() => navigate("/result")}>
          Back to Result Portal
        </button>
      </div>
    );
  }

  return (
    <div className="report-page">

      
      <div className="actions-container">

        <PDFDownloadLink
          document={<ResultReportPdf result={result} principal={principal} />}
          fileName="result.pdf"
        >
          {({ loading }) => (
            <button className="download-btn" disabled={loading}>
              {loading ? "Generating PDF..." : "Download PDF Report"}
            </button>
          )}
        </PDFDownloadLink>

      </div>

      <div className="report-sheet">

        {/* ================= HEADER ================= */}

        <div className="report-header">

          <img src={logo} className="school-logo" alt="logo" />

          <h1>NASHIB ALI ACADEMY</h1>

          <div className="header-divider">
            <span>{result.examName || "RESULT"}</span>
          </div>

          <h2>REPORT CARD</h2>

          <div className="session-row">
            <div className="line-short"></div>
            <span>SESSION: {result.academicSession}</span>
            <div className="line-short"></div>
          </div>

        </div>

        {/* ================= STUDENT SECTION ================= */}

        <div className="student-section">

          <div className="student-info">

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

          <div className="photo-frame">
            <img
              src={result?.image?.url || userImg}
              alt="student"
            />
          </div>

        </div>

        {/* ================= TABLE ================= */}

        <div className="table-title">
          Marks Details
        </div>

        <table className="marks-table">

          <thead>
            <tr>
              <th>SUBJECT</th>
              <th>MAX MARKS</th>
              <th>OBTAINED</th>
              <th>GRADE</th>
            </tr>
          </thead>

          <tbody>

            {result.marks.map((m, i) => (
              <tr key={i}>
                <td>{m.subject.toUpperCase()}</td>
                <td>{result.maxMarksPerSubject}</td>
                <td>{m.mark}</td>
                <td>{calculateGrade(m.mark)}</td>
              </tr>
            ))}

          </tbody>

        </table>

        {/* ================= SUMMARY ================= */}

        <div className="summary-section">

          <div>Total Marks: {result.totalMarks}</div>
          <div>Percentage: {result.percentage}%</div>
          <div>Grade: {result.grade}</div>
          <div>Result: {result.resultStatus}</div>

        </div>

        {/* ================= FOOTER ================= */}

        <div className="report-footer">

          <div className="principal-sign">

            {principal?.signature?.url && (
              <img
                src={principal.signature.url}
                className="principal-sign-img"
                alt="principal-sign"
              />
            )}

            <div className="sign-line"></div>
            <span>Principal</span>
            <div className="principal-name">
              ({principal?.name || "-"})
            </div>

          </div>

          <div className="school-contact">

            <div className="divider-footer">
              <span>NASHIB ALI ACADEMY</span>
            </div>

            <div>Mahachara, Kachumara, Barpeta, Assam - 781127</div>
            <div>www.nashibaliacademy.in</div>
            <div>nashibaliacademy.offl@gmail.com | +91-60014-16724</div>

          </div>

        </div>

      </div>

      {/* ================= DOWNLOAD BUTTON ================= */}


    </div>
  );
};

/* ================= HELPER COMPONENT ================= */

const Info = ({ label, value }) => (
  <div className="info-row">
    <span className="info-label">{label}:</span>
    <span className="info-value">{value || "-"}</span>
  </div>
);

/* ================= GRADE FUNCTION ================= */

const calculateGrade = (marks) => {
  const m = parseInt(marks);

  if (isNaN(m)) return "-";
  if (m >= 90) return "A+";
  if (m >= 80) return "A";
  if (m >= 70) return "B+";
  if (m >= 60) return "B";
  if (m >= 50) return "C+";
  if (m >= 40) return "C";
  return "F";
};

export default ResultDownload;
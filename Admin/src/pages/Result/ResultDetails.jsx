import React, { useContext, useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { capitalizeWords, capitalizeFirst } from "../../utils/utility";
import "./Styles/ResultDetails.css";

const ResultDetails = () => {
  const { registrationNo } = useParams();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [editOpen, setEditOpen] = useState(false);


  useEffect(() => {
    if (!registrationNo) return;

    let found = null;

    // ✅ 1. Try from navigation state (fastest)
    if (location.state?.results) {
      found = location.state.results.find(
        (r) => r.registrationNo === registrationNo
      );
    }

    // ✅ 2. Try from sessionStorage
    if (!found) {
      const cached = sessionStorage.getItem("results");
      if (cached) {
        const parsed = JSON.parse(cached);
        found = parsed.find(
          (r) => r.registrationNo === registrationNo
        );
      }
    }

    if (found) {
      setResult(found);
      setLoading(false);
    }
  }, [registrationNo, location.state]);

  /* ================= UI ================= */

  if (loading) return <Loader message="Loading result..." />;
  if (!result) return <div className="rd-error">Result not found</div>;

  const getStatusClass = (status) => {
    if (!status) return "";
    const s = status.toLowerCase();
    if (s === "pass") return "status-pass";
    if (s === "fail") return "status-fail";
    return "status-default";
  };

  const getGradeColor = (grade) => {
    const g = (grade || "").toUpperCase();
    if (g === "A+" || g === "A") return "grade-excellent";
    if (g === "B+" || g === "B") return "grade-good";
    if (g === "C+" || g === "C") return "grade-average";
    return "grade-below";
  };

  return (
    <div className="rd-page">
      <div className="rd-bg-orb rd-orb-1" />
      <div className="rd-bg-orb rd-orb-2" />

      <div className="rd-container">
        {/* Header */}
        <div className="rd-header">
          <div className="rd-header-left">
            <span className="rd-label-tag">Academic Result</span>
            <h2 className="rd-student-name">
              {capitalizeWords(result.name || "Unknown Student")}
            </h2>
            <p className="rd-reg-id">#{result.registrationNo}</p>
          </div>

          <button className="rd-edit-btn" onClick={() => setEditOpen(true)}>
            Edit Result
          </button>
        </div>

        {/* Info */}
        <div className="rd-info-grid">
          {[
            { label: "Class", value: result.class },
            { label: "Medium", value: capitalizeFirst(result.medium) },
            { label: "Stream", value: capitalizeFirst(result.stream) || "N/A" },
            { label: "Exam", value: result.examName },
            { label: "Session", value: result.academicSession },
          ].map(({ label, value }) => (
            <div className="rd-info-card" key={label}>
              <span className="rd-info-label">{label}</span>
              <span className="rd-info-value">{value}</span>
            </div>
          ))}
        </div>

        {/* Marks */}
        <div className="rd-marks-section">
          <div className="rd-section-header">
            <h4 className="rd-section-title">Subject Marks</h4>
            <div className="rd-section-line" />
          </div>

          <div className="rd-marks-table-wrapper">
            <table className="rd-marks-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Marks Obtained</th>
                </tr>
              </thead>

              <tbody>
                {result.marks.map((m, idx) => (
                  <tr key={idx}>
                    <td>{m.subject}</td>
                    <td>
                      <span className="rd-mark-pill">{m.mark}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="rd-summary-grid">
          <div className="rd-summary-card rd-summary-large">
            <span>Total Marks</span>
            <span>{result.totalMarks}</span>
          </div>

          <div className="rd-summary-card rd-summary-large">
            <span>Percentage</span>
            <span>{result.percentage}%</span>
          </div>

          <div className="rd-summary-card">
            <span>Grade</span>
            <span className={`rd-grade ${getGradeColor(result.grade)}`}>
              {result.grade}
            </span>
          </div>

          <div className="rd-summary-card">
            <span>Rank</span>
            <span>{result.rank || "—"}</span>
          </div>

          <div className="rd-summary-card rd-status-card">
            <span>Status</span>
            <span className={`rd-status-badge ${getStatusClass(result.resultStatus)}`}>
              {result.resultStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDetails;
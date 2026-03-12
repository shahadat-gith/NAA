import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../components/Loader/Loader";
import { AdminContext } from "../../context/AdminContext";
import { capitalizeWords, capitalizeFirst } from "../../utils/utility";
import { SESSION_OPTIONS, EXAM_OPTIONS } from "../../utils/academicOptions";
import "./Styles/ResultDetails.css";

const ResultDetails = () => {
  const { registrationNo } = useParams();
  const { backendUrl } = useContext(AdminContext);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const fetchResult = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/api/results/${registrationNo}`);
      if (res.data.success) {
        setResult(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching result:", err);
      toast.error(err.response?.data?.message || "Failed to load result");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (registrationNo) fetchResult();
  }, [registrationNo]);

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
      {/* Ambient background orbs */}
      <div className="rd-bg-orb rd-orb-1" />
      <div className="rd-bg-orb rd-orb-2" />

      <div className="rd-container">

        {/* ── Header ── */}
        <div className="rd-header">
          <div className="rd-header-left">
            <span className="rd-label-tag">Academic Result</span>
            <h2 className="rd-student-name">
              {capitalizeWords(result.name || "Unknown Student")}
            </h2>
            <p className="rd-reg-id">#{result.registrationNo}</p>
          </div>
          <button className="rd-edit-btn" onClick={() => setEditOpen(true)}>
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="rd-edit-icon">
              <path d="M14.7 3.3a1 1 0 011.4 1.4L6 14.8l-3.5.9.9-3.5L14.7 3.3z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Edit Result
          </button>
        </div>

        {/* ── Info Cards ── */}
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

        {/* ── Marks Table ── */}
        <div className="rd-marks-section">
          <div className="rd-section-header">
            <h4 className="rd-section-title">Subject Marks</h4>
            <div className="rd-section-line" />
          </div>

          <div className="rd-marks-wrapper">
            <table className="rd-marks-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Marks Obtained</th>
                </tr>
              </thead>
              <tbody>
                {result.marks.map((m, idx) => (
                  <tr key={idx} style={{ animationDelay: `${idx * 0.05}s` }}>
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

        {/* ── Result Summary ── */}
        <div className="rd-summary-grid">
          <div className="rd-summary-card rd-summary-large">
            <span className="rd-summary-label">Total Marks</span>
            <span className="rd-summary-value">{result.totalMarks}</span>
          </div>
          <div className="rd-summary-card rd-summary-large">
            <span className="rd-summary-label">Percentage</span>
            <span className="rd-summary-value">{result.percentage}%</span>
          </div>
          <div className="rd-summary-card">
            <span className="rd-summary-label">Grade</span>
            <span className={`rd-summary-value rd-grade ${getGradeColor(result.grade)}`}>
              {result.grade}
            </span>
          </div>
          <div className="rd-summary-card">
            <span className="rd-summary-label">Rank</span>
            <span className="rd-summary-value">{result.rank || "—"}</span>
          </div>
          <div className="rd-summary-card rd-status-card">
            <span className="rd-summary-label">Result Status</span>
            <span className={`rd-status-badge ${getStatusClass(result.resultStatus)}`}>
              {result.resultStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Edit modal */}
      {editOpen && (
        <EditResultModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          result={result}
          onSuccess={() => {
            fetchResult();
            setEditOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ResultDetails;
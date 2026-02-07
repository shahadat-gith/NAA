import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../../../context/AppContext";
import { EXAM_OPTIONS, SESSION_OPTIONS } from "../../../../Utils/utility";
import "../../Styles/Result.css";

const Result = () => {
  const [registrationNo, setRegistrationNo] = useState("");
  const [examName, setExamName] = useState("");
  const [academicSession, setAcademicSession] = useState("");

  const [resultData, setResultData] = useState(null);
  const [principal, setPrincipal] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfoMessage("");
    setResultData(null);

    if (!registrationNo || !examName || !academicSession) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${backendUrl}/api/results/fetch`,
        {
          registrationNo: registrationNo.trim(),
          examName,
          academicSession,
        }
      );

      if (!res.data.success) {
        setError(res.data.message || "Result not found");
        return;
      }

      const result = res.data.result;

      /* 🔒 VISIBILITY CHECK */
      if (!result.canSee) {
        setInfoMessage(
          "Please pay fees to see the result. Contact principal sir"
        );
        return;
      }

      setResultData(result);
      setPrincipal(res.data.principal || null);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while fetching the result"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= NAVIGATE TO DOWNLOAD ================= */

  useEffect(() => {
    if (resultData) {
      navigate("download", {
        state: { resultData, principal },
      });
    }
  }, [resultData, navigate, principal]);

  /* ================= UI ================= */

  return (
    <div className="result-page">
      <div className="result-header">
        <h2>Student Result Portal</h2>
        <p>Enter your details below to check your examination results</p>
      </div>

      <div className="result-form-container">
        <h3 className="form-title">Enter Your Details</h3>

        <form onSubmit={handleSubmit}>
          <div className="result-form">
            <div className="form-group">
              <label>
                Registration No<span>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. NAA2511001A"
                value={registrationNo}
                onChange={(e) => setRegistrationNo(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label>
                Exam Name<span>*</span>
              </label>
              <select
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                disabled={loading}
                required
              >
                <option value="">Select Exam</option>
                {EXAM_OPTIONS.map((exam) => (
                  <option key={exam} value={exam}>
                    {exam}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>
                Academic Session<span>*</span>
              </label>
              <select
                value={academicSession}
                onChange={(e) => setAcademicSession(e.target.value)}
                disabled={loading}
                required
              >
                <option value="">Select Session</option>
                {SESSION_OPTIONS.map((session) => (
                  <option key={session} value={session}>
                    {session}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Checking..." : "Check Result"}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}
        {infoMessage && <div className="info-message">{infoMessage}</div>}
      </div>
    </div>
  );
};

export default Result;

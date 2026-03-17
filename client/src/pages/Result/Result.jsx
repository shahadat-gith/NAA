import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { EXAM_OPTIONS, SESSION_OPTIONS } from "../../Utils/utility";
import "./Result.css";

const Result = () => {
  const [registrationNo, setRegistrationNo] = useState("");
  const [examName, setExamName] = useState("");
  const [academicSession, setAcademicSession] = useState("");
  const [result, setResult] = useState(null);
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
    setResult(null);

    if (!registrationNo) {
      setError("Please enter registration no");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${backendUrl}/api/results/student/fetch`,
        {
          registrationNo: registrationNo.trim().toUpperCase()
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

      setResult(result);
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
    if (result) {
      navigate("download", {
        state: { result, principal },
      });
    }
  }, [result, navigate, principal]);

  /* ================= UI ================= */

  return (
    <div className="result-page">
      <div className="result-header">
        <h2>Check Result</h2>
        <p>Enter your details below to check your examination results</p>
      </div>

      <div className="result-form-container">
       
        <form onSubmit={handleSubmit}>
          <div className="result-form">
            <div className="form-group">
              <label>
                Registration No<span>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. NAA2511001A"
                value={registrationNo.toUpperCase()}
                onChange={(e) => setRegistrationNo(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Searching..." : "Search Result"}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}
        {infoMessage && <div className="info-message">{infoMessage}</div>}
      </div>
    </div>
  );
};

export default Result;

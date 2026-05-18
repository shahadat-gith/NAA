import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../../../context/AppContext";
import "./Result.css";
import Search from "../Common/Search";

const Result = () => {
  const [result, setResult] = useState(null);
  const [principal, setPrincipal] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);


  const handleResultSearch = async (registrationNo) => {
    setError("");
    setInfoMessage("");
    setResult(null);
    setLoading(true);

    try {
      const res = await axios.post(
        `${backendUrl}/api/results/student/fetch`,{registrationNo});

      if (!res.data.success) {
        setError(res.data.message || "Result not found");
        return;
      }

      const resultData = res.data.result;

      /* 🔒 VISIBILITY CHECK */
      if (!resultData.canSee) {
        setInfoMessage(
          "Please pay fees to see the result. Contact principal sir"
        );
        return;
      }

      setResult(resultData);
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

  /* ================= UI RENDERING ================= */

  return (
    <div className="result-page">
      {/* Reusable Search Component replaces the entire old manual form layout */}
      <Search 
        title="Check Result" 
        onSearch={handleResultSearch} 
        searching={loading} 
      />

      {/* System Response Messages Container */}
      <div className="result-messages-container">
        {error && <div className="error-message">{error}</div>}
        {infoMessage && <div className="info-message">{infoMessage}</div>}
      </div>
    </div>
  );
};

export default Result;
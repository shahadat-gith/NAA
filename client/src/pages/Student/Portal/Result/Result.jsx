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

  // Clear messages from view when user hits search
  const messagesWrapper = document.querySelector('.res-messages-container');
  if (messagesWrapper) messagesWrapper.removeAttribute('data-active');

    try {
      const res = await axios.post(
        `${backendUrl}/api/results/student/fetch`, { registrationNo }
      );

      if (!res.data.success) {
        setError(res.data.message || "Result not found");
        return;
      }

      const resultData = res.data.result;

      /* 🔒 VISIBILITY CHECK */
      if (!resultData.canSee) {
        setInfoMessage(
          "Please complete your outstanding dues to unlock the report card layout. Kindly contact the Principal's office."
        );
        return;
      }

      setResult(resultData);
      setPrincipal(res.data.principal || null);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An unexpected network error occurred while fetching your academic record."
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
    <div className="res-page">
      <div className="res-container">
        
        {/* Reusable Search Component Module */}
        <Search 
          title="Check Result" 
          onSearch={handleResultSearch} 
          searching={loading} 
        />

        {/* System Response Status Message Area */}
        {(error || infoMessage) && (
          <div className="res-messages-container" data-active="true">
            {error && (
              <div className="res-alert res-alert-danger">
                <i className="fas fa-exclamation-triangle"></i>
                <p>{error}</p>
              </div>
            )}
            
            {infoMessage && (
              <div className="res-alert res-alert-info">
                <i className="fas fa-lock"></i>
                <p>{infoMessage}</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Result;
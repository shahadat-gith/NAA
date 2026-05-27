import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../../../context/AppContext";
import { TbAlertTriangle } from "react-icons/tb";
import Search from "../Common/Search";
import "./AdmitCard.css";

const AdmitCard = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const handleAdmitCardSearch = async (registrationNo) => {
    setError("");
    setInfoMessage("");
    setLoading(true);

    try {
      const res = await axios.post(`${backendUrl}/api/student/search`, {
        registrationNo,
        key: "admitCard"
      });

      if (!res.data.success) {
        setError(res.data.message || "Admit Card data not found.");
        return;
      }

      const payload = res.data;

      /* 🔒 SECURITY CONTROL CHECKS */
      if (!payload.services?.admitCard) {
        setInfoMessage("Admit card services are temporarily disabled. Please contact Principal Sir.");
        return;
      }
      if (!payload.admitCard) {
        setInfoMessage("Admit card schedules have not been released yet. Please check back later.");
        return;
      }
      if (!payload.student?.canDownloadAdmitCard) {
        setInfoMessage("Your download clearance is blocked due to outstanding dues. Please clear outstanding fees.");
        return;
      }

      // Route to the separate download page, passing down the clean state payload
      navigate("download", {
        state: { data: payload },
      });

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "An unexpected systems error occurred while generating your admit card."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adtc-page adtc-search-landing-context">
      <div className="adtc-search-container">
        
        {/* Reusable Core Search Component Module */}
        <Search 
          title="Download Admit Card"
          onSearch={handleAdmitCardSearch}
          searching={loading}
        />

        {/* System Error Response Banner */}
        {error && (
          <div className="adtc-inline-msg adtc-alert-danger">
            <TbAlertTriangle className="adtc-msg-icon" />
            <p>{error}</p>
          </div>
        )}

        {/* System Informational/Warning Response Banner */}
        {infoMessage && (
          <div className="adtc-inline-msg adtc-alert-warning">
            <TbAlertTriangle className="adtc-msg-icon" />
            <p>{infoMessage}</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdmitCard;
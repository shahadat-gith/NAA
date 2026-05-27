import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../../../context/AppContext";
import { TbAlertTriangle } from "react-icons/tb";
import Search from "../Common/Search";
import "./IdCard.css";

const IdCard = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleIdCardSearch = async (registrationNo) => {
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${backendUrl}/api/student/search`, {
        registrationNo,
      });

      if (res.data?.success) {
        navigate("download", {
          state: { data: res.data },
        });
      } else {
        setError(res.data?.message || "Student data records not found.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "An unexpected systems network error occurred during identification verification."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="idc-page idc-search-landing-context">
      <div className="idc-search-container">
        
        {/* Reusable Core Search Component Module */}
        <Search 
          title="Download Digital ID Card"
          onSearch={handleIdCardSearch}
          searching={loading}
        />

        {/* System Error Response Banner */}
        {error && (
          <div className="idc-inline-msg idc-alert-danger">
            <TbAlertTriangle className="idc-msg-icon" />
            <p>{error}</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default IdCard;
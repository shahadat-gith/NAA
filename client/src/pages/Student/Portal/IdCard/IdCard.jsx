import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../../../context/AppContext";
import { TbAlertTriangle } from "react-icons/tb";
import Search from "../Common/Search";
import "./IdCard.css"; // Uses the clean, centring stylesheet layout

const IdCard = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleIdCardSearch = async (registrationNo) => {
    setError("");
    setLoading(true);

    try {
      // Normal search without a payload key, as per your specifications
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
    <div className="idcard-page search-landing-context">
      <div className="idcard-search-container">
        
        <Search 
          title="Download Digital ID Card"
          onSearch={handleIdCardSearch}
          searching={loading}
        />

        {error && (
          <div className="idcard-inline-msg error">
            <TbAlertTriangle className="msg-icon" />
            <p>{error}</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default IdCard;
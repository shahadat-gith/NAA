import React, { useContext, useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import { Link } from "react-router-dom";
import "./Portal.css";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../components/Loader/Loader";

const Portal = () => {
  const { backendUrl } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [serviceSettings, setServiceSettings] = useState(null);

  useEffect(() => {
    fetchServiceSettings();
  }, []);

  const fetchServiceSettings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/api/settings/services`);
      if (res.data.success) {
        setServiceSettings(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to load service settings");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = (key) => {
    if (!serviceSettings) return true;
    return serviceSettings[key] === false;
  };

  /* ===== OPTION RENDERER ===== */
 const renderOption = ({ type, icon, label, disabled }) => {
  const statusText = disabled ? "Not available" : "Available";

  // decide route based on type
  const redirectPath =
    type === "result" ? "/portal/result" : "/portal/search";

  return (
    <li
      className={`portal-options-list-item ${
        disabled ? "portal-disabled" : "portal-available"
      }`}
    >
      {/* STATUS BADGE */}
      <span
        className={`portal-status-badge ${
          disabled ? "status-unavailable" : "status-available"
        }`}
      >
        {statusText}
      </span>

      {disabled ? (
        <div className="portal-options-list-item-link disabled">
          <i className={`portal-icon ${icon}`}></i>
          <span>{label}</span>
        </div>
      ) : (
        <Link
          to={redirectPath}
          state={type === "result" ? undefined : { type }}
          className="portal-options-list-item-link"
        >
          <i className={`portal-icon ${icon}`}></i>
          <span>{label}</span>
        </Link>
      )}
    </li>
  );
};


  return (
    <div className="portal-page">
      <Header
        title="Student Portal"
        tagline="Access all your student services in one place"
      />

      <div className="portal-container portal-content-wrapper">
        {/* CONTENT LOADER */}
        {(loading || !serviceSettings) && (
          <Loader text="Loading portal..." />
        )}

        <div className="portal-title">
          <h2>Student Portal</h2>
        </div>

        <div className="portal-content">
          {/* ===== PAYMENT OPTIONS ===== */}
          <div className="portal-left">
            <div className="portal-left-title">
              <h3>Payment Options</h3>
            </div>

            <ul className="portal-options-list">
              {renderOption({
                type: "monthly",
                icon: "fas fa-money-bill-wave payment-icon",
                label: "Monthly Fee Payment",
                disabled: isDisabled("feeMonthly"),
              })}

              {renderOption({
                type: "admission",
                icon: "fas fa-user-graduate admission-icon",
                label: "Admission Fee Payment",
                disabled: isDisabled("feeAdmission"),
              })}

              {renderOption({
                type: "hostel",
                icon: "fas fa-bed hostel-icon",
                label: "Hostel Fee Payment",
                disabled: isDisabled("feeHostel"),
              })}
            </ul>
          </div>

          {/* ===== SERVICES ===== */}
          <div className="portal-right">
            <div className="portal-right-title">
              <h3>Services</h3>
            </div>

            <ul className="portal-right-options-list">
              {renderOption({
                type: "result",
                icon: "fas fa-chart-bar result-icon",
                label: "Result Check",
                disabled: isDisabled("result"),
              })}

              {renderOption({
                type: "admit-card",
                icon: "fas fa-id-card admit-icon",
                label: "Admit Card",
                disabled: isDisabled("admitCard"),
              })}

              {renderOption({
                type: "admission",
                icon: "fa-solid fa-id-card-clip id-icon",
                label: "Admission",
                disabled: isDisabled("admission"),
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portal;

import { useContext} from "react";
import Header from "../../components/Header/Header";
import { Link } from "react-router-dom";
import "./Portal.css";
import { AppContext } from "../../context/AppContext";
import { Helmet } from "react-helmet-async";

const Portal = () => {
  const {serviceSettings} = useContext(AppContext);

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
        className={`portal-options-list-item ${disabled ? "portal-disabled" : "portal-available"
          }`}
      >
        {/* STATUS BADGE */}
        <span
          className={`portal-status-badge ${disabled ? "status-unavailable" : "status-available"
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
      <Helmet>
        <title>Student Portal | Nashib Ali Academy</title>
      </Helmet>
      <Header
        title="Student Portal"
        tagline="Access all your student services in one place"
      />

      <div className="portal-container portal-content-wrapper">
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

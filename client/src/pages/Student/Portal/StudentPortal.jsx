import React from "react";
import { 
  TbReceipt2, 
  TbIdBadge2, 
  TbChartBar, 
  TbFingerprint, 
  TbArrowUpRight 
} from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import "./StudentPortal.css";
import bg_image from "/search.webp";
import logo from '/logo.png';

const StudentPortal = () => {
  const navigate = useNavigate();

  const portalOptions = [
    { 
      id: "fees_payment", 
      label: "Fees Payment", 
      path: "/student/portal/fees",
      icon: <TbReceipt2 />, 
      className: "prt-icon-fees"
    },
    { 
      id: "admit_card", 
      label: "Admit Card", 
      path: "/student/portal/admit-card",
      icon: <TbIdBadge2 />, 
      className: "prt-icon-admit"
    },
    { 
      id: "result_check", 
      label: "Result Check", 
      path: "/student/portal/result",
      icon: <TbChartBar />, 
      className: "prt-icon-result"
    },
    { 
      id: "id_card", 
      label: "ID Card", 
      path: "/student/portal/id-card",
      icon: <TbFingerprint />, 
      className: "prt-icon-id"
    },
  ];

  return (
    <div 
      className="prt-bg-wrapper" 
      style={{ backgroundImage: `url(${bg_image})` }}
    >
      <div className="prt-blur-overlay">
        <div className="prt-root">
          <div className="prt-inner">
            
            {/* Top Header Section */}
            <div className="prt-top">
              <div className="prt-logo">
                <img src={logo} alt="Logo" />
              </div>
              <div className="prt-header-text">
                <p className="prt-eyebrow">Academic Hub</p>
                <h1 className="prt-heading">Online Portal</h1>
              </div>
              <div className="prt-status" title="All systems online"></div>
            </div>

            <div className="prt-divider"></div>

            {/* Grid Options */}
            <div className="prt-grid">
              {portalOptions.map((option) => (
                <div
                  key={option.id}
                  className="prt-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(option.path)}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(option.path)}
                  aria-label={option.label}
                >
                  <div className="prt-card-left">
                    <div className={`prt-icon ${option.className}`}>
                      {option.icon}
                    </div>
                    <p className="prt-label">{option.label}</p>
                  </div>
                  <span className="prt-arrow">
                    <TbArrowUpRight />
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPortal;
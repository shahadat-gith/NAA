import React from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";

const Header = ({ title, tagline, headerButton }) => {
  const navigate = useNavigate()
  return (
    <header className="header-premium">
      <div className="header-overlay">
        <div className="header-content">
          <h1 className="header-school-name">{title}</h1>
          <p className="header-school-tagline">{tagline}</p>
          {headerButton && 
          <button  
            className="premium-button-header"
            onClick={() => navigate("/admission-portal/admission-form")}>{headerButton}
            </button>
            
          }
        </div>
      </div>
    </header>
  );
};

export default Header;
// Loader.jsx
import React from "react";
import "./Loader.css";
import logo from "/NAA_LOGO.svg";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="loader-container">
      <div className="loader-wrapper">
        {/* Circular Spinner */}
        <div className="loader-spinner"></div>

        {/* Fixed Logo */}
        <img src={logo} alt="NAA Logo" className="loader-logo" />
      </div>

      <p className="loader-text">{text}</p>
    </div>
  );
};

export default Loader;

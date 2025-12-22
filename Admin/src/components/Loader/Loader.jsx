import React from "react";
import "./Loader.css";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="loader-overlay">
      <div className="loader-box">
        <div className="spinner"></div>
        <span className="loader-text">{text}</span>
      </div>
    </div>
  );
};

export default Loader;

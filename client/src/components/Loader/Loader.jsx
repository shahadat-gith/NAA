import React from "react";
import "./Loader.css";
import loaderSvg from "/loader.svg";

const Loader = ({ overlay = true }) => {
  return (
    <div className={`loader-container ${overlay ? "loader-overlay" : "loader-fullscreen"}`}>
      <div className="loader-content">
        <img src={loaderSvg} alt="Loading..." className="spinner-svg" />
      </div>
    </div>
  );
};

export default Loader;
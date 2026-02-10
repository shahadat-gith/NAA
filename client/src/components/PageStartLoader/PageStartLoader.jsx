import React from "react";
import "./PageStartLoader.css";
import logo from "/logo.png";

const PageStartLoader = () => {
  return (
    <div className="website-loader">
      <div className="loader-wrapper">
        <div className="loader-ring"></div>

        <div className="logo-center">
          <img src={logo} alt="NAA Logo" />
        </div>
      </div>

      <p className="loader-text">Loading, please wait...</p>
    </div>
  );
};

export default PageStartLoader;

import React from "react";

const TabNavigation = ({ activeTab, switchTab, navigate }) => (
  <div className="tab-navigation">
    <button className="tab-button back-btn" onClick={() => navigate("/student-portal")}>
      Back
    </button>
    <button
      className={`tab-button ${activeTab === "result" ? "active" : ""}`}
      onClick={() => switchTab("result")}
    >
      Check Results
    </button>
    <button
      className={`tab-button ${activeTab === "admitCard" ? "active" : ""}`}
      onClick={() => switchTab("admitCard")}
    >
      Download Admit Card
    </button>
  </div>
);

export default TabNavigation;
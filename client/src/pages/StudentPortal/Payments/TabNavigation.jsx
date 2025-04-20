import React from "react";

const TabNavigation = ({ activeTab, switchTab, navigate }) => (
  <div className="tab-navigation">
    <button className="tab-button back-btn-navigation" onClick={() => navigate("/student-portal")}>
      Back
    </button>
    <button
      className={`tab-button ${activeTab === "monthly" ? "active" : ""}`}
      onClick={() => switchTab("monthly")}
    >
      Monthly Fee
    </button>
    <button
      className={`tab-button ${activeTab === "admission" ? "active" : ""}`}
      onClick={() => switchTab("admission")}
    >
      Admission Fee
    </button>
    <button
      className={`tab-button ${activeTab === "hostel" ? "active" : ""}`}
      onClick={() => switchTab("hostel")}
    >
      Hostel Fee
    </button>
  </div>
);

export default TabNavigation;
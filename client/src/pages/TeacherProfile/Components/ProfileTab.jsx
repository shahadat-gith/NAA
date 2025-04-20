import React from "react";

const ProfileTab = ({ teacher }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  return (
    <div className="teacher-tab-content">
      <div className="teacher-info-section">
        <h3>Personal Information</h3>
        <div className="teacher-info-grid">
          <div className="teacher-info-item">
            <span className="teacher-info-label">Full Name</span>
            <span className="teacher-info-value">{teacher.name || "N/A"}</span>
          </div>
          <div className="teacher-info-item">
            <span className="teacher-info-label">Email</span>
            <span className="teacher-info-value">{teacher.email || "N/A"}</span>
          </div>
          <div className="teacher-info-item">
            <span className="teacher-info-label">Phone</span>
            <span className="teacher-info-value">{teacher.contact || "N/A"}</span>
          </div>
          <div className="teacher-info-item">
            <span className="teacher-info-label">Subject</span>
            <span className="teacher-info-value">{teacher.subject || "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
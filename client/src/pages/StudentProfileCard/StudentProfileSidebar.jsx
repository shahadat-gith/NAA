import React from "react";
import generateAdmissionSlip from "./AdmissionSlip";
import { toast } from "react-toastify";

const StudentProfileSidebar = ({ student, backendUrl, navigate, clearUserData }) => {
  const handleGenerateAdmissionSlip = () => {
    if (student?.status.toLowerCase() === "approved") {
      generateAdmissionSlip(student, backendUrl);
    } else {
      toast.warn("Admission slip can only be downloaded when your admission is verified.");
    }
  };

  const handlePasswordChangeNavigation = () => {
    navigate("/forgot-password/student");
  };

  const handleLogout = () => {
    clearUserData("student");
    navigate("/login/student");
  };

  return (
    <div className="student-profile-sidebar">
      <div className="student-profile-image-container">
        <img
          src={`${backendUrl}/${student.image}`}
          alt={student.name}
          className="student-profile-image"
          onError={(e) => (e.target.src = "/default-avatar.png")}
        />
        <span className={`student-status-badge ${student.status.toLowerCase()}`}>
          {student.status}
        </span>
      </div>
      <h2 className="student-name">{student.name}</h2>
      <p className="student-program">
        {student.class
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" - ")}
      </p>
      <div className="student-action-buttons">
        <button
          onClick={handleGenerateAdmissionSlip}
          className="student-action-button student-receipt-button"
        >
          <i className="fas fa-download"></i> Download Admission Slip
        </button>
        <button
          onClick={handlePasswordChangeNavigation}
          className="student-action-button student-password-button"
        >
          <i className="fas fa-lock"></i> Change Password
        </button>
        <button onClick={handleLogout} className="student-action-button student-logout-button">
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </div>
  );
};

export default StudentProfileSidebar;
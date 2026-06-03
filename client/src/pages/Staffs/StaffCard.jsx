import React from "react";
import "./StaffCard.css";

export const StaffCard = ({ teacher }) => {
  const experienceText =
    teacher.experience !== undefined ? `${teacher.experience} years` : "N/A";

  // Safely grab the image URL from your nested asset schema layout
  const profileImage = teacher.image?.url || "/user.png";

  return (
    <div className="stf-staff-card-flat">
      {/* 1. Media Area */}
      <div className="stf-media-box">
        <img
          src={profileImage}
          alt={teacher.name}
          className="stf-profile-img"
          loading="lazy"
        />
      </div>
      
      {/* 2. Content Details Body */}
      <div className="stf-details-body">
        <div className="stf-info-header">
          <h3 className="stf-employee-name">{teacher.name}</h3>
          <p className="stf-employee-designation">{teacher.designation || "Staff Member"}</p>
        </div>

        {/* 3. Parameter Stack (Unified Key-Value Layout) */}
        <div className="stf-parameter-stack">
          <div className="stf-meta-line">
            <span className="stf-meta-label">Qualification</span>
            <span className="stf-meta-value">{teacher.qualification || "Not Provided"}</span>
          </div>

          {/* Render Subject Specialty for teachers, otherwise show Administrative department status */}
          <div className="stf-meta-line">
            <span className="stf-meta-label">
              {teacher.staffType === "Teaching" ? "Subject" : "Department"}
            </span>
            <span className="stf-meta-value">
              {teacher.staffType === "Teaching" 
                ? (teacher.subjectTaught || "General") 
                : "Administration"
              }
            </span>
          </div>

          <div className="stf-meta-line">
            <span className="stf-meta-label">Experience</span>
            <span className="stf-meta-value">{experienceText}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
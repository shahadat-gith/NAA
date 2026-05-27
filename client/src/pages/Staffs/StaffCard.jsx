import React from "react";
import "./StaffCard.css";

export const StaffCard = ({ teacher }) => {
  const experienceText =
    teacher.experience !== undefined ? `${teacher.experience} years` : "N/A";

  // Safely grab the image URL from your nested asset schema layout
  const profileImage = teacher.image?.url || "/user.png";

  return (
    <div className="stf-teacher-card">
      <div className="stf-card-media">
        <img
          src={profileImage}
          alt={teacher.name}
          className="stf-card-image"
          loading="lazy"
        />
      </div>
      <div className="stf-card-body">
        <div className="stf-card-top">
          <h3 className="stf-card-name">{teacher.name}</h3>
          <p className="stf-card-subtitle">
            <p>
              <span style={{ fontWeight: "bold" }}>Designation:</span>{" "}
              <span style={{ color: "var(--accent-color)" }}>
                {teacher.designation}
              </span>
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Degree:</span>{" "}
              <span style={{ color: "var(--accent-color)" }}>
                {teacher.degree || "Not Provided"} 
              </span>
            </p>
          </p>
        </div>

        <div className="stf-card-subjects">
          <span className="stf-subject-label">Subject Taught</span>
          <span className="stf-subject-value">
            {teacher.subjectTaught || "N/A"}
          </span>
        </div>

        <div className="stf-card-meta">
          <span className="stf-chip">Experience: {experienceText}</span>
          {teacher.status && teacher.status !== "Active" && (
            <span
              className={`stf-status-badge status-${teacher.status.toLowerCase()}`}
            >
              {teacher.status}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

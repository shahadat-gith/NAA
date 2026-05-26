import React from 'react';

export const StaffCard = ({ teacher }) => {
  const experienceText = teacher.experience !== undefined ? `${teacher.experience} years` : 'N/A';
  
  // Safely grab the image URL from your nested asset schema layout
  const profileImage = teacher.image?.url || '/user.png';

  return (
    <div className="te-teacher-card">
      <div className="te-teacher-card-media">
        <img
          src={profileImage}
          alt={teacher.name}
          className="te-teacher-card-image"
          loading="lazy"
          onError={(e) => {
            e.target.src = '/default-avatar.png';
          }}
        />
      </div>
      <div className="te-teacher-card-body">
        <div className="te-teacher-card-top">
          <h3 className="te-teacher-card-name">{teacher.name}</h3>
          <p className="te-teacher-card-degree">
            {teacher.designation || 'Assistant Teacher'} • <span style={{ opacity: 0.85 }}>{teacher.degree || 'N/A'}</span>
          </p>
        </div>
        
        <p className="te-teacher-card-subjects">
          <span
            style={{
              color: "#5c6f7b", 
              fontWeight: "700",
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              display: "block", 
              marginBottom: "2px"
            }}
          >
            Subject Taught
          </span>
          <span style={{ color: "var(--te-accent-dark)", fontWeight: "600" }}>
            {teacher.subjectTaught || 'N/A'}
          </span>
        </p>

        <div className="te-teacher-card-meta">
          <span className="te-teacher-chip">Experience: {experienceText}</span>
          {teacher.status && teacher.status !== 'Active' && (
            <span className={`te-status-badge-inline status-${teacher.status.toLowerCase()}`}>
              {teacher.status}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
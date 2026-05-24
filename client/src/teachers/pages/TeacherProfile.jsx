import React, { useState, useContext } from "react";
import { useOutletContext } from "react-router-dom";
import "../styles/TeacherProfile.css";
import ProfileUpdateModal from "../components/ProfileUpdateModal";

const TeacherProfile = () => {
  const [teacher, setTeacher] = useOutletContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!teacher) {
    return (
      <div className="teacher-profile-loading">
        <p>Loading profile configurations...</p>
      </div>
    );
  }

  return (
    <div className="teacher-profile-page">
      {/* Header Panel */}
      <div className="teacher-profile-header">
        <div>
          <p className="teacher-dashboard-tag">My Profile</p>
          <h1 className="teacher-dashboard-title">{teacher.name}</h1>
        </div>
        <div className="edit-tbn">
           <button
              className="teacher-edit-trigger-btn"
              type="button"
              onClick={() => setIsModalOpen(true)}
            >
              Edit Profile
            </button>
        </div>
      </div>

      <div className="teacher-profile-body">

        {/* Read-Only Account Details View */}
        <section className="teacher-card">
          <div className="teacher-card-header">
            <h2>Account Details</h2>
          </div>

          <div className="teacher-details-display-grid">
            <div className="teacher-info-field">
              <span className="teacher-info-label">Full Name</span>
              <span className="teacher-info-value">{teacher.name}</span>
            </div>
            <div className="teacher-info-field">
              <span className="teacher-info-label">Email Address</span>
              <span className="teacher-info-value">{teacher.email || "N/A"}</span>
            </div>
            <div className="teacher-info-field">
              <span className="teacher-info-label">Contact Number</span>
              <span className="teacher-info-value">{teacher.contact}</span>
            </div>
            <div className="teacher-info-field">
              <span className="teacher-info-label">Degree</span>
              <span className="teacher-info-value">{teacher.degree}</span>
            </div>
            <div className="teacher-info-field">
              <span className="teacher-info-label">Experience</span>
              <span className="teacher-info-value">{teacher.experience} Years</span>
            </div>
          </div>
        </section>

        {/* Read-Only Subject & Class Tracking Mapping Section (Admin Controlled) */}
        <section className="teacher-card">
          <div className="teacher-card-header">
            <h2>Assigned Subjects & Classes</h2>
          </div>

          <div className="teacher-mapping-stack">
            {teacher.subjectClassMappings && teacher.subjectClassMappings.length > 0 ? (
              teacher.subjectClassMappings.map((mapping, idx) => (
                <div key={idx} className="teacher-mapping-row">
                  <span className="teacher-mapping-subject">{mapping.subject}</span>
                  <div className="teacher-mapping-classes">
                    {mapping.classes.map((cls, cIdx) => (
                      <span key={cIdx} className="teacher-class-tag">Class {cls}</span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <span className="teacher-tag-empty">No subjects or classes assigned yet.</span>
            )}
          </div>
        </section>

      </div>

      {/* Profile Modification Overlay Management Modal */}
      {isModalOpen && (
        <ProfileUpdateModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          teacherData={teacher}
          onUpdateSuccess={(updatedTeacher) => setTeacher(updatedTeacher)}
        />
      )}
    </div>
  );
};

export default TeacherProfile;
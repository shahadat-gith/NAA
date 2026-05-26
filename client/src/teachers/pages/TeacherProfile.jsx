import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import "../styles/TeacherProfile.css";
import ProfileUpdateModal from "../components/ProfileUpdateModal";

const TeacherProfile = () => {
  const { dashboard, setDashboard } = useOutletContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { teacher } = dashboard;

  // Safeguard if address isn't populated or fallback defaults are required
  const address = teacher.address || {};

  return (
    <div className="teacher-profile-page">
      {/* Header Panel */}
      <div className="teacher-profile-header">
        <div className="teacher-profile-header-left">
          {teacher.image?.url && (
            <img 
              src={teacher.image.url} 
              alt={teacher.name} 
              className="teacher-profile-avatar-thumb"
            />
          )}
          <div>
            <p className="teacher-dashboard-tag">
              Designation: {teacher.designation || " "} — <span className="teacher-id-pill">ID: {teacher.teacherId || "N/A"}</span>
            </p>
            <h1 className="teacher-dashboard-title">{teacher.name}</h1>
          </div>
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
            <h2>Account & Academic Details</h2>
          </div>

          <div className="teacher-details-display-grid">
            <div className="teacher-info-field">
              <span className="teacher-info-label">Full Name</span>
              <span className="teacher-info-value">{teacher.name}</span>
            </div>
            <div className="teacher-info-field">
              <span className="teacher-info-label">Email Address</span>
              <span className="teacher-info-value">
                {teacher.email && teacher.email !== "N/A" ? teacher.email : "Not Provided"}
              </span>
            </div>
            <div className="teacher-info-field">
              <span className="teacher-info-label">Contact Number</span>
              <span className="teacher-info-value">{teacher.contact}</span>
            </div>
            <div className="teacher-info-field">
              <span className="teacher-info-label">Subject</span>
              <span className="teacher-info-value teacher-subject-highlight">
                {teacher.subjectTaught || "N/A"}
              </span>
            </div>
            <div className="teacher-info-field">
              <span className="teacher-info-label">Degree / Qualifications</span>
              <span className="teacher-info-value">{teacher.degree}</span>
            </div>
            <div className="teacher-info-field">
              <span className="teacher-info-label">Experience</span>
              <span className="teacher-info-value">
                {teacher.experience} Years
              </span>
            </div>
            <div className="teacher-info-field">
              <span className="teacher-info-label">Account Status</span>
              <span className={`teacher-info-value status-tag-${teacher.status?.toLowerCase() || "pending"}`}>
                {teacher.status || "Pending"}
              </span>
            </div>
          </div>
        </section>

        {/* Residential Address Information Section */}
        <section className="teacher-card">
          <div className="teacher-card-header">
            <h2>Residential Address</h2>
          </div>

          <div className="teacher-details-display-grid tp-address-grid">
            <div className="teacher-info-field">
              <span className="teacher-info-label">Village / Town</span>
              <span className="teacher-info-value">{address.village || "N/A"}</span>
            </div>
            <div className="teacher-info-field">
              <span className="teacher-info-label">Post Office (P.O.)</span>
              <span className="teacher-info-value">{address.po || "N/A"}</span>
            </div>
            <div className="teacher-info-field">
              <span className="teacher-info-label">Police Station (P.S.)</span>
              <span className="teacher-info-value">{address.ps || "N/A"}</span>
            </div>
            <div className="teacher-info-field">
              <span className="teacher-info-label">District</span>
              <span className="teacher-info-value">{address.district || "N/A"}</span>
            </div>
            <div className="teacher-info-field">
              <span className="teacher-info-label">PIN Code</span>
              <span className="teacher-info-value tp-pin-font">{address.pin || "N/A"}</span>
            </div>
            <div className="teacher-info-field">
              <span className="teacher-info-label">State</span>
              <span className="teacher-info-value">{address.state || "Assam"}</span>
            </div>
          </div>
        </section>
      </div>

      {/* Profile Modification Overlay Management Modal */}
      {isModalOpen && (
        <ProfileUpdateModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          teacherData={teacher}
          onUpdateSuccess={(updatedTeacher) =>
            setDashboard((prev) => ({
              ...prev,
              teacher: {
                ...prev.teacher,
                ...updatedTeacher,
              },
            }))
          }
        />
      )}
    </div>
  );
};

export default TeacherProfile;
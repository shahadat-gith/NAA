import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import "../styles/StaffProfile.css";
import ProfileUpdateModal from "../components/ProfileUpdateModal";

const StaffProfile = () => {
  const { dashboard, setDashboard } = useOutletContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { staff } = dashboard;

  // Safeguard if address isn't populated or fallback defaults are required
  const address = staff?.address || {};

  return (
    <div className="teacher-profile-page">
      {/* Header Panel */}
      <div className="teacher-profile-header">
        <div className="teacher-profile-header-left">
          {staff?.image?.url && (
            <img 
              src={staff.image.url} 
              alt={staff.name} 
              className="teacher-profile-avatar-thumb"
            />
          )}
          <div>
            <p className="teacher-dashboard-tag">
              Designation: {staff?.designation || " "} — <span className="teacher-id-pill">ID: {staff?.staffId || "N/A"}</span>
            </p>
            <h1 className="teacher-dashboard-title">{staff?.name}</h1>
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
              <span className="teacher-info-value">{staff?.name}</span>
            </div>
            <div className="teacher-info-field">
              <span className="teacher-info-label">Email Address</span>
              <span className="teacher-info-value">
                {staff?.email && staff.email !== "N/A" ? staff.email : "Not Provided"}
              </span>
            </div>
            <div className="teacher-info-field">
              <span className="teacher-info-label">Contact Number</span>
              <span className="teacher-info-value">{staff?.contact}</span>
            </div>
            <div className="teacher-info-field">
              <span className="teacher-info-label">Subject</span>
              <span className="teacher-info-value teacher-subject-highlight">
                {staff?.subjectTaught || staff?.subject || "N/A"}
              </span>
            </div>
            <div className="teacher-info-field">
              <span className="teacher-info-label">Degree / Qualifications</span>
              <span className="teacher-info-value">{staff?.degree || staff?.qualification || "N/A"}</span>
            </div>
            <div className="teacher-info-field">
              <span className="teacher-info-label">Experience</span>
              <span className="teacher-info-value">
                {staff?.experience ? `${staff.experience} Years` : "N/A"}
              </span>
            </div>
            <div className="teacher-info-field">
              <span className="teacher-info-label">Account Status</span>
              <span className={`teacher-info-value status-tag-${staff?.status?.toLowerCase() || "pending"}`}>
                {staff?.status || "Pending"}
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
          teacherData={staff}
          onUpdateSuccess={(updatedStaff) =>
            setDashboard((prev) => ({
              ...prev,
              staff: {
                ...prev.staff,
                ...updatedStaff,
              },
            }))
          }
        />
      )}
    </div>
  );
};

export default StaffProfile;
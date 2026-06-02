import React, { useCallback, useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "../../components/Loader/Loader";
import VerifyModal from "./VerifyModal";
import "./StaffDetails.css";

const StaffDetails = () => {
  const { staffId } = useParams();
  const navigate = useNavigate();
  const { adminToken, backendUrl } = useContext(AdminContext);

  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStaffProfile = useCallback(async () => {
    if (!backendUrl || !staffId || !adminToken) return;

    setLoading(true);

    try {
      const { data } = await axios.get(`${backendUrl}/api/staff/${staffId}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      if (data.success) {
        setStaff(data.staff);
      }
    } catch (error) {
      console.error("Error fetching staff details:", error);
      toast.error(error.response?.data?.message || "Failed to locate profile.");
    } finally {
      setLoading(false);
    }
  }, [backendUrl, staffId, adminToken]);

  useEffect(() => {
    fetchStaffProfile();
  }, [fetchStaffProfile]);

/* ================= DELETE PROFILE ================= */
  const handleDeleteProfile = async () => {
    const confirmation = window.confirm(
      `Are you sure you want to completely delete the profile record for ${staff?.name}? This action cannot be undone.`
    );

    if (!confirmation) return;

    setActionLoading(true);
    try {
      await axios.delete(`${backendUrl}/api/staff/${staffId}`, {
        headers: { 
          Authorization: `Bearer ${adminToken}` 
        },
      });

      toast.success("Staff profile deleted successfully.");
      navigate(-1); 
      
    } catch (error) {
      console.error("Delete staff runtime execution error:", error);
      toast.error(
        error.response?.data?.message || "An error occurred while deleting the profile."
      );
    } finally {
      setActionLoading(false);
    }
  };
  if (loading) return <Loader text="Loading staff profile details..." />;

  if (!staff) {
    return (
      <div className="adm-details-error-pane">
        <div className="adm-error-card">
          <i className="fas fa-search-minus adm-error-icon"></i>
          <h3>Profile Not Found</h3>
          <p>No valid staff record found for ID: {staffId}</p>

          <button
            type="button"
            className="adm-fallback-btn"
            onClick={() => navigate(-1)}
          >
            Return to Directory
          </button>
        </div>
      </div>
    );
  }

  const avatar = staff.image?.url || "/user.png";

  return (
    <div className="adm-details-page">
      <div className="adm-details-container">
        <div className="adm-details-nav-row">
          <button
            type="button"
            className="adm-back-btn"
            onClick={() => navigate(-1)}
          >
            <i className="fas fa-arrow-left"></i>
            <span>Back</span>
          </button>

          <div className="adm-action-buttons-cluster">
            {staff.status === "Pending" && (
              <button
                type="button"
                className="adm-control-action-btn profile-verify-btn"
                onClick={() => setIsModalOpen(true)}
                disabled={actionLoading}
              >
                <i className="fas fa-check-circle"></i>
                <span>Verify Staff</span>
              </button>
            )}

            <button
              type="button"
              className="adm-control-action-btn profile-purge-btn"
              onClick={handleDeleteProfile}
              disabled={actionLoading}
            >
              <i className="fas fa-trash-alt"></i>
              <span>Delete Profile</span>
            </button>
          </div>
        </div>

        <div className="adm-details-split-grid">
          <aside className="adm-details-sidebar-card">
            <div className="adm-details-avatar-box">
              <img
                src={avatar}
                alt={staff.name}
                className="adm-details-avatar-img"
              />
            </div>

            <div className="adm-details-meta-summary">
              <h1 className="adm-profile-display-name">{staff.name}</h1>
              <p className="adm-profile-display-role">{staff.designation}</p>

              <div className="adm-profile-badges-row">
                <span className="adm-profile-pill-tag">
                  Staff ID: {staff.staffId || "Not Assigned"}
                </span>

                <span className="adm-profile-pill-tag type-pill">
                  {staff.staffType || "Staff"}
                </span>

                <span
                  className={`adm-profile-status-pill status-${staff.status?.toLowerCase()}`}
                >
                  {staff.status || "Pending"}
                </span>
              </div>
            </div>
          </aside>

          <main className="adm-details-main-stream">
            <div className="adm-profile-attribute-panel">
              <h2 className="adm-panel-section-title">
                Institutional Details
              </h2>

              <div className="adm-parameter-rows-list">
                <div className="adm-parameter-row">
                  <span className="adm-row-label">Staff Type</span>
                  <span className="adm-row-value">
                    {staff.staffType || "Not Registered"}
                  </span>
                </div>

                <div className="adm-parameter-row">
                  <span className="adm-row-label">Designation</span>
                  <span className="adm-row-value">
                    {staff.designation || "Not Registered"}
                  </span>
                </div>

                <div className="adm-parameter-row">
                  <span className="adm-row-label">
                    Academic Qualification
                  </span>
                  <span className="adm-row-value">
                    {staff.qualification || "Not Registered"}
                  </span>
                </div>

                <div className="adm-parameter-row">
                  <span className="adm-row-label">Experience</span>
                  <span className="adm-row-value">
                    {staff.experience ?? 0} Years
                  </span>
                </div>

                {staff.staffType === "Teaching" && (
                  <div className="adm-parameter-row">
                    <span className="adm-row-label">Subject Taught</span>
                    <span className="adm-row-value highlighting-cyan-text">
                      {staff.subjectTaught || "General"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="adm-profile-attribute-panel">
              <h2 className="adm-panel-section-title">Contact Details</h2>

              <div className="adm-parameter-rows-list">
                <div className="adm-parameter-row">
                  <span className="adm-row-label">Email</span>
                  <span className="adm-row-value tracking-bright-link">
                    {staff.email || "N/A"}
                  </span>
                </div>

                <div className="adm-parameter-row">
                  <span className="adm-row-label">Contact</span>
                  <span className="adm-row-value">{staff.contact || "N/A"}</span>
                </div>

                <div className="adm-parameter-row">
                  <span className="adm-row-label">Gender</span>
                  <span className="adm-row-value">{staff.gender || "N/A"}</span>
                </div>
              </div>
            </div>

            {staff.address && (
              <div className="adm-profile-attribute-panel">
                <h2 className="adm-panel-section-title">Address Details</h2>

                <div className="adm-address-quad-grid">
                  <div className="adm-address-grid-cell">
                    <span className="adm-cell-tag">Village / Town</span>
                    <span className="adm-cell-data">
                      {staff.address.village || "N/A"}
                    </span>
                  </div>

                  <div className="adm-address-grid-cell">
                    <span className="adm-cell-tag">Post Office (P.O.)</span>
                    <span className="adm-cell-data">
                      {staff.address.po || "N/A"}
                    </span>
                  </div>

                  <div className="adm-address-grid-cell">
                    <span className="adm-cell-tag">Police Station (P.S.)</span>
                    <span className="adm-cell-data">
                      {staff.address.ps || "N/A"}
                    </span>
                  </div>

                  <div className="adm-address-grid-cell">
                    <span className="adm-cell-tag">PIN Code</span>
                    <span className="adm-cell-data structural-code-badge">
                      {staff.address.pin || "N/A"}
                    </span>
                  </div>

                  <div className="adm-address-grid-cell">
                    <span className="adm-cell-tag">District</span>
                    <span className="adm-cell-data">
                      {staff.address.district || "N/A"}
                    </span>
                  </div>

                  <div className="adm-address-grid-cell">
                    <span className="adm-cell-tag">State</span>
                    <span className="adm-cell-data">
                      {staff.address.state || "Assam"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <VerifyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        staffId={staffId}
        staffName={staff.name}
        setStaff={setStaff}
      />
    </div>
  );
};

export default StaffDetails;
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "../../components/Loader/Loader";
import "./StaffDetails.css";

const StaffDetails = () => {
  const { staffId } = useParams();
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);
  
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Fetch Target Profile Payload From Server Vector ---
  const fetchProfileDetails = useCallback(async () => {
    if (!backendUrl || !staffId) return;
    setLoading(true);
    try {
      // Directed straight to your admin/management lookup endpoint block
      const { data } = await axios.get(`${backendUrl}/api/staff/${staffId}`);
      if (data.success) {
        setStaff(data.staff);
      } else {
        toast.error(data.message || "Could not retrieve records.");
      }
    } catch (error) {
      console.error("Staff Details fetching runtime sequence anomaly:", error);
      toast.error(error.response?.data?.message || "Profile record trace not found.");
    } finally {
      setLoading(false);
    }
  }, [backendUrl, staffId]);

  useEffect(() => {
    fetchProfileDetails();
  }, [fetchProfileDetails]);

  if (loading) {
    return (
      <div className="staff-details-loading-pane">
        <Loader />
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="staff-details-error-pane">
        <div className="error-card">
          <i className="fas fa-exclamation-triangle error-icon"></i>
          <h3>Profile Record Unavailable</h3>
          <p>The system trace could not find matching parameter tracking strings for ID: {staffId}</p>
          <button type="button" className="details-back-btn" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Fallback structure handler maps
  const profileImage = staff.image?.url || "/user.png";
  const experienceDisplay = staff.experience !== undefined ? `${staff.experience} Years` : "Not Stated";

  return (
    <div className="staff-details-page">
      <Helmet>
        <title>{`${staff.name} | Faculty Profile`}</title>
        <meta name="description" content={`View structural qualification, credentials, and details for ${staff.name} at Nashib Ali Academy.`} />
      </Helmet>

      <div className="details-container">

        {/* Profile Card Matrix Layout */}
        <div className="profile-master-grid">
          
          {/* COLUMN Left: Core Image Card Canvas */}
          <div className="profile-aside-column">
            <div className="aside-image-card">
              <div className="aside-image-wrapper">
                <img src={profileImage} alt={staff.name} className="aside-avatar" />
              </div>
              <div className="aside-header-text">
                <h1 className="aside-name">{staff.name}</h1>
                <p className="aside-tag-designation">{staff.designation}</p>
                <span className={`aside-type-badge type-${staff.staffType?.toLowerCase().replace(" ", "-")}`}>
                  {staff.staffType} Faculty
                </span>
              </div>
            </div>
          </div>

          {/* COLUMN Right: Granular Operational Data Fields Stream */}
          <div className="profile-main-column">
            
            {/* CARD AREA 1: PROFESSIONAL PARAMETERS SUMMARY */}
            <div className="profile-details-section-card">
              <h2 className="section-card-title">Professional Profile</h2>
              
              <div className="details-parameters-list">
                <div className="parameter-data-row">
                  <span className="row-label">Qualification</span>
                  <span className="row-value">{staff.qualification || "Not Disclosed"}</span>
                </div>
                <div className="parameter-data-row">
                  <span className="row-label">Experience</span>
                  <span className="row-value">{experienceDisplay}</span>
                </div>

                {staff.staffType === "Teaching" && (
                  <div className="parameter-data-row">
                    <span className="row-label">Subject Taught</span>
                    <span className="row-value subject-specialty-highlight">{staff.subjectTaught || "General Studies"}</span>
                  </div>
                )}
              </div>
            </div>

            {/* CARD AREA 2: VERIFIED CONTACT CREDENTIAL CHANNELS */}
            <div className="profile-details-section-card">
              <h2 className="section-card-title">Contact & Communication</h2>
              
              <div className="details-parameters-list">
                <div className="parameter-data-row">
                  <span className="row-label">Email Address</span>
                  <span className="row-value contact-link-value">{staff.email || "N/A"}</span>
                </div>

                <div className="parameter-data-row">
                  <span className="row-label">Contact</span>
                  <span className="row-value">{staff.contact || "N/A"}</span>
                </div>

                <div className="parameter-data-row">
                  <span className="row-label">Gender</span>
                  <span className="row-value">{staff.gender || "Not Stated"}</span>
                </div>
              </div>
            </div>

            {/* CARD AREA 3: NESTED PHYSICAL RESIDENTIAL ADDRESS OBJECT FIELD MAP */}
            {staff.address && (
              <div className="profile-details-section-card">
                <h2 className="section-card-title">Address Details</h2>
                
                <div className="address-details-block-grid">
                  <div className="address-grid-item">
                    <span className="address-item-label">Village / Town</span>
                    <span className="address-item-value">{staff.address.village || "N/A"}</span>
                  </div>

                  <div className="address-grid-item">
                    <span className="address-item-label">Post Office (P.O.)</span>
                    <span className="address-item-value">{staff.address.po || "N/A"}</span>
                  </div>

                  <div className="address-grid-item">
                    <span className="address-item-label">Police Station (P.S.)</span>
                    <span className="address-item-value">{staff.address.ps || "N/A"}</span>
                  </div>

                  <div className="address-grid-item">
                    <span className="address-item-label">PIN Code</span>
                    <span className="address-item-value inline-code-pin">{staff.address.pin || "N/A"}</span>
                  </div>

                  <div className="address-grid-item">
                    <span className="address-item-label">District</span>
                    <span className="address-item-value">{staff.address.district || "N/A"}</span>
                  </div>

                  <div className="address-grid-item">
                    <span className="address-item-label">State Territory</span>
                    <span className="address-item-value">{staff.address.state || "Assam"}</span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default StaffDetails;
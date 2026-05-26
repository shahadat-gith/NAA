import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../components/Loader/Loader";

import { AdminContext } from "../../context/AdminContext";
import "./TeacherDetails.css";

const TeacherDetails = () => {
  const { teacherId } = useParams();
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [teacher, setTeacher] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  const fetchTeacher = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${backendUrl}/api/teacher/details/${teacherId}`,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );

      if (data.success) {
        setTeacher(data.teacher);
      } else {
        toast.error(data.message || "Teacher not found");
      }
    } catch (error) {
      console.error("Fetch teacher error:", error);
      toast.error("Error fetching teacher profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacher();
  }, [teacherId]);

  if (loading) {
    return <Loader text="loading details..."/>;
  }

  if (!teacher) {
    return (
      <div className="td-error-container">
        <p>Teacher profile not found.</p>
      </div>
    );
  }

  // Helper safely pulling image URL from nested asset scheme
  const profileImageUrl = teacher.image?.url || "/user.png";

  return (
    <div className="td-container">
      {/* ===== HEADER ===== */}
      <div className="td-header">
        <div className="td-avatar-content">
          <div className="td-avatar-img">
            <img
              src={profileImageUrl}
              alt={teacher.name}
              className="td-avatar-image"
              onError={(e) => (e.target.src = "/default-avatar.png")}
            />
          </div>

          <div className="td-avatar-name">
            <div className="td-name-badge-row">
              <h1 className="td-teacher-name">{teacher.name}</h1>
              <span className={`td-status-badge td-status-${teacher.status?.toLowerCase() || "pending"}`}>
                {teacher.status || "Pending"}
              </span>
            </div>
            <p className="td-teacher-title">
              {teacher.designation || "Assistant Teacher"} — <span className="td-highlight-text">{teacher.degree}</span>
            </p>
          </div>

          <div className="td-teacher-experience">
            <h4>
              {teacher.experience !== undefined
                ? `${teacher.experience} Years Experience`
                : "Experience not specified"}
            </h4>
            <p className="td-meta-id">ID: {teacher.teacherId || "Unassigned"}</p>
          </div>
        </div>
      </div>

      {/* ===== NAV ===== */}
      <div className="td-nav">
        <ul className="td-nav-tabs">
          <li className={activeTab === "overview" ? "td-active" : ""}>
            <button onClick={() => setActiveTab("overview")}>Overview</button>
          </li>
          <li className={activeTab === "address" ? "td-active" : ""}>
            <button onClick={() => setActiveTab("address")}>Address Info</button>
          </li>
        </ul>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="td-content">
        {activeTab === "overview" && <OverviewTab teacher={teacher} />}
        {activeTab === "address" && <AddressTab address={teacher.address} />}
      </div>
    </div>
  );
};


const OverviewTab = ({ teacher }) => {
  return (
    <div className="td-overview-tab">
      <div className="td-card td-teacher-info-card">
        <h2 className="td-card-title">Professional & Academic Information</h2>

        <div className="td-card-content">
          <div className="td-info-table">
            <div className="td-info-row">
              <span className="td-info-label">Subject</span>
              <span className="td-info-value td-value-highlight">
                {teacher.subjectTaught || "N/A"}
              </span>
            </div>

            <div className="td-info-row">
              <span className="td-info-label">Current Designation</span>
              <span className="td-info-value">{teacher.designation || "Assistant Teacher"}</span>
            </div>

            <div className="td-info-row">
              <span className="td-info-label">Qualifications</span>
              <span className="td-info-value">{teacher.degree || "N/A"}</span>
            </div>

            <div className="td-info-row">
              <span className="td-info-label">Total Experience</span>
              <span className="td-info-value">{teacher.experience} Years</span>
            </div>

            <div className="td-info-row">
              <span className="td-info-label">Email Address</span>
              <span className="td-info-value">
                {teacher.email && teacher.email !== "not available" && teacher.email !== "n/a"
                  ? teacher.email
                  : "Not Provided"}
              </span>
            </div>

            <div className="td-info-row">
              <span className="td-info-label">Contact Number</span>
              <span className="td-info-value">{teacher.contact || "N/A"}</span>
            </div>

            <div className="td-info-row">
              <span className="td-info-label">Gender</span>
              <span className="td-info-value">{teacher.gender || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const AddressTab = ({ address }) => {
  if (!address) {
    return (
      <div className="td-card">
        <p className="td-no-data">No residential addresses mapped to database file records.</p>
      </div>
    );
  }

  return (
    <div className="td-address-tab">
      <div className="td-card">
        <h2 className="td-card-title">Residential Address</h2>
        <div className="td-card-content">
          <div className="td-info-table">
            <div className="td-info-row">
              <span className="td-info-label">Village / Town</span>
              <span className="td-info-value">{address.village || "N/A"}</span>
            </div>
            <div className="td-info-row">
              <span className="td-info-label">Post Office (P.O.)</span>
              <span className="td-info-value">{address.po || "N/A"}</span>
            </div>
            <div className="td-info-row">
              <span className="td-info-label">Police Station (P.S.)</span>
              <span className="td-info-value">{address.ps || "N/A"}</span>
            </div>
            <div className="td-info-row">
              <span className="td-info-label">District</span>
              <span className="td-info-value">{address.district || "N/A"}</span>
            </div>
            <div className="td-info-row">
              <span className="td-info-label">PIN Code</span>
              <span className="td-info-value td-pin-code">{address.pin || "N/A"}</span>
            </div>
            <div className="td-info-row">
              <span className="td-info-label">State</span>
              <span className="td-info-value">{address.state || "Assam"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetails;
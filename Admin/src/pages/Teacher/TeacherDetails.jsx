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
        `${backendUrl}/api/teacher/teacher/${teacherId}`,
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

  const formatSubjects = (mappings) => {
    if (!mappings || mappings.length === 0) return "N/A";
    return mappings.map((m) => m.subject).join(", ");
  };

  return (
    <div className="td-container">
      {/* ===== HEADER ===== */}
      <div className="td-header">
        <div className="td-avatar-content">
          <div className="td-avatar-img">
            <img
              src={teacher.image}
              alt={teacher.name}
              className="td-avatar-image"
              onError={(e) => (e.target.src = "/default-avatar.png")}
            />
          </div>

          <div className="td-avatar-name">
            <h1 className="td-teacher-name">{teacher.name}</h1>
            <p className="td-teacher-title">
              {teacher.degree || "Qualification not available"}
            </p>
          </div>

          <div className="td-teacher-experience">
            <h4>
              {teacher.experience
                ? `${teacher.experience} years experience`
                : "Experience not specified"}
            </h4>
          </div>
        </div>
      </div>

      {/* ===== NAV ===== */}
      <div className="td-nav">
        <ul className="td-nav-tabs">
          <li className={activeTab === "overview" ? "td-active" : ""}>
            <button onClick={() => setActiveTab("overview")}>
              Overview
            </button>
          </li>
        </ul>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="td-content">
        {activeTab === "overview" && (
          <OverviewTab
            teacher={{
              ...teacher,
              subjects: formatSubjects(teacher.subjectClassMappings),
            }}
          />
        )}
      </div>
    </div>
  );
};

/* =====================================================
   Overview Tab Component
===================================================== */

const OverviewTab = ({ teacher }) => {
  const formatSubjectClassMappings = (mappings) => {
    if (!mappings || mappings.length === 0) return "N/A";

    return mappings
      .map(
        (mapping) =>
          `${mapping.subject} (${mapping.classes.join(", ")})`
      )
      .join(" | ");
  };

  return (
    <div className="td-overview-tab">
      {/* ===== Teacher Information ===== */}
      <div className="td-card td-teacher-info-card">
        <h2 className="td-card-title">Teacher Information</h2>

        <div className="td-card-content">
          <div className="td-info-table">
            <div className="td-info-row">
              <span className="td-info-label">Subjects & Classes</span>
              <span className="td-info-value">
                {formatSubjectClassMappings(
                  teacher.subjectClassMappings
                )}
              </span>
            </div>

            <div className="td-info-row">
              <span className="td-info-label">Qualification</span>
              <span className="td-info-value">
                {teacher.degree || "N/A"}
              </span>
            </div>

            <div className="td-info-row">
              <span className="td-info-label">Experience</span>
              <span className="td-info-value">
                {teacher.experience
                  ? `${teacher.experience} years`
                  : "N/A"}
              </span>
            </div>

            <div className="td-info-row">
              <span className="td-info-label">Email</span>
              <span className="td-info-value">
                {teacher.email && teacher.email !== "N/A"
                  ? teacher.email
                  : "Not Available"}
              </span>
            </div>

            <div className="td-info-row">
              <span className="td-info-label">Contact</span>
              <span className="td-info-value">
                {teacher.contact || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Quick Summary ===== */}
      <div className="td-stats-grid">
        <div className="td-card td-stats-card">
          <span className="td-stats-card-title">Subjects</span>
          <span className="td-stats-card-value">
            {teacher.subjectClassMappings?.length || 0}
          </span>
          <span className="td-stats-card-label">Assigned</span>
        </div>

        <div className="td-card td-stats-card">
          <span className="td-stats-card-title">Handles</span>
          <span className="td-stats-card-value">
            {teacher.subjectClassMappings?.reduce(
              (total, m) => total + m.classes.length,
              0
            ) || 0}
          </span>
          <span className="td-stats-card-label">Classes</span>
        </div>

        <div className="td-card td-stats-card">
          <span className="td-stats-card-title">Experience</span>
          <span className="td-stats-card-value">
            {teacher.experience || 0}
          </span>
          <span className="td-stats-card-label">Years</span>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetails;
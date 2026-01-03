import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import "./TeacherProfile.css";
import axios from "axios";
import toast from "react-hot-toast";

import { AdminContext } from "../../../context/AdminContext";
import OverViewTab from "./Components/OverViewTab";

const TeacherProfile = () => {
  const { teacherId } = useParams();
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [teacher, setTeacher] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH TEACHER ================= */

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

  /* ================= LOADING / ERROR ================= */

  if (loading) {
    return <div className="teacher-profile-loading">Loading...</div>;
  }

  if (!teacher) {
    return (
      <div className="error-container">
        <p>Teacher profile not found.</p>
      </div>
    );
  }

  /* ================= HELPERS ================= */

  const formatSubjects = (mappings) => {
    if (!mappings || mappings.length === 0) return "N/A";
    return mappings.map((m) => m.subject).join(", ");
  };

  /* ================= UI ================= */

  return (
    <div className="teacher-profile-container">
      {/* ===== HEADER ===== */}
      <div className="profile-header">
        <div className="profile-avatar-content">
          <div className="profile-avatar-img">
            <img
              src={teacher.image}
              alt={teacher.name}
              className="avatar-image"
              onError={(e) => (e.target.src = "/default-avatar.png")}
            />
          </div>

          <div className="profile-avatar-name">
            <h1 className="teacher-name">{teacher.name}</h1>
            <p className="teacher-title">
              {teacher.degree || "Qualification not available"}
            </p>
          </div>

          <div className="profile-avatar-teacher-experience">
            <h4>
              {teacher.experience
                ? `${teacher.experience} years experience`
                : "Experience not specified"}
            </h4>
          </div>
        </div>
      </div>

      {/* ===== NAV ===== */}
      <div className="profile-nav">
        <ul className="nav-tabs">
          <li className={activeTab === "overview" ? "active" : ""}>
            <button onClick={() => setActiveTab("overview")}>
              Overview
            </button>
          </li>
        </ul>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="profile-content">
        {activeTab === "overview" && (
          <OverViewTab
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

export default TeacherProfile;

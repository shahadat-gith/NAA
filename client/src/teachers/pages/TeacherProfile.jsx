import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import "../styles/TeacherProfile.css";

const TeacherProfile = () => {
  const { backendUrl } = useContext(AppContext);
  const [teacher, setTeacher] = useState(null);
  const [form, setForm] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("teacherToken");
  const navigate = useNavigate();

  useEffect(() => {
    const loadTeacher = async () => {
      if (!token) {
        setError("Please log in as a teacher to access your profile.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${backendUrl}/api/auth/teacher/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTeacher(response.data.data);
        setForm({
          name: response.data.data.name || "",
          email: response.data.data.email || "",
          contact: response.data.data.contact || "",
          degree: response.data.data.degree || "",
          experience: response.data.data.experience || "",
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load teacher profile. Please check your login and try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (backendUrl) {
      loadTeacher();
    }
  }, [backendUrl, token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    setTeacher((prev) => ({
      ...prev,
      name: form.name,
      email: form.email,
      contact: form.contact,
      degree: form.degree,
      experience: Number(form.experience),
    }));
    setEditMode(false);
  };

  const handleCancel = () => {
    setForm({
      name: teacher.name || "",
      email: teacher.email || "",
      contact: teacher.contact || "",
      degree: teacher.degree || "",
      experience: teacher.experience || "",
    });
    setEditMode(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("teacherToken");
    navigate("/teacher/login");
  };

  const missingFields = [
    !form.email && "Email",
    !form.contact && "Contact",
    !form.degree && "Degree",
    form.experience === "" && "Experience",
  ].filter(Boolean);

  if (loading) {
    return <div className="teacher-empty-card">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="teacher-error-card">
        <h2>Unable to load profile</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="teacher-profile-page">
      <div className="teacher-profile-header">
        <div>
          <p className="teacher-dashboard-tag">My Profile</p>
          <h1 className="teacher-dashboard-title">{teacher.name}</h1>
          <p className="teacher-dashboard-subtitle">
            Update any missing details and keep your profile current.
          </p>
        </div>
        <button className="teacher-profile-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="teacher-profile-body">
        <section className="teacher-card teacher-profile-summary">
          <div className="teacher-card-header">
            <h2>Details</h2>
            <button
              className="teacher-button-secondary"
              type="button"
              onClick={() => setEditMode((prev) => !prev)}
            >
              {editMode ? "Preview" : "Edit profile"}
            </button>
          </div>

          {missingFields.length > 0 && !editMode && (
            <div className="teacher-alert">
              Missing details: {missingFields.join(", ")}. Click edit to update.
            </div>
          )}

          <form className="teacher-profile-form" onSubmit={handleSave}>
            <div className="teacher-form-grid">
              <label>
                Name
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </label>
              <label>
                Email
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </label>
              <label>
                Contact
                <input
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </label>
              <label>
                Degree
                <input
                  name="degree"
                  value={form.degree}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </label>
              <label>
                Experience
                <input
                  type="number"
                  min="0"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </label>
            </div>

            <div className="teacher-form-meta">
              <div>
                <p className="teacher-meta-label">Assigned subjects</p>
                <div className="teacher-tags-row">
                  {teacher.subjectClassMappings?.map((mapping, index) => (
                    <span key={index} className="teacher-tag">
                      {mapping.subject}
                    </span>
                  )) || <span className="teacher-tag">No subjects assigned</span>}
                </div>
              </div>
            </div>

            {editMode && (
              <div className="teacher-form-actions">
                <button type="button" className="teacher-button-secondary" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="teacher-button-primary">
                  Save changes
                </button>
              </div>
            )}
          </form>
        </section>

        <section className="teacher-card teacher-profile-sidebar">
          <h2>Profile snapshot</h2>
          <div className="teacher-profile-grid">
            <div>
              <p className="teacher-meta-label">Teacher ID</p>
              <strong>{teacher._id}</strong>
            </div>
            <div>
              <p className="teacher-meta-label">Experience</p>
              <strong>{teacher.experience} years</strong>
            </div>
            <div>
              <p className="teacher-meta-label">Contact</p>
              <strong>{teacher.contact}</strong>
            </div>
            <div>
              <p className="teacher-meta-label">Subjects</p>
              <strong>{teacher.subjectClassMappings?.length || 0}</strong>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TeacherProfile;

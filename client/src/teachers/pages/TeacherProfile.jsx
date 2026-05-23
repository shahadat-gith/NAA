import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { useOutletContext } from "react-router-dom";
import "../styles/TeacherProfile.css";

const TeacherProfile = () => {
  const { backendUrl } = useContext(AppContext);
  const [teacher, setTeacher] = useOutletContext();
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    degree: "",
    experience: "",
  });

  // Dedicated states for asset uploads and binary layout strings
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const token = localStorage.getItem("teacher-token");

  // Sync state configurations on mount or contextual updates
  useEffect(() => {
    if (teacher) {
      setForm({
        name: teacher.name || "",
        email: teacher.email || "N/A",
        contact: teacher.contact || "",
        degree: teacher.degree || "",
        experience: teacher.experience !== undefined ? teacher.experience : "",
      });
      setImagePreview(teacher.image || "");
      setImageFile(null);
    }
  }, [teacher]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Intercept selected local file and paint temporary binary preview context
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Compiled payload inside multi-part standard format to handle image transfer
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("contact", form.contact);
      formData.append("degree", form.degree);
      formData.append("experience", Number(form.experience));
      
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await axios.put(
        `${backendUrl}/api/teacher/update-profile`,
        formData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          },
        }
      );

      if (response.data.success) {
        setTeacher(response.data.updatedTeacher);
        setEditMode(false);
      } else {
        setError(response.data.message || "Failed to update profile details.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while saving profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (teacher) {
      setForm({
        name: teacher.name || "",
        email: teacher.email || "",
        contact: teacher.contact || "",
        degree: teacher.degree || "",
        experience: teacher.experience || "",
      });
      setImagePreview(teacher.image || "");
      setImageFile(null);
    }
    setError(null);
    setEditMode(false);
  };

  if (!teacher) {
    return (
      <div className="teacher-profile-loading">
        <p>Loading profile configurations...</p>
      </div>
    );
  }

  return (
    <div className="teacher-profile-page">
      <div className="teacher-profile-header">
        <div>
          <p className="teacher-dashboard-tag">My Profile</p>
          <h1 className="teacher-dashboard-title">{teacher.name}</h1>
        </div>
      </div>

      <div className="teacher-profile-body">
        <form className="teacher-profile-form" onSubmit={handleSave}>
          
          {/* Avatar Profile Box */}
          <section className="teacher-card teacher-profile-avatar-sec">
            <div className="teacher-avatar-uploader">
              <div className="teacher-avatar-frame">
                <img src={imagePreview || "/logo.png"} alt="Profile Preview" className="teacher-avatar-img" />
                {editMode && (
                  <label className="teacher-avatar-label-overlay">
                    <span>Change Photo</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} hidden disabled={loading} />
                  </label>
                )}
              </div>
              <div className="teacher-avatar-meta-text">
                <h3>{form.name || "Teacher Profile"}</h3>
                <p>{form.degree || "Degree credentials assignment"}</p>
              </div>
              
              {!editMode && (
                <button
                  className="teacher-button-secondary teacher-edit-trigger-btn"
                  type="button"
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </section>

          {/* Account Form Data Fields */}
          <section className="teacher-card">
            <div className="teacher-card-header">
              <h2>Account Details</h2>
            </div>

            {error && <div className="teacher-alert teacher-alert--error">{error}</div>}

            <div className="teacher-form-grid">
              <label className="teacher-form-label">
                Name
                <input type="text" name="name" value={form.name} onChange={handleChange} disabled={!editMode || loading} required />
              </label>
              <label className="teacher-form-label">
                Email
                <input type="email" name="email" value={form.email} onChange={handleChange} disabled={!editMode || loading} />
              </label>
              <label className="teacher-form-label">
                Contact
                <input type="text" name="contact" value={form.contact} onChange={handleChange} disabled={!editMode || loading} required />
              </label>
              <label className="teacher-form-label">
                Degree
                <input type="text" name="degree" value={form.degree} onChange={handleChange} disabled={!editMode || loading} required />
              </label>
              <label className="teacher-form-label">
                Experience (Years)
                <input type="number" min="0" name="experience" value={form.experience} onChange={handleChange} disabled={!editMode || loading} required />
              </label>
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

          {/* Persistent Action Save Options Layout */}
          {editMode && (
            <div className="teacher-form-actions-sticky">
              <button type="button" className="teacher-button-secondary" onClick={handleCancel} disabled={loading}>
                Cancel Changes
              </button>
              <button type="submit" className="teacher-button-primary" disabled={loading}>
                {loading ? "Processing..." : "Save All Updates"}
              </button>
            </div>
          )}

        </form>
      </div>
    </div>
  );
};

export default TeacherProfile;
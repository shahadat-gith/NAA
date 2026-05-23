import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import "../styles/ProfileUpdateModal.css"

const ProfileUpdateModal = ({ isOpen, onClose, teacherData, onUpdateSuccess }) => {
  const { backendUrl } = useContext(AppContext);
  const token = localStorage.getItem("teacher-token");

  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    degree: "",
    experience: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && teacherData) {
      setForm({
        name: teacherData.name || "",
        email: teacherData.email && teacherData.email !== "N/A" ? teacherData.email : "",
        contact: teacherData.contact || "",
        degree: teacherData.degree || "",
        experience: teacherData.experience !== undefined ? teacherData.experience : "",
      });
      setImagePreview(teacherData.image || "");
      setImageFile(null);
    }
  }, [isOpen, teacherData]);

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Must use FormData format to ship binary asset files to Node/Express
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email || "N/A");
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
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.success) {
        toast.success(response.data.message || "Profile updated successfully!");
        onUpdateSuccess(response.data.updatedTeacher); // Sync changes downstream globally
        onClose(); // Shut down modal window overlay frame
      } else {
        toast.error(response.data?.message || "Failed to save data variations.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred while saving profile changes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="teacher-modal-backdrop" onClick={onClose}>
      <div className="teacher-modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Window Header */}
        <div className="teacher-modal-header">
          <h2>Modify Profile Details</h2>
          <button type="button" className="teacher-modal-close-btn" onClick={onClose} disabled={loading}>
            <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="teacher-modal-form">
          
          {/* Uploader Block Area */}
          <div className="teacher-modal-avatar-uploader">
            <div className="teacher-modal-avatar-frame">
              <img src={imagePreview || "/logo.png"} alt="Preview Avatar" className="teacher-modal-avatar-img" />
              <label className="teacher-modal-avatar-overlay">
                <span>Upload</span>
                <input type="file" accept="image/*" onChange={handleImageChange} disabled={loading} hidden />
              </label>
            </div>
            <div className="teacher-modal-uploader-text">
              <p className="upload-title">Profile Picture Photo</p>
              <p className="upload-subtitle">Click frame to replace image (PNG, JPG, or WEBP)</p>
            </div>
          </div>

          {/* Core Input Field Control Grid Layout */}
          <div className="teacher-modal-inputs-grid">
            <label className="teacher-form-label">
              Full Name
              <input type="text" name="name" value={form.name} onChange={handleChange} disabled={loading} required />
            </label>
            <label className="teacher-form-label">
              Email Address
              <input type="email" name="email" value={form.email} onChange={handleChange} disabled={loading} />
            </label>
            <label className="teacher-form-label">
              Contact Number
              <input type="text" name="contact" value={form.contact} onChange={handleChange} disabled={loading} required />
            </label>
            <label className="teacher-form-label">
              Academic Degree Credentials
              <input type="text" name="degree" value={form.degree} onChange={handleChange} disabled={loading} required />
            </label>
            <label className="teacher-form-label">
              Teaching Experience (Years)
              <input type="number" min="0" name="experience" value={form.experience} onChange={handleChange} disabled={loading} required />
            </label>
          </div>

          {/* Action Operations Tray */}
          <div className="teacher-modal-actions">
            <button type="button" className="teacher-button-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="teacher-button-primary" disabled={loading}>
              {loading ? "Saving Changes..." : "Save updates"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ProfileUpdateModal;
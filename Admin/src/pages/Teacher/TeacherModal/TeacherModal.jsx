import React, { useState, useRef, useEffect, useContext } from "react";
import "./TeacherModal.css";
import axios from "axios";
import toast from 'react-hot-toast';
import { AdminContext } from "../../../context/AdminContext";
import { TeacherContext } from "../../../context/TeacherContext";

const TeacherModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [degree, setDegree] = useState("");
  const [contact, setContact] = useState("");
  const [experience, setExperience] = useState("");
  const [salary, setSalary] = useState("");
  const [teacher_image, setTeacher_Image] = useState(null);
  const [dueBalance, setDueBalance] = useState(0);
  const [subjectClassMappings, setSubjectClassMappings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef(null);
  const { backendUrl, adminToken } = useContext(AdminContext);
  const { getAllTeachers } = useContext(TeacherContext);

  const subjects = [
    "Mathematics", "Advanced Mathematics", "Physics", "Chemistry", "Biology",
    "Assamese", "Advance Assamese", "English", "Alternative English", "Geography",
    "Education", "Political Science", "History", "Arabic", "Social Studies",
    "Computer", "Garments Design", "Drawing", "Drawing/Handwriting", "General Science",
    "GK", "EVS", "Hindi", "Retail Management"
  ];

  const classes = [
    "Nursery", "KG", "Ankur", "Mukul", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
    "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"
  ];

  const addSubjectClassMapping = () => {
    setSubjectClassMappings([...subjectClassMappings, { subject: "", classes: [] }]);
  };

  const removeSubjectClassMapping = (index) => {
    const updated = subjectClassMappings.filter((_, i) => i !== index);
    setSubjectClassMappings(updated);
  };

  const updateSubjectInMapping = (index, subject) => {
    const updated = [...subjectClassMappings];
    updated[index].subject = subject;
    setSubjectClassMappings(updated);
  };

  const updateClassesInMapping = (index, className) => {
    const updated = [...subjectClassMappings];
    const classes = updated[index].classes;
    updated[index].classes = classes.includes(className)
      ? classes.filter(c => c !== className)
      : [...classes, className];
    setSubjectClassMappings(updated);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setTeacher_Image(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      setProgress(0);
    } else {
      setTeacher_Image(null);
      setImagePreview(null);
      setProgress(0);
      if (file) {
        toast.error("Please select a valid image file!");
      }
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!teacher_image || !(teacher_image instanceof File)) {
      toast.error("Please select a valid image file!");
      return;
    }

    if (subjectClassMappings.length === 0) {
      toast.error("Please add at least one subject-class mapping!");
      return;
    }

    if (!experience || Number(experience) < 0 || !Number.isInteger(Number(experience))) {
      toast.error("Please enter a valid number of years of experience!");
      return;
    }

    const isValid = subjectClassMappings.every(mapping =>
      mapping.subject && Array.isArray(mapping.classes) && mapping.classes.length > 0
    );

    if (!isValid) {
      toast.error("Please complete all subject-class mappings!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("contact", contact);
      formData.append("degree", degree);
      formData.append("experience", Number(experience));
      formData.append("salary", Number(salary));
      formData.append("image", teacher_image);
      formData.append("dueBalance", Number(dueBalance));
      formData.append("subjectClassMappings", JSON.stringify(subjectClassMappings));

      // Debug FormData contents
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const { data } = await axios.post(`${backendUrl}/api/teacher/add-teacher`, formData, {
        headers: { 
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'multipart/form-data'
        },
      });

      if (data.success) {
        toast.success(data.message);
        setName("");
        setEmail("");
        setContact("");
        setDegree("");
        setExperience("");
        setSalary("");
        setTeacher_Image(null);
        setImagePreview(null);
        setDueBalance(0);
        setSubjectClassMappings([]);
        setProgress(0);
        getAllTeachers();
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        onClose();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Upload cancelled:", error.message);
      } else {
        console.error("Error in addTeacher:", error);
        toast.error(error.response?.data?.message || "Failed to add teacher");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="naa-teacher-modal-overlay" onClick={onClose}>
      <div className="naa-teacher-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="naa-modal-header">
          <div className="naa-modal-title">
            <div className="naa-user-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2>Add New Teacher</h2>
          </div>
          <button className="naa-close-button" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="naa-modal-content">
          <form onSubmit={handleSubmit} className="naa-teacher-form">
            {/* Profile Image Section */}
            <div className="naa-image-upload-section">
              <div className="naa-image-preview-container">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="naa-image-preview" />
                ) : (
                  <div className="naa-image-placeholder">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
                <button
                  type="button"
                  className="naa-upload-button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="7,10 12,5 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="12" y1="5" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                className="naa-hidden-input"
                required
              />
              <p className="naa-upload-text">Click to upload profile image</p>
            </div>

            {/* Basic Information */}
            <div className="naa-form-section">
              <h3 className="naa-section-title">Basic Information</h3>
              <div className="naa-form-grid">
                <div className="naa-form-group">
                  <label htmlFor="teacher-name">Teacher Name <span className="naa-required">*</span></label>
                  <div className="naa-input-with-icon">
                    <svg className="naa-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <input
                      type="text"
                      id="teacher-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter teacher name"
                      required
                    />
                  </div>
                </div>

                <div className="naa-form-group">
                  <label htmlFor="teacher-email">Email Address <span className="naa-required">*</span></label>
                  <div className="naa-input-with-icon">
                    <svg className="naa-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <input
                      type="email"
                      id="teacher-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                </div>

                <div className="naa-form-group">
                  <label htmlFor="teacher-contact">Contact Number <span className="naa-required">*</span></label>
                  <div className="naa-input-with-icon">
                    <svg className="naa-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <input
                      type="tel"
                      id="teacher-contact"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="Enter contact number"
                      required
                    />
                  </div>
                </div>

                <div className="naa-form-group">
                  <label htmlFor="teacher-degree">Qualification/Degree <span className="naa-required">*</span></label>
                  <div className="naa-input-with-icon">
                    <svg className="naa-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 10v6M6 6l8-4 8 4-8 4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M2 17h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M6 17v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <input
                      type="text"
                      id="teacher-degree"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      placeholder="Enter qualification/degree"
                      required
                    />
                  </div>
                </div>

                <div className="naa-form-group">
                  <label htmlFor="teacher-experience">Experience (Years) <span className="naa-required">*</span></label>
                  <div className="naa-input-with-icon">
                    <svg className="naa-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <input
                      type="text"
                      id="teacher-experience"
                      value={experience}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                          setExperience(value);
                        }
                      }}
                      placeholder="Enter years of experience (0-100)"
                      required
                    />
                  </div>
                </div>

                <div className="naa-form-group">
                  <label htmlFor="teacher-salary">Monthly Salary <span className="naa-required">*</span></label>
                  <div className="naa-input-with-icon">
                    <svg className="naa-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <input
                      type="text"
                      id="teacher-salary"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      placeholder="Enter monthly salary"
                      required
                    />
                  </div>
                </div>

                <div className="naa-form-group">
                  <label htmlFor="due-balance">Due Balance <span className="naa-required">*</span></label>
                  <div className="naa-input-with-icon">
                    <svg className="naa-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="1" y="5" width="22" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <line x1="1" y1="10" x2="23" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <input
                      type="text"
                      id="due-balance"
                      value={dueBalance}
                      onChange={(e) => setDueBalance(e.target.value)}
                      placeholder="Enter due balance"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Subject & Class Assignment */}
            <div className="naa-form-section">
              <div className="naa-section-header">
                <h3 className="naa-section-title">Subject & Class Assignment</h3>
                <button
                  type="button"
                  className="naa-add-subject-btn"
                  onClick={addSubjectClassMapping}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Add Subject
                </button>
              </div>

              {subjectClassMappings.map((mapping, index) => (
                <div key={index} className="naa-subject-mapping-card">
                  <div className="naa-mapping-header">
                    <h4>Subject #{index + 1}</h4>
                    <button
                      type="button"
                      className="naa-remove-btn"
                      onClick={() => removeSubjectClassMapping(index)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="10" y1="11" x2="10" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="14" y1="11" x2="14" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Remove
                    </button>
                  </div>

                  <div className="naa-form-group">
                    <label>Select Subject <span className="naa-required">*</span></label>
                    <select
                      value={mapping.subject}
                      onChange={(e) => updateSubjectInMapping(index, e.target.value)}
                      required
                    >
                      <option value="">Choose a subject</option>
                      {subjects.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="naa-form-group">
                    <label>Select Classes <span className="naa-required">*</span></label>
                    <div className="naa-classes-grid">
                      {classes.map((className) => (
                        <button
                          key={className}
                          type="button"
                          className={`naa-class-btn ${mapping.classes.includes(className) ? 'naa-selected' : ''}`}
                          onClick={() => updateClassesInMapping(index, className)}
                        >
                          {className}
                          {mapping.classes.includes(className) && (
                            <svg className="naa-check-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {subjectClassMappings.length === 0 && (
                <div className="naa-empty-state">
                  <p>No subjects added yet. Click "Add Subject" to get started.</p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="naa-form-actions">
              <button type="submit" className="naa-submit-btn" disabled={loading}>
                {loading ? (
                  <div className="naa-spinner"></div>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Add Teacher
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherModal;
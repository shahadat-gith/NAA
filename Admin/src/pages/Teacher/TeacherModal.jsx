import React, { useState, useRef, useContext, useEffect } from "react";
import "./TeacherModal.css";
import axios from "axios";
import toast from "react-hot-toast";
import { AdminContext } from "../../context/AdminContext";

const TeacherModal = ({ isOpen, onClose }) => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [degree, setDegree] = useState("");
  const [contact, setContact] = useState("");
  const [experience, setExperience] = useState("");
  const [teacherImage, setTeacherImage] = useState(null);
  const [subjectClassMappings, setSubjectClassMappings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const fileInputRef = useRef(null);

  /* ================= SUBJECT & CLASS ================= */

  const subjects = [
    "Mathematics", "Advanced Mathematics", "Physics", "Chemistry", "Biology",
    "Assamese", "Advance Assamese", "English", "Alternative English",
    "Geography", "Education", "Political Science", "History", "Arabic",
    "Social Studies", "Computer", "Garments Design", "Drawing",
    "Drawing/Handwriting", "General Science", "GK", "EVS", "Hindi", "Retail Management"
  ];

  const classes = [
    "Nursery", "KG", "Ankur", "Mukul", "Class 1", "Class 2", "Class 3", "Class 4",
    "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"
  ];

  const addSubjectClassMapping = () => {
    setSubjectClassMappings([
      ...subjectClassMappings,
      { subject: "", classes: [] },
    ]);
  };

  const removeSubjectClassMapping = (index) => {
    setSubjectClassMappings(subjectClassMappings.filter((_, i) => i !== index));
  };

  const updateSubjectInMapping = (index, subject) => {
    const updated = [...subjectClassMappings];
    updated[index].subject = subject;
    setSubjectClassMappings(updated);
  };

  const toggleClassInMapping = (index, className) => {
    const updated = [...subjectClassMappings];
    updated[index].classes = updated[index].classes.includes(className)
      ? updated[index].classes.filter((c) => c !== className)
      : [...updated[index].classes, className];
    setSubjectClassMappings(updated);
  };

  /* ================= IMAGE ================= */

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      setFormError("Valid teacher image is required");
      return;
    }
    setTeacherImage(file);
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!teacherImage) {
      setFormError("Teacher image is required");
      return;
    }

    if (!subjectClassMappings.length) {
      setFormError("Add at least one subject & class");
      return;
    }

    const validMappings = subjectClassMappings.every(
      (m) => m.subject && m.classes.length > 0
    );

    if (!validMappings) {
      setFormError("Complete all subject & class mappings");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("contact", contact);
      formData.append("degree", degree);
      formData.append("experience", experience);
      formData.append("image", teacherImage);
      formData.append(
        "subjectClassMappings",
        JSON.stringify(subjectClassMappings)
      );

      const { data } = await axios.post(
        `${backendUrl}/api/teacher/add-teacher`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (data.success) {
        toast.success("Teacher added successfully");
        onClose();
      } else {
        setFormError(data.message || "Failed to add teacher");
      }
    } catch (error) {
      setFormError(error.response?.data?.message || "Error adding teacher");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SCROLL LOCK ================= */

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="tm-teacher-modal-overlay" onClick={onClose}>
      <div
        className="tm-teacher-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="tm-modal-header">
          <h2>Add New Teacher</h2>
          <button onClick={onClose} className="tm-close-button">✕</button>
        </div>

        {formError && <div className="tm-form-error">{formError}</div>}

        <form onSubmit={handleSubmit} className="tm-teacher-form">
          {/* ===== BASIC INFO ===== */}
          <div className="tm-form-grid">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" required />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" />
            <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Contact Number" required />
            <input value={degree} onChange={(e) => setDegree(e.target.value)} placeholder="Qualification / Degree" required />
            <input value={experience} onChange={(e) => /^\d*$/.test(e.target.value) && setExperience(e.target.value)} placeholder="Experience (Years)" required />
            <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageChange} required />
          </div>

          {/* ===== SUBJECTS ===== */}
          <div className="tm-form-section">
            <button type="button" className="tm-add-subject-btn" onClick={addSubjectClassMapping}>
              + Add Subject
            </button>

            {subjectClassMappings.map((mapping, index) => (
              <div key={index} className="tm-subject-mapping-card">
                <select value={mapping.subject} onChange={(e) => updateSubjectInMapping(index, e.target.value)}>
                  <option value="">Select Subject</option>
                  {subjects.map((s) => <option key={s}>{s}</option>)}
                </select>

                <div className="tm-classes-grid">
                  {classes.map((c) => (
                    <button
                      type="button"
                      key={c}
                      className={`tm-class-btn ${mapping.classes.includes(c) ? "tm-selected" : ""}`}
                      onClick={() => toggleClassInMapping(index, c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                <button type="button" className="tm-remove-btn" onClick={() => removeSubjectClassMapping(index)}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button type="submit" disabled={loading} className="tm-submit-btn">
            {loading ? "Saving..." : "Add Teacher"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeacherModal;
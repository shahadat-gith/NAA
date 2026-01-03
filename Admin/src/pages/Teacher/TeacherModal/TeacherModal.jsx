import React, { useState, useRef, useContext, useEffect } from "react";
import "./TeacherModal.css";
import axios from "axios";
import toast from "react-hot-toast";
import { AdminContext } from "../../../context/AdminContext";
import { TeacherContext } from "../../../context/TeacherContext";

const TeacherModal = ({ isOpen, onClose }) => {
  const { backendUrl, adminToken } = useContext(AdminContext);
  const { getAllTeachers } = useContext(TeacherContext);

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
    setSubjectClassMappings([...subjectClassMappings, { subject: "", classes: [] }]);
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
    const cls = updated[index].classes;
    updated[index].classes = cls.includes(className)
      ? cls.filter((c) => c !== className)
      : [...cls, className];
    setSubjectClassMappings(updated);
  };

  /* ================= IMAGE ================= */

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      setFormError("Teacher image is required");
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
        getAllTeachers();
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


  useEffect(() => {
    if (isOpen) {
      // Disable background scrolling
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scrolling
      document.body.style.overflow = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);


  if (!isOpen) return null;

  return (
    <div className="naa-teacher-modal-overlay" onClick={onClose}>
      <div
        className="naa-teacher-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="naa-modal-header">
          <h2>Add New Teacher</h2>
          <button onClick={onClose} className="naa-close-button">✕</button>
        </div>

        {formError && (
          <div className="naa-form-error">
            {formError}
          </div>
        )}


        <form onSubmit={handleSubmit} className="naa-teacher-form">
          {/* ===== BASIC INFO (3 ROWS × 2 COLUMNS) ===== */}
          <div className="naa-form-grid">
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setFormError("");
              }}
              placeholder="Full Name"
              required
            />

            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFormError("");
              }}
              placeholder="Email Address"
            />

            <input
              value={contact}
              onChange={(e) => {
                setContact(e.target.value);
                setFormError("");
              }}
              placeholder="Contact Number"
              required
            />

            <input
              value={degree}
              onChange={(e) => {
                setDegree(e.target.value);
                setFormError("");
              }}
              placeholder="Qualification / Degree"
              required
            />

            <input
              value={experience}
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value)) {
                  setExperience(e.target.value);
                  setFormError("");
                }
              }}
              placeholder="Experience (Years)"
              required
            />

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={(e) => {
                handleImageChange(e);
                setFormError("");
              }}
              required
            />
          </div>



          {/* ===== SUBJECTS ===== */}
          <div className="naa-form-section">
            <button
              type="button"
              className="naa-add-subject-btn"
              onClick={addSubjectClassMapping}
            >
              + Add Subject
            </button>

            {subjectClassMappings.map((mapping, index) => (
              <div key={index} className="naa-subject-mapping-card">
                <select
                  value={mapping.subject}
                  onChange={(e) =>
                    updateSubjectInMapping(index, e.target.value)
                  }
                >
                  <option value="">Select Subject</option>
                  {subjects.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>

                <div className="naa-classes-grid">
                  {classes.map((c) => (
                    <button
                      type="button"
                      key={c}
                      className={`naa-class-btn ${mapping.classes.includes(c) ? "naa-selected" : ""
                        }`}
                      onClick={() => toggleClassInMapping(index, c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="naa-remove-btn"
                  onClick={() => removeSubjectClassMapping(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button type="submit" disabled={loading} className="naa-submit-btn">
            {loading ? "Saving..." : "Add Teacher"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeacherModal;

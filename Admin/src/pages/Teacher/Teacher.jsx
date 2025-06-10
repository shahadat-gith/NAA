import React, { useContext, useState, useRef } from "react";
import "./Teacher.css";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import toast from 'react-hot-toast';
import { TeacherContext } from "../../context/TeacherContext";

const Teacher = () => {
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

  const fileInputRef = useRef(null);
  const { backendUrl, adminToken } = useContext(AdminContext);
  const { getAllTeachers } = useContext(TeacherContext);

  const subjects = [
    "Mathematics",
    "Advanced Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Assamese",
    "Advance Assamese",
    "English",
    "Alternative English",
    "Geography",
    "Education",
    "Political Science",
    "History",
    "Arabic",
    "Social Studies",
    "Computer",
    "Garments Design",
    "Drawing",
    "Drawing/Handwriting",
    "General Science",
    "GK",
    "EVS",
    "Hindi",
    "Retail Management"
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!teacher_image) {
      toast.error("Please select an image file!");
      return;
    }

    if (subjectClassMappings.length === 0) {
      toast.error("Please add at least one subject-class mapping!");
      return;
    }

    if (!experience || experience < 0) {
      toast.error("Please enter a valid number of years of experience!");
      return;
    }

    const isValid = subjectClassMappings.every(mapping => 
      mapping.subject && mapping.classes.length > 0
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
      formData.append("dueBalance", dueBalance);
      formData.append("subjectClassMappings", JSON.stringify(subjectClassMappings));

      const { data } = await axios.post(`${backendUrl}/api/teacher/add-teacher`, formData, 
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      if (data.success) {
        toast.success(data.message);
        setName("");
        setEmail("");
        setContact("");
        setDegree("");
        setExperience("");
        setSalary("");
        setTeacher_Image(null);
        setDueBalance(0);
        setSubjectClassMappings([]);
        getAllTeachers();
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-content-teacher">
      <form onSubmit={handleSubmit} className="teachers-form" encType="multipart/form-data">
        <h1>Add Teacher</h1>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="teacher-name">Teacher Name <span>*</span></label>
            <input
              type="text"
              id="teacher-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter teacher name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="teacher-image">Profile Image <span>*</span></label>
            <input
              type="file"
              id="teacher-image"
              ref={fileInputRef}
              accept="image/*"
              onChange={(e) => setTeacher_Image(e.target.files[0])}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="teacher-email">Email Address <span>*</span></label>
            <input
              type="email"
              id="teacher-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="teacher-contact">Contact Number <span>*</span></label>
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

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="teacher-degree">Qualification/Degree <span>*</span></label>
            <input
              type="text"
              id="teacher-degree"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              placeholder="Enter qualification/degree"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="teacher-experience">Experience (Years) <span>*</span></label>
            <input
              type="number"
              id="teacher-experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Enter years of experience"
              min="0"
              max="100"
              step="1"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="teacher-salary">Monthly Salary <span>*</span></label>
            <input
              type="number"
              id="teacher-salary"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="Enter monthly salary"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="due-balance">Due Balance <span>*</span></label>
            <input
              type="number"
              id="due-balance"
              value={dueBalance}
              onChange={(e) => setDueBalance(e.target.value)}
              placeholder="Enter due balance"
              required
            />
          </div>
        </div>

        <div className="subject-class-section">
          <div className="section-header">
            <h3>Subject & Class</h3>
            <button 
              type="button" 
              className="add-mapping-btn"
              onClick={addSubjectClassMapping}
            >
              + Add Subject
            </button>
          </div>

          {subjectClassMappings.map((mapping, index) => (
            <div key={index} className="subject-class-mapping">
              <div className="mapping-header">
                <h4>Subject #{index + 1}</h4>
                <button
                  type="button"
                  className="remove-mapping-btn"
                  onClick={() => removeSubjectClassMapping(index)}
                >
                  Remove
                </button>
              </div>

              <div className="form-group">
                <label>Select Subject <span>*</span></label>
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

              <div className="form-group">
                <label>Select Classes <span>*</span></label>
                <div className="classes-grid">
                  {classes.map((className) => (
                    <button
                      key={className}
                      type="button"
                      className={`class-button ${mapping.classes.includes(className) ? 'selected' : ''}`}
                      onClick={() => updateClassesInMapping(index, className)}
                      aria-pressed={mapping.classes.includes(className)}
                      aria-label={`Toggle ${className} class`}
                    >
                      {className}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {subjectClassMappings.length === 0 && (
            <div className="empty-state">
              <p>No subject added yet. Click "Add Subject" to get started.</p>
            </div>
          )}
        </div>

        <button type="submit" className="add-button" disabled={loading}>
          {loading ? <span className="spinner"></span> : "Add Teacher"}
        </button>
      </form>
    </div>
  );
};

export default Teacher;
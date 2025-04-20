import React, { useContext, useState, useRef } from "react";
import "./Teacher.css";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import { TeacherContext } from "../../context/TeacherContext";

const Teacher = () => {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [degree, setDegree] = useState("");
  const [contact, setContact] = useState("");
  const [experience, setExperience] = useState("");
  const [salary, setSalary] = useState("");
  const [teacher_image, setTeacher_Image] = useState(null);
  const [dueBalance,setDueBalance] = useState(0)
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const { backendUrl, adminToken } = useContext(AdminContext);
  const { getAllTeachers } = useContext(TeacherContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!teacher_image) {
      toast.error("Please select an image file!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("subject", subject);
      formData.append("email", email);
      formData.append("contact", contact);
      formData.append("department", department);
      formData.append("degree", degree);
      formData.append("experience", experience);
      formData.append("salary", Number(salary));
      formData.append("image", teacher_image);
      formData.append("dueBalance", dueBalance);

      const { data } = await axios.post(`${backendUrl}/api/teacher/add-teacher`, formData, 
        {headers: { Authorization: `Bearer ${adminToken}` }},
      );

      if (data.success) {
        toast.success(data.message);
        setName(""); setSubject(""); setEmail(""); setContact("");
        setDepartment(""); setDegree(""); setExperience(""); setSalary("");
        setTeacher_Image(null);setDueBalance(0);
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
              placeholder="Name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="teacher-image">Image <span>*</span></label>
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
            <label htmlFor="teacher-email">Teacher Email <span>*</span></label>
            <input
              type="email"
              id="teacher-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="teacher-contact">Teacher Contact No. <span>*</span></label>
            <input
              id="teacher-contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Phone No"
              required
            />
          </div>
          
        </div>
        <div className="form-row">
        <div className="form-group">
            <label htmlFor="teacher-subject">Subject <span>*</span></label>
            <select
              id="teacher-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            >
              <option value="" disabled>Select subject</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
              <option value="History">History</option>
              <option value="Geography">Geography</option>
              <option value="PoliticalScience">Political Science</option>
              <option value="Assamese">Assamese</option>
              <option value="Education">Education</option>
              <option value="Arabic">Arabic</option>
            </select>
          </div>
        

          <div className="form-group">
            <label htmlFor="teacher-department">Department <span>*</span></label>
            <select
              id="teacher-department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            >
              <option value="">Select Department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="English">English</option>
              <option value="History">History</option>
              <option value="Geography">Geography</option>
              <option value="Economics">Economics</option>
              <option value="Business Studies">Business Studies</option>
              <option value="Physical Education">Physical Education</option>
              <option value="Arts">Arts</option>
              <option value="Music">Music</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="teacher-degree">Degree <span>*</span></label>
            <input
              type="text"
              id="teacher-degree"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              placeholder="Degree"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="teacher-experience">Experience <span>*</span></label>
            <select
              id="teacher-experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              required
            >
              <option value="" disabled>Select experience</option>
              <option value="1 Year">1 Year</option>
              <option value="2 Years">2 Years</option>
              <option value="3 Years">3 Years</option>
              <option value="4+ Years">4+ Years</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="teacher-salary">Salary <span>*</span></label>
            <input
              type="number"
              id="teacher-salary"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="Teacher salary"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="due-balance">Due Balance<span>*</span></label>
            <input
              type="number"
              id="due-balance"
              value={dueBalance}
              onChange={(e) => setDueBalance(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row">
         
        </div>

        <button type="submit" className="add-button" disabled={loading}>
          {loading ? <span className="spinner"></span> : "Add Teacher"}
        </button>
      </form>
    </div>
  );
};

export default Teacher;
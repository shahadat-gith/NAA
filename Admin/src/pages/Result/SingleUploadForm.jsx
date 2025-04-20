import React, { useContext, useState } from "react";
import "./Result.css";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import { AdminContext } from "../../context/AdminContext";

const SingleUploadForm = () => {
  const { backendUrl } = useContext(AppContext);
  const { adminToken } = useContext(AdminContext);

  const [maxMarksPerSubject, setMaxMarksPerSubject] = useState("");
  const [examName, setExamName] = useState("");
  const [academicSession, setAcademicSession] = useState("");
  const [subjects, setSubjects] = useState([{ subject: "", marks: "" }]);
  const [studentName, setStudentName] = useState("");
  const [registrationNo, setRegistrationNo] = useState(""); // Changed from rollNumber
  const [fileError, setFileError] = useState("");

  const examOptions = ["Half Yearly Examination", "Annual Examination", "Unit Test 1", "Unit Test 2", "Unit Test 3", "Unit Test 4"];
  const sessionOptions = ["2023-2024", "2024-2025", "2025-2026", "2026-2027", "2027-2028"];

  const handleSingleUpload = async (e) => {
    e.preventDefault();
    if (
      !studentName ||
      !registrationNo ||
      !maxMarksPerSubject ||
      !examName ||
      !academicSession ||
      subjects.some((sub) => !sub.subject || !sub.marks)
    ) {
      setFileError("Please fill all required fields: student name, registration number, max marks, exam name, academic session, and subjects.");
      return;
    }

    if (isNaN(maxMarksPerSubject) || maxMarksPerSubject <= 0) {
      setFileError("Max marks per subject must be a positive number.");
      return;
    }

    const data = {
      studentName,
      registrationNo,
      maxMarksPerSubject,
      subjects,
      examName,
      academicSession,
    };

    try {
      const uploadPromise = axios.post(`${backendUrl}/api/result/upload-single-result`, data, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      toast.promise(uploadPromise, {
        pending: "Uploading result...",
        success: {
          render({ data }) {
            resetForm();
            setSubjects([{ subject: "", marks: "" }]);
            setStudentName("");
            setRegistrationNo("");
            return data.data.message || "Result uploaded successfully";
          },
        },
        error: {
          render({ data }) {
            const errorMsg = data.response?.data?.message || "Failed to upload result";
            setFileError(errorMsg);
            if (errorMsg.includes("Student not found")) {
              toast.warn("Student not found. Please verify registration number or add student manually.");
            }
            return errorMsg;
          },
        },
      });
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const resetForm = () => {
    setMaxMarksPerSubject("");
    setExamName("");
    setAcademicSession("");
    setFileError("");
  };

  const addSubject = () => {
    setSubjects([...subjects, { subject: "", marks: "" }]);
  };

  const handleSubjectChange = (index, field, value) => {
    const newSubjects = [...subjects];
    newSubjects[index][field] = value;
    setSubjects(newSubjects);
  };

  return (
    <form onSubmit={handleSingleUpload} className="single-upload-form">
      <h1>Upload Single Result</h1>

      <label>Student Name:</label>
      <input
        type="text"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
        placeholder="Student Name"
        required
      />

      <label>Registration Number:</label>
      <input
        type="text"
        value={registrationNo}
        onChange={(e) => setRegistrationNo(e.target.value)}
        placeholder="Student Registration No"
        required
      />

      <label>Exam Name:</label>
      <select value={examName} onChange={(e) => setExamName(e.target.value)} required>
        <option value="" disabled>Select Exam</option>
        {examOptions.map((exam) => (
          <option key={exam} value={exam}>{exam}</option>
        ))}
      </select>

      <label>Academic Session:</label>
      <select value={academicSession} onChange={(e) => setAcademicSession(e.target.value)} required>
        <option value="" disabled>Select Session</option>
        {sessionOptions.map((session) => (
          <option key={session} value={session}>{session}</option>
        ))}
      </select>

      <label>Max Marks per Subject:</label>
      <input
        type="number"
        placeholder="Max Marks per subject"
        value={maxMarksPerSubject}
        onChange={(e) => setMaxMarksPerSubject(e.target.value)}
        required
        min="1"
      />

      <label>Subjects and Marks:</label>
      {subjects.map((sub, index) => (
        <div key={index} className="subject-input-group">
          <input
            type="text"
            placeholder="Subject Name"
            value={sub.subject}
            onChange={(e) => handleSubjectChange(index, "subject", e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Marks"
            value={sub.marks}
            onChange={(e) => handleSubjectChange(index, "marks", e.target.value)}
            required
          />
        </div>
      ))}
      <button type="button" onClick={addSubject} className="add-subject-btn">+</button>

      {fileError && <p className="error-message">{fileError}</p>}
      <button type="submit" className="result-submit-btn">Upload Result</button>
    </form>
  );
};

export default SingleUploadForm;
import React, { useState, useContext } from "react";
import toast from 'react-hot-toast';
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";

const MassUploadForm = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [file, setFile] = useState(null);
  const [maxMarksPerSubject, setMaxMarksPerSubject] = useState("");
  const [examName, setExamName] = useState("");
  const [academicSession, setAcademicSession] = useState("");
  const [fileError, setFileError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rejectedEntries, setRejectedEntries] = useState(null);

  const examOptions = ["Half Yearly Examination", "Annual Examination", "Unit Test 1", "Unit Test 2", "Unit Test 3", "Unit Test 4"];
  const sessionOptions = ["2023-2024", "2024-2025", "2025-2026", "2026-2027", "2027-2028"];

  const resetForm = () => {
    setFile(null);
    setMaxMarksPerSubject("");
    setExamName("");
    setAcademicSession("");
    setFileError("");
    setRejectedEntries(null);
    document.getElementById("file-upload").value = null;
  };

  const handleMassUpload = async (e) => {
    e.preventDefault();

    if (!file || !maxMarksPerSubject || !examName || !academicSession) {
      setFileError("Please fill all required fields: max marks, exam name, academic session, and file.");
      return;
    }
    if (isNaN(maxMarksPerSubject) || maxMarksPerSubject <= 0) {
      setFileError("Max marks per subject must be a positive number.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("examName", examName);
    formData.append("academicSession", academicSession);
    formData.append("maxMarksPerSubject", maxMarksPerSubject);

    setLoading(true);
    setFileError("");
    setRejectedEntries(null);

    try {
      const response = await axios.post(`${backendUrl}/api/result/upload-results`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${adminToken}`,
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        if (response.data.rejectedEntries) {
          setRejectedEntries(response.data.rejectedEntries);
          toast.warn(`${response.data.rejectedEntries.length} entries were rejected. See details below.`);
        } else {
          resetForm();
        }
      } else {
        toast.error(response.data.message);
        setFileError(response.data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred while uploading results.";
      toast.error(errorMessage);
      setFileError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mass-upload-form-container">
      <h3>Mass Upload Results</h3>
      <p>
        Upload an Excel file with columns: <strong>registrationNo</strong>, <strong>name</strong>, and subject marks (e.g., Math, Science).
      </p>
      <form onSubmit={handleMassUpload} className="mass-upload-form">
        <div className="form-group">
          <label>Max Marks Per Subject</label>
          <input
            type="number"
            value={maxMarksPerSubject}
            onChange={(e) => setMaxMarksPerSubject(e.target.value)}
            placeholder="e.g., 100"
            disabled={loading}
            required
            min="1"
          />
        </div>

        <div className="form-group">
          <label>Exam Name</label>
          <select
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            disabled={loading}
            required
          >
            <option value="">Select Exam</option>
            {examOptions.map((exam) => (
              <option key={exam} value={exam}>
                {exam}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Academic Session</label>
          <select
            value={academicSession}
            onChange={(e) => setAcademicSession(e.target.value)}
            disabled={loading}
            required
          >
            <option value="">Select Session</option>
            {sessionOptions.map((session) => (
              <option key={session} value={session}>
                {session}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Upload Excel File</label>
          <input
            id="file-upload"
            type="file"
            accept=".xlsx, .xls"
            onChange={(e) => setFile(e.target.files[0])}
            disabled={loading}
            required
          />
        </div>

        {fileError && <div className="error-message">{fileError}</div>}

        <button type="submit" className="premium-button" disabled={loading}>
          {loading ? "Uploading..." : "Upload Results"}
        </button>

        {rejectedEntries && (
          <div className="rejected-entries">
            <h4>Rejected Entries</h4>
            <table>
              <thead>
                <tr>
                  <th>Registration No</th>
                  <th>Name</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {rejectedEntries.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.registrationNo}</td>
                    <td>{entry.name}</td>
                    <td>{entry.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </form>
    </div>
  );
};

export default MassUploadForm;
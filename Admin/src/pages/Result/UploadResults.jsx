import React, { useState, useContext } from "react";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import "./Styles/UploadResults.css";

import {
  CLASS_OPTIONS,
  STREAM_OPTIONS,
  EXAM_OPTIONS,
  SESSION_OPTIONS,
} from "../../utils/academicOptions";

const UploadResults = ({ isOpen, onClose, onSuccess }) => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [medium, setMedium] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [stream, setStream] = useState("");
  const [examName, setExamName] = useState("");
  const [academicSession, setAcademicSession] = useState("");
  const [maxMarksPerSubject, setMaxMarksPerSubject] = useState("");

  // ✅ NEW STATES
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const availableClasses = medium ? CLASS_OPTIONS[medium] || [] : [];
  const isSeniorClass = (cls) => cls === "11" || cls === "12";

  const resetForm = () => {
    setFile(null);
    setMedium("");
    setSelectedClass("");
    setStream("");
    setExamName("");
    setAcademicSession("");
    setMaxMarksPerSubject("");
  };

  const handleClose = () => {
    resetForm();
    setSuccessMsg("");
    setErrorMsg("");
    onClose();
  };

  if (!isOpen) return null;

  const submitResult = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("class", selectedClass);
      formData.append("medium", medium);
      formData.append("stream", isSeniorClass(selectedClass) ? stream : "");
      formData.append("examName", examName);
      formData.append("academicSession", academicSession);
      formData.append("maxMarksPerSubject", maxMarksPerSubject);

      const res = await axios.post(
        `${backendUrl}/api/results/upload`,
        formData,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );

      if (res.data.success) {
        setSuccessMsg(`✅ Uploaded ${res.data.count} results successfully`);
        resetForm();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "❌ Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ur-result-modal-overlay" onClick={handleClose}>
      <div
        className="ur-result-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ur-result-modal-header">
          <h2>Upload Results</h2>
          <button onClick={handleClose}>✕</button>
        </div>

        <div className="ur-result-form-container">
          <form onSubmit={submitResult} className="ur-result-form">

            {/* ✅ SUCCESS / ERROR MESSAGE */}
            {successMsg && (
              <div className="ur-success-msg">{successMsg}</div>
            )}
            {errorMsg && (
              <div className="ur-error-msg">{errorMsg}</div>
            )}

            <div className="ur-form-grid">

              <select
                value={medium}
                onChange={(e) => {
                  setMedium(e.target.value);
                  setSelectedClass("");
                  setStream("");
                }}
                required
              >
                <option value="">Select Medium</option>
                {["english", "assamese"].map((m) => (
                  <option key={m} value={m}>
                    {m.toUpperCase()}
                  </option>
                ))}
              </select>

              <select
                value={selectedClass}
                disabled={!medium}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setStream("");
                }}
                required
              >
                <option value="">Select Class</option>
                {availableClasses.map((c) => (
                  <option key={c} value={c}>
                    {c.toUpperCase()}
                  </option>
                ))}
              </select>

              {isSeniorClass(selectedClass) && (
                <select
                  value={stream}
                  onChange={(e) => setStream(e.target.value)}
                  required
                >
                  <option value="">Select Stream</option>
                  {STREAM_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s.toUpperCase()}
                    </option>
                  ))}
                </select>
              )}

              <select
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                required
              >
                <option value="">Select Exam</option>
                {EXAM_OPTIONS.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>

              <select
                value={academicSession}
                onChange={(e) => setAcademicSession(e.target.value)}
                required
              >
                <option value="">Select Session</option>
                {SESSION_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Max Marks per Subject"
                value={maxMarksPerSubject}
                onChange={(e) => setMaxMarksPerSubject(e.target.value)}
                required
              />
            </div>

            <div className="ur-file-upload-section">
              <label>Upload Excel File (.xlsx)</label>
              <input
                type="file"
                accept=".xlsx"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
            </div>

            <button
              type="submit"
              className="ur-submit-btn"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload & Rank Results"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadResults;
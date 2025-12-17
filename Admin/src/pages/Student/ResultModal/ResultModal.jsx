import React, { useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AdminContext } from "../../../context/AdminContext";
import "./ResultModal.css";
import { CLASS_OPTIONS, STREAM_OPTIONS, EXAM_OPTIONS, SESSION_OPTIONS } from "../utils/academicOptions";

const ResultModal = ({ isOpen, onClose }) => {
  const { backendUrl, adminToken } = useContext(AdminContext);
  const [activeTab, setActiveTab] = useState("single");
  const [loading, setLoading] = useState(false);

  const allClassOptions = Array.from(new Set([...CLASS_OPTIONS.english, ...CLASS_OPTIONS.assamese]));
  const isSeniorClass = (cls) => cls === "11" || cls === "12";

  /* ================= STATES ================= */
  const initialSingleData = {
    registrationNo: "",
    class: "",
    stream: "",
    examName: "",
    academicSession: "",
    maxMarksPerSubject: "",
    marks: [{ subject: "", marksObtained: "" }],
  };

  const [singleData, setSingleData] = useState(initialSingleData);
  const [file, setFile] = useState(null);
  const [massClass, setMassClass] = useState("");
  const [massStream, setMassStream] = useState("");
  const [massExam, setMassExam] = useState("");
  const [massSession, setMassSession] = useState("");
  const [massMaxMarks, setMassMaxMarks] = useState("");
  const [skippedDetails, setSkippedDetails] = useState([]);

  const resetForm = () => {
    setSingleData(initialSingleData);
    setFile(null);
    setMassClass("");
    setMassStream("");
    setMassExam("");
    setMassSession("");
    setMassMaxMarks("");
    setSkippedDetails([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  /* ================= HANDLERS ================= */
  const handleSingleChange = (field, value) => setSingleData({ ...singleData, [field]: value });

  const handleMarksChange = (i, field, value) => {
    const updated = [...singleData.marks];
    updated[i][field] = value;
    setSingleData({ ...singleData, marks: updated });
  };

  const submitSingleResult = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${backendUrl}/api/student/result`, {
        ...singleData,
        maxMarksPerSubject: Number(singleData.maxMarksPerSubject),
        marks: singleData.marks.map(m => ({ ...m, marksObtained: Number(m.marksObtained) }))
      }, { headers: { Authorization: `Bearer ${adminToken}` } });

      toast.success("Result uploaded successfully");
      handleClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const submitMassResult = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSkippedDetails([]); // Reset skips on new attempt
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("class", massClass);
      formData.append("stream", isSeniorClass(massClass) ? massStream : "");
      formData.append("examName", massExam);
      formData.append("academicSession", massSession);
      formData.append("maxMarksPerSubject", massMaxMarks);

      const res = await axios.post(`${backendUrl}/api/student/result/mass`, formData, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      if (res.data.success) {
        toast.success(`Uploaded: ${res.data.created} Results.`);
        
        // Check if there are errors to show
        if (res.data.skippedDetails && res.data.skippedDetails.length > 0) {
          setSkippedDetails(res.data.skippedDetails);
          toast.error(`${res.data.skippedCount} rows skipped!`);
        } else {
          // If perfectly successful with 0 errors, close the modal
          handleClose();
        }
      } 
    } catch (err) {
      toast.error(err.response?.data?.message || "Mass upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="result-modal-overlay" onClick={handleClose}>
      <div className="result-modal" onClick={(e) => e.stopPropagation()}>
        <div className="result-modal-header">
          <h2>Upload Results</h2>
          <button onClick={handleClose}>✕</button>
        </div>

        <div className="result-tabs">
          <button className={activeTab === "single" ? "active" : ""} onClick={() => setActiveTab("single")}>Single Upload</button>
          <button className={activeTab === "mass" ? "active" : ""} onClick={() => setActiveTab("mass")}>Mass Upload</button>
        </div>

        <div className="result-form-container">
            {activeTab === "single" && (
            <form onSubmit={submitSingleResult} className="result-form">
                <div className="form-grid">
                    <input placeholder="Registration No" value={singleData.registrationNo} onChange={(e) => handleSingleChange("registrationNo", e.target.value)} required />
                    <select value={singleData.class} onChange={(e) => { handleSingleChange("class", e.target.value); handleSingleChange("stream", ""); }} required>
                        <option value="">Select Class</option>
                        {allClassOptions.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                    </select>
                    {isSeniorClass(singleData.class) && (
                    <select value={singleData.stream} onChange={(e) => handleSingleChange("stream", e.target.value)} required>
                        <option value="">Select Stream</option>
                        {STREAM_OPTIONS.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                    </select>
                    )}
                    <select value={singleData.examName} onChange={(e) => handleSingleChange("examName", e.target.value)} required>
                        <option value="">Select Exam</option>
                        {EXAM_OPTIONS.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                    <select value={singleData.academicSession} onChange={(e) => handleSingleChange("academicSession", e.target.value)} required>
                        <option value="">Select Session</option>
                        {SESSION_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <input type="number" placeholder="Max Marks" value={singleData.maxMarksPerSubject} onChange={(e) => handleSingleChange("maxMarksPerSubject", e.target.value)} required />
                </div>

                <div className="subject-section">
                    <h4>Subjects & Marks</h4>
                    {singleData.marks.map((m, i) => (
                    <div key={i} className="subject-row">
                        <input placeholder="Subject" value={m.subject} onChange={(e) => handleMarksChange(i, "subject", e.target.value)} required />
                        <input type="number" placeholder="Marks" value={m.marksObtained} onChange={(e) => handleMarksChange(i, "marksObtained", e.target.value)} required />
                        <button type="button" className="subject-row-remove" onClick={() => setSingleData({ ...singleData, marks: singleData.marks.filter((_, idx) => idx !== i) })} disabled={singleData.marks.length === 1}>✕</button>
                    </div>
                    ))}
                    <button type="button" className="add-subject-btn" onClick={() => setSingleData({ ...singleData, marks: [...singleData.marks, { subject: "", marksObtained: "" }] })}>+ Add Subject</button>
                </div>
                
                <button type="submit" className="submit-btn" disabled={loading}>{loading ? "Uploading..." : "Upload Result"}</button>
            </form>
            )}

            {activeTab === "mass" && (
            <form onSubmit={submitMassResult} className="result-form">
                <div className="form-grid">
                    <select value={massClass} onChange={(e) => { setMassClass(e.target.value); setMassStream(""); }} required>
                    <option value="">Select Class</option>
                    {allClassOptions.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                    </select>
                    {isSeniorClass(massClass) && (
                    <select value={massStream} onChange={(e) => setMassStream(e.target.value)} required>
                        <option value="">Select Stream</option>
                        {STREAM_OPTIONS.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                    </select>
                    )}
                    <select value={massExam} onChange={(e) => setMassExam(e.target.value)} required>
                    <option value="">Select Exam</option>
                    {EXAM_OPTIONS.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                    <select value={massSession} onChange={(e) => setMassSession(e.target.value)} required>
                    <option value="">Select Session</option>
                    {SESSION_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <input type="number" placeholder="Max Marks" value={massMaxMarks} onChange={(e) => setMassMaxMarks(e.target.value)} required />
                </div>

                <div className="file-upload-section">
                    <label>Excel File (.xlsx)</label>
                    <input type="file" accept=".xlsx" onChange={(e) => setFile(e.target.files[0])} required />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>{loading ? "Uploading..." : "Upload Results"}</button>

                {skippedDetails.length > 0 && (
                <div className="skipped-box">
                    <h4>⚠️ Skipped Rows ({skippedDetails.length})</h4>
                    <div className="skipped-list">
                        {skippedDetails.map((s, i) => (
                        <p key={i}>
                            <strong>Row {s.row}:</strong> {s.registrationNo || 'N/A'} — <span className="skip-reason">{s.reason}</span>
                        </p>
                        ))}
                    </div>
                </div>
                )}
            </form>
            )}
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
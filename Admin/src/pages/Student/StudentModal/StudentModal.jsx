import React, { useState, useRef, useContext } from "react";
import "./StudentModal.css";
import toast from "react-hot-toast";
import axios from "axios";
import { AdminContext } from "../../../context/AdminContext";
import { formatClassName } from "../utils/formatclass";
import { CLASS_OPTIONS, STREAM_OPTIONS } from "../utils/academicOptions";

const StudentModal = ({ isOpen, onClose }) => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [activeTab, setActiveTab] = useState("mass");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ===== Form States ===== */
  const [massMedium, setMassMedium] = useState("");
  const [massClass, setMassClass] = useState("");
  const [massStream, setMassStream] = useState("");

  const initialSingleStudent = {
    name: "",
    fatherName: "",
    motherName: "",
    registrationNo: "",
    class: "",
    medium: "",
    stream: "",
    phone: "",
    academicSession: "",
  };
  const [singleStudent, setSingleStudent] = useState(initialSingleStudent);

  const fileInputRef = useRef(null);

  // Function to reset all form fields
  const resetForm = () => {
    setMassMedium("");
    setMassClass("");
    setMassStream("");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setSingleStudent(initialSingleStudent);
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  /* ================= HANDLERS ================= */

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && !selected.name.endsWith(".xlsx")) {
      toast.error("Only .xlsx Excel files are allowed");
      return;
    }
    setFile(selected);
  };

  const handleMassAdmission = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please upload an Excel file");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("class", massClass);
      formData.append("medium", massMedium);
      if (massStream) formData.append("stream", massStream);

      const res = await axios.post(`${backendUrl}/api/student/admission/mass`, formData, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      toast.success(`Created: ${res.data.created}, Skipped: ${res.data.skipped}`);
      handleClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Mass admission failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSingleAdmission = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${backendUrl}/api/student/admission`, singleStudent, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      toast.success("Admission successful");
      handleClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Admission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sm-modal-overlay" onClick={handleClose}>
      <div className="sm-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="sm-modal-header">
          <h2>Add Students</h2>
          <button className="sm-close-button" onClick={handleClose}>✕</button>
        </div>

        <div className="sm-tabs">
          <button onClick={() => setActiveTab("mass")} className={activeTab === "mass" ? "sm-active" : ""}>Mass Upload</button>
          <button onClick={() => setActiveTab("single")} className={activeTab === "single" ? "sm-active" : ""}>Single Admission</button>
        </div>

        {activeTab === "mass" && (
          <form className="sm-form" onSubmit={handleMassAdmission}>
            <p className="sm-info-text">Excel must contain: <b>name, fatherName, motherName, registrationNo, phone, academicSession</b></p>
            
            <select value={massMedium} onChange={(e) => { setMassMedium(e.target.value); setMassClass(""); setMassStream(""); }} required>
              <option value="">Select Medium</option>
              <option value="english">English</option>
              <option value="assamese">Assamese</option>
            </select>

            <select value={massClass} onChange={(e) => { setMassClass(e.target.value); setMassStream(""); }} required disabled={!massMedium}>
              <option value="">Select Class</option>
              {massMedium && CLASS_OPTIONS[massMedium].map((cls) => (
                <option key={cls} value={cls}>{formatClassName(cls)}</option>
              ))}
            </select>

            {massMedium === "assamese" && ["11", "12"].includes(massClass) && (
              <select value={massStream} onChange={(e) => setMassStream(e.target.value)} required>
                <option value="">Select Stream</option>
                {STREAM_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            )}

            <input type="file" accept=".xlsx" ref={fileInputRef} onChange={handleFileChange} required />
            <button type="submit" disabled={loading}>{loading ? "Uploading..." : "Upload Students"}</button>
          </form>
        )}

        {activeTab === "single" && (
          <form className="sm-form" onSubmit={handleSingleAdmission}>
            <div className="sm-form-row">
              <input placeholder="Student Name" value={singleStudent.name} onChange={(e) => setSingleStudent({ ...singleStudent, name: e.target.value })} required />
              <input placeholder="Father's Name" value={singleStudent.fatherName} onChange={(e) => setSingleStudent({ ...singleStudent, fatherName: e.target.value })} required />
            </div>
            <div className="sm-form-row">
              <input placeholder="Mother's Name" value={singleStudent.motherName} onChange={(e) => setSingleStudent({ ...singleStudent, motherName: e.target.value })} required />
              <input placeholder="Registration No" value={singleStudent.registrationNo} onChange={(e) => setSingleStudent({ ...singleStudent, registrationNo: e.target.value })} required />
            </div>
            <div className="sm-form-row">
              <select value={singleStudent.medium} onChange={(e) => setSingleStudent({ ...singleStudent, medium: e.target.value, class: "", stream: "" })} required>
                <option value="">Select Medium</option>
                <option value="english">English</option>
                <option value="assamese">Assamese</option>
              </select>
              <select value={singleStudent.class} onChange={(e) => setSingleStudent({ ...singleStudent, class: e.target.value, stream: "" })} required disabled={!singleStudent.medium}>
                <option value="">Select Class</option>
                {singleStudent.medium && CLASS_OPTIONS[singleStudent.medium].map((cls) => (
                  <option key={cls} value={cls}>{formatClassName(cls)}</option>
                ))}
              </select>
            </div>
            {singleStudent.medium === "assamese" && ["11", "12"].includes(singleStudent.class) && (
              <select value={singleStudent.stream} onChange={(e) => setSingleStudent({ ...singleStudent, stream: e.target.value })} required>
                <option value="">Select Stream</option>
                {STREAM_OPTIONS.map((s) => <option key={s} value={s}>{s.toUpperCase()}</option>)}
              </select>
            )}
            <div className="sm-form-row">
              <input placeholder="Phone" value={singleStudent.phone} onChange={(e) => setSingleStudent({ ...singleStudent, phone: e.target.value })} />
              <input placeholder="Session (e.g. 2024-25)" value={singleStudent.academicSession} onChange={(e) => setSingleStudent({ ...singleStudent, academicSession: e.target.value })} required />
            </div>
            <button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit Admission"}</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default StudentModal;
import React, { useState, useRef, useContext } from "react";
import "./StudentModal.css";
import toast from "react-hot-toast";
import axios from "axios";
import { AdminContext } from "../../../context/AdminContext";
import { formatClassName } from "../../../utils/formatclass";
import {
  CLASS_OPTIONS,
  STREAM_OPTIONS,
} from "../../../utils/academicOptions";

const StudentModal = ({ isOpen, onClose }) => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [massMedium, setMassMedium] = useState("");
  const [massClass, setMassClass] = useState("");
  const [massStream, setMassStream] = useState("");

  const fileInputRef = useRef(null);

  const resetForm = () => {
    setMassMedium("");
    setMassClass("");
    setMassStream("");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
    if (!massMedium || !massClass)
      return toast.error("Please select medium and class");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("class", massClass);
      formData.append("medium", massMedium);
      if (massStream) formData.append("stream", massStream);

      const res = await axios.post(
        `${backendUrl}/api/student/admission/mass`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(
          `Students migrated successfully (${res.data.total})`
        );
        handleClose();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Mass admission failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sm-modal-overlay" onClick={handleClose}>
      <div
        className="sm-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sm-modal-header">
          <h2>Mass Admission</h2>
          <button className="sm-close-button" onClick={handleClose}>
            ✕
          </button>
        </div>

        <form className="sm-form" onSubmit={handleMassAdmission}>
          {/* Medium */}
          <select
            value={massMedium}
            onChange={(e) => {
              setMassMedium(e.target.value);
              setMassClass("");
              setMassStream("");
            }}
            required
          >
            <option value="">Select Medium</option>
            <option value="english">English</option>
            <option value="assamese">Assamese</option>
          </select>

          {/* Class */}
          <select
            value={massClass}
            onChange={(e) => {
              setMassClass(e.target.value);
              setMassStream("");
            }}
            required
            disabled={!massMedium}
          >
            <option value="">Select Class</option>
            {massMedium &&
              CLASS_OPTIONS[massMedium].map((cls) => (
                <option key={cls} value={cls}>
                  {formatClassName(cls)}
                </option>
              ))}
          </select>

          {/* Stream */}
          {massMedium === "assamese" &&
            ["11", "12"].includes(massClass) && (
              <select
                value={massStream}
                onChange={(e) => setMassStream(e.target.value)}
                required
              >
                <option value="">Select Stream</option>
                {STREAM_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            )}

          {/* Excel Upload */}
          <input
            type="file"
            accept=".xlsx"
            ref={fileInputRef}
            onChange={handleFileChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Upload Students"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;

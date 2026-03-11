import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "../Styles/CurrentExamModal.css";
import { EXAM_OPTIONS } from "../../../utils/academicOptions";

const CurrentExamModal = ({ open, onClose, onSubmit, initialData, loading }) => {
  const [examName, setExamName] = useState("");
  const [academicSession, setAcademicSession] = useState("");
  const [morning, setMorning] = useState("");
  const [afternoon, setAfternoon] = useState("");

  useEffect(() => {
    if (open) {
      setExamName(initialData?.examName || "");
      setAcademicSession(initialData?.academicSession || "");
      setMorning(initialData?.morning || "");
      setAfternoon(initialData?.afternoon || "");
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!examName.trim()) return toast.error("Exam name is required");
    if (!academicSession.trim())
      return toast.error("Academic session is required");

    onSubmit({
      examName: examName.trim(),
      academicSession: academicSession.trim(),
      morning: morning.trim(),
      afternoon: afternoon.trim(),
    });
  };

  return (
    <div className="cem-modal-overlay">
      <div className="cem-modal">
        <div className="cem-modal-header">
          <h3>Update Current Exam</h3>
          <button type="button" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="cem-form">
          <div className="cem-field">
            <label>Exam Name *</label>
            <select
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
            >
              <option value="">Select Exam</option>
              {EXAM_OPTIONS.map((exam) => (
                <option key={exam} value={exam}>
                  {exam}
                </option>
              ))}
            </select>
          </div>

          <div className="cem-field">
            <label>Academic Session *</label>
            <input
              type="text"
              value={academicSession}
              onChange={(e) => setAcademicSession(e.target.value)}
              placeholder="e.g. 2025-2026"
            />
          </div>

          <div className="cem-field">
            <label>Morning Time *</label>
            <input
              type="text"
              value={morning}
              onChange={(e) => setMorning(e.target.value)}
              placeholder="e.g. 9:00 AM - 12:00 PM"
            />
          </div>

          <div className="cem-field">
            <label>Afternoon Time *</label>
            <input
              type="text"
              value={afternoon}
              onChange={(e) => setAfternoon(e.target.value)}
              placeholder="e.g. 2:00 PM - 5:00 PM"
            />
          </div>

          <div className="cem-actions">
            <button type="button" className="cem-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="cem-submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CurrentExamModal;
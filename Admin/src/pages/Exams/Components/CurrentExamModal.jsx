import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "../Styles/CurrentExamModal.css";
import { EXAM_OPTIONS, TIME_OPTIONS, SESSION_OPTIONS } from "../../../utils/academicOptions";

const CurrentExamModal = ({ open, onClose, onSubmit, initialData, loading }) => {

  const [examName, setExamName] = useState("");
  const [academicSession, setAcademicSession] = useState("");

  const [morningStart, setMorningStart] = useState("");
  const [morningEnd, setMorningEnd] = useState("");

  const [afternoonStart, setAfternoonStart] = useState("");
  const [afternoonEnd, setAfternoonEnd] = useState("");

  useEffect(() => {
    if (open) {

      setExamName(initialData?.examName || "");
      setAcademicSession(initialData?.academicSession || "");

      const [mStart, mEnd] = initialData?.morning?.split(" - ") || ["",""];
      const [aStart, aEnd] = initialData?.afternoon?.split(" - ") || ["",""];

      setMorningStart(mStart);
      setMorningEnd(mEnd);

      setAfternoonStart(aStart);
      setAfternoonEnd(aEnd);
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      examName: examName.trim(),
      academicSession: academicSession.trim(),
      morning: `${morningStart} - ${morningEnd}`,
      afternoon: `${afternoonStart} - ${afternoonEnd}`,
    });
  };

  return (
    <div className="cem-modal-overlay">
      <div className="cem-modal">

        <div className="cem-modal-header">
          <h3>Update Current Exam</h3>
          <button type="button" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="cem-form">

          {/* EXAM */}
          <div className="cem-field">
            <label>Exam Name *</label>
            <select value={examName} onChange={(e) => setExamName(e.target.value)}>
              <option value="">Select Exam</option>
              {EXAM_OPTIONS.map((exam) => (
                <option key={exam} value={exam}>{exam}</option>
              ))}
            </select>
          </div>

          {/* SESSION */}
          <div className="cem-field">
            <label>Academic Session *</label>
            <select
              value={academicSession}
              onChange={(e) => setAcademicSession(e.target.value)}
            >
              <option value="">Select Session</option>
              {SESSION_OPTIONS.map((session) => (
                <option key={session} value={session}>{session}</option>
              ))}
            </select>
          </div>

          {/* MORNING TIME */}
          <div className="cem-field">
            <label>Morning Time *</label>

            <div className="cem-time-row">

              <select
                value={morningStart}
                onChange={(e) => setMorningStart(e.target.value)}
              >
                <option value="">Start Time</option>
                {TIME_OPTIONS.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>

              <span className="cem-time-dash">-</span>

              <select
                value={morningEnd}
                onChange={(e) => setMorningEnd(e.target.value)}
              >
                <option value="">End Time</option>
                {TIME_OPTIONS.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>

            </div>
          </div>

          {/* AFTERNOON TIME */}
          <div className="cem-field">
            <label>Afternoon Time *</label>

            <div className="cem-time-row">

              <select
                value={afternoonStart}
                onChange={(e) => setAfternoonStart(e.target.value)}
              >
                <option value="">Start Time</option>
                {TIME_OPTIONS.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>

              <span className="cem-time-dash">-</span>

              <select
                value={afternoonEnd}
                onChange={(e) => setAfternoonEnd(e.target.value)}
              >
                <option value="">End Time</option>
                {TIME_OPTIONS.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>

            </div>
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
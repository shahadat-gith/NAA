import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  CLASS_OPTIONS,
  STREAM_OPTIONS,
  SUBJECT_OPTIONS,
} from "../../../../utils/academicOptions";
import { formatClassName } from "../../../../utils/formatclass";
import "./ExamModal.css";

const MEDIUM_OPTIONS = ["english", "assamese"];

const EXAM_CENTER_OPTIONS = [
  "Nashib Ali Academy North Building",
  "Nashib Ali Academy South Building",
];

const ExamModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
  loading,
}) => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStream, setSelectedStream] = useState("");
  const [medium, setMedium] = useState("");
  const [examCenter, setExamCenter] = useState("");
  const [exams, setExams] = useState([]);

  /* ================= RESET FORM ================= */
  const resetForm = () => {
    setSelectedClass("");
    setSelectedStream("");
    setMedium("");
    setExamCenter("");
    setExams([]);
  };

  /* ================= LOAD EDIT DATA ================= */
  useEffect(() => {
    if (initialData && open) {
      setSelectedClass(initialData.class || "");
      setSelectedStream(initialData.stream || "");
      setMedium(initialData.medium || "");
      setExamCenter(initialData.examCenter || "");
      setExams(initialData.exams || []);
    }

    if (!initialData && open) {
      resetForm();
    }
  }, [initialData, open]);

  if (!open) return null;

  const addExam = () => {
    setExams((prev) => [
      ...prev,
      { subject: "", date: "", shift: "morning", time: "" },
    ]);
  };

  const updateExam = (index, field, value) => {
    const updated = [...exams];
    updated[index][field] = value;
    setExams(updated);
  };

  const removeExam = (index) => {
    setExams(exams.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedClass) return toast.error("Class is required");
    if (["11", "12"].includes(selectedClass) && !selectedStream)
      return toast.error("Stream is required");

    onSubmit({
      class: selectedClass,
      stream: selectedStream,
      medium,
      examCenter,
      exams,
    });

    // ✅ reset after submit
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="act-modal-overlay">
      <div className="act-modal">
        <div className="act-modal-header">
          <h3>Exam Schedule</h3>
          <button type="button" onClick={handleClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="act-form">
          {/* Class / Stream / Medium */}
          <div className="act-row">
            <div className="act-field">
              <label>Class *</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">Select Class</option>
                {Object.values(CLASS_OPTIONS)
                  .flat()
                  .filter((v, i, a) => a.indexOf(v) === i)
                  .map((cls) => (
                    <option key={cls} value={cls}>
                      {formatClassName(cls)}
                    </option>
                  ))}
              </select>
            </div>

            {["11", "12"].includes(selectedClass) && (
              <div className="act-field">
                <label>Stream *</label>
                <select
                  value={selectedStream}
                  onChange={(e) => setSelectedStream(e.target.value)}
                >
                  <option value="">Select Stream</option>
                  {STREAM_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="act-field">
              <label>Medium</label>
              <select
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
              >
                <option value="">Select Medium</option>
                {MEDIUM_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Exam Center (DROPDOWN) */}
          <div className="act-field">
            <label>Exam Center</label>
            <select
              value={examCenter}
              onChange={(e) => setExamCenter(e.target.value)}
            >
              <option value="">Select Exam Center</option>
              {EXAM_CENTER_OPTIONS.map((center) => (
                <option key={center} value={center}>
                  {center}
                </option>
              ))}
            </select>
          </div>

          {/* Exams */}
          <div className="act-exams-section">
            <h4>Exam Schedule</h4>

            {exams.map((exam, index) => (
              <div key={index} className="act-exam-card">
                <div className="act-exam-grid">
                  <select
                    value={exam.subject}
                    onChange={(e) =>
                      updateExam(index, "subject", e.target.value)
                    }
                  >
                    <option value="">Subject</option>
                    {SUBJECT_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>

                  <input
                    type="date"
                    value={exam.date}
                    onChange={(e) =>
                      updateExam(index, "date", e.target.value)
                    }
                  />

                  <select
                    value={exam.shift}
                    onChange={(e) =>
                      updateExam(index, "shift", e.target.value)
                    }
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                  </select>

                  <input
                    placeholder="9:00 AM - 12:00 PM"
                    value={exam.time}
                    onChange={(e) =>
                      updateExam(index, "time", e.target.value)
                    }
                  />
                </div>

                <button type="button" onClick={() => removeExam(index)}>
                  Remove
                </button>
              </div>
            ))}

            <button type="button" onClick={addExam}>
              + Add Exam
            </button>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExamModal;

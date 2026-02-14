import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  CLASS_OPTIONS,
  STREAM_OPTIONS,
  SUBJECT_OPTIONS,
  TIME_OPTIONS,
  EXAM_CENTER_OPTIONS
} from "../../../../utils/academicOptions";
import { formatClassName } from "../../../../utils/utility";
import "../../Styles/RoutineModal.css";

/* ================= COMPONENT ================= */

const RoutineModal = ({
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

  /* ================= EXAM HELPERS ================= */

  const addExam = () => {
    setExams((prev) => [
      ...prev,
      { subject: "", date: "", shift: "morning", time: "" },
    ]);
  };

  const updateExam = (index, field, value) => {
    const updated = [...exams];
    updated[index] = { ...updated[index], [field]: value };
    setExams(updated);
  };

  const updateTimeRange = (index, type, value) => {
    const updated = [...exams];
    const currentExam = updated[index];

    // Split existing time or default to empty
    let [start, end] = (currentExam.time || "").split(" - ");

    if (type === "start") start = value;
    if (type === "end") end = value;

    // Combine them with the " - " separator
    updated[index].time = start && end ? `${start} - ${end}` : (start || end || "");

    setExams(updated);
  };

  const removeExam = (index) => {
    setExams(exams.filter((_, i) => i !== index));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedClass) return toast.error("Class is required");
    if (["11", "12"].includes(selectedClass) && !selectedStream)
      return toast.error("Stream is required");

    for (const exam of exams) {
      if (!exam.subject || !exam.date || !exam.time || !exam.time.includes(" - ")) {
        return toast.error(
          "Please complete subject, date, and both start/end times"
        );
      }
    }

    onSubmit({
      class: selectedClass,
      stream: selectedStream,
      medium,
      examCenter,
      exams,
    });

    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  /* ================= UI ================= */

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
                  onChange={(e) =>
                    setSelectedStream(e.target.value)
                  }
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
                {["english", "assamese"].map((m) => (
                  <option key={m} value={m}>
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Exam Center */}
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

            {exams.map((exam, index) => {
              // Deriving start/end values for the dropdowns from the combined string
              const [startTime = "", endTime = ""] = (exam.time || "").split(" - ");

              return (
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

                    {/* Start Time */}
                    <select
                      value={startTime}
                      onChange={(e) =>
                        updateTimeRange(index, "start", e.target.value)
                      }
                    >
                      <option value="">Start Time</option>
                      {TIME_OPTIONS.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>

                    {/* End Time */}
                    <select
                      value={endTime}
                      onChange={(e) =>
                        updateTimeRange(index, "end", e.target.value)
                      }
                    >
                      <option value="">End Time</option>
                      {TIME_OPTIONS.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button type="button" onClick={() => removeExam(index)}>
                    Remove Exam
                  </button>
                </div>
              );
            })}

            <button type="button" className="act-add-exam" onClick={addExam}>
              + Add Exam
            </button>
          </div>

          {/* Actions */}
          <div className="act-actions">
            <button type="button" className="act-cancel" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="act-submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoutineModal;

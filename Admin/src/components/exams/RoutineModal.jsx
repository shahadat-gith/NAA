import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { X, Plus, Trash2, Calendar } from "lucide-react";

import {
  CLASS_OPTIONS,
  STREAM_OPTIONS,
  SUBJECT_OPTIONS,
  TIME_OPTIONS,
  EXAM_CENTER_OPTIONS,
} from "../../utils/academicOptions";

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
    } else if (open) {
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
    const current = updated[index];
    let [start = "", end = ""] = (current.time || "").split(" - ");

    if (type === "start") start = value;
    if (type === "end") end = value;

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
    if (["11", "12"].includes(selectedClass) && !selectedStream) {
      return toast.error("Stream is required for Class 11 & 12");
    }

    for (const exam of exams) {
      if (!exam.subject || !exam.date || !exam.time?.includes(" - ")) {
        return toast.error("Please complete all exam details (subject, date, and time range)");
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

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1200] flex items-center justify-center p-4">
      <div
        className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[var(--border-default)]">
          <div className="flex items-center gap-3">
            <Calendar className="text-[var(--color-primary)]" size={26} />
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              {initialData ? "Edit Exam Schedule" : "Add New Exam Schedule"}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-[var(--bg-surface-2)] rounded-xl transition-colors"
          >
            <X size={26} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-8 space-y-8">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Class <span className="text-red-500">*</span></label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                required
              >
                <option value="">Select Class</option>
                {Object.values(CLASS_OPTIONS).flat().filter((v, i, a) => a.indexOf(v) === i).map((cls) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>

            {["11", "12"].includes(selectedClass) && (
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Stream <span className="text-red-500">*</span></label>
                <select
                  value={selectedStream}
                  onChange={(e) => setSelectedStream(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                  required
                >
                  <option value="">Select Stream</option>
                  {STREAM_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Medium</label>
              <select
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
              >
                <option value="">Select Medium</option>
                <option value="english">English</option>
                <option value="assamese">Assamese</option>
              </select>
            </div>
          </div>

          {/* Exam Center */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Exam Center</label>
            <select
              value={examCenter}
              onChange={(e) => setExamCenter(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
            >
              <option value="">Select Exam Center</option>
              {EXAM_CENTER_OPTIONS.map((center) => (
                <option key={center} value={center}>{center}</option>
              ))}
            </select>
          </div>

          {/* Dynamic Exams */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-lg">Exam Schedule</h4>
              <button
                type="button"
                onClick={addExam}
                className="flex items-center gap-2 px-5 py-2 bg-[var(--bg-base)] border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] rounded-2xl text-sm font-medium transition-all"
              >
                <Plus size={18} />
                Add Exam
              </button>
            </div>

            <div className="space-y-4">
              {exams.map((exam, index) => {
                const [startTime = "", endTime = ""] = (exam.time || "").split(" - ");
                return (
                  <div key={index} className="bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl p-5 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div className="md:col-span-2">
                      <label className="block text-xs text-[var(--text-muted)] mb-1">Subject</label>
                      <select
                        value={exam.subject}
                        onChange={(e) => updateExam(index, "subject", e.target.value)}
                        className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                        required
                      >
                        <option value="">Select Subject</option>
                        {SUBJECT_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-[var(--text-muted)] mb-1">Date</label>
                      <input
                        type="date"
                        value={exam.date}
                        onChange={(e) => updateExam(index, "date", e.target.value)}
                        className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-[var(--text-muted)] mb-1">Shift</label>
                      <select
                        value={exam.shift}
                        onChange={(e) => updateExam(index, "shift", e.target.value)}
                        className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                      >
                        <option value="morning">Morning</option>
                        <option value="afternoon">Afternoon</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-[var(--text-muted)] mb-1">Start</label>
                        <select
                          value={startTime}
                          onChange={(e) => updateTimeRange(index, "start", e.target.value)}
                          className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                          required
                        >
                          <option value="">Start</option>
                          {TIME_OPTIONS.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-[var(--text-muted)] mb-1">End</label>
                        <select
                          value={endTime}
                          onChange={(e) => updateTimeRange(index, "end", e.target.value)}
                          className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                          required
                        >
                          <option value="">End</option>
                          {TIME_OPTIONS.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeExam(index)}
                      className="text-red-500 hover:text-red-600 p-3 self-end"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-4 border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] rounded-2xl font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-bright)] text-white font-semibold rounded-2xl transition-all disabled:opacity-70"
            >
              {loading ? "Saving Schedule..." : "Save Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoutineModal;
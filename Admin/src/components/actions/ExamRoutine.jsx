import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { X, Plus, Trash2, Calendar } from "lucide-react";

import { Button } from "../common/Button";
import { AdminContext } from "../../context/AdminContext";

import {
  CLASS_OPTIONS,
  STREAM_OPTIONS,
  SUBJECT_OPTIONS,
  TIME_OPTIONS,
  EXAM_CENTER_OPTIONS,
} from "../../utils/academicOptions";

const ExamRoutine = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { backendUrl, adminToken } = useContext(AdminContext);

  const initialData = location.state?.initialData;

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStream, setSelectedStream] = useState("");
  const [medium, setMedium] = useState("");
  const [examCenter, setExamCenter] = useState("");
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);

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
    if (initialData) {
      setSelectedClass(initialData.class || "");
      setSelectedStream(initialData.stream || "");
      setMedium(initialData.medium || "");
      setExamCenter(initialData.examCenter || "");
      setExams(initialData.exams || []);
    } else {
      resetForm();
    }
  }, [initialData]);

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

    updated[index].time = start && end ? `${start} - ${end}` : start || end || "";
    setExams(updated);
  };

  const removeExam = (index) => {
    setExams(exams.filter((_, i) => i !== index));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
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

    setLoading(true);

    const payload = {
      class: selectedClass,
      stream: selectedStream,
      medium,
      examCenter,
      exams,
    };

    try {
      const res = await axios.put(
        `${backendUrl}/api/settings/update`,
        payload,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      if (res.data.success) {
        toast.success(initialData ? "Exam schedule updated successfully!" : "Exam schedule saved successfully!");
        navigate(-1);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save schedule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            {initialData ? "Edit Exam Schedule" : "Create New Exam Schedule"}
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="p-3 rounded-2xl border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] transition-all"
          >
            <X size={26} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                  Class <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                  required
                >
                  <option value="">Select Class</option>
                  {Object.values(CLASS_OPTIONS)
                    .flat()
                    .filter((v, i, a) => a.indexOf(v) === i)
                    .map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                </select>
              </div>

              {["11", "12"].includes(selectedClass) && (
                <div>
                  <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                    Stream <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedStream}
                    onChange={(e) => setSelectedStream(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                    required
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

              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                  Medium
                </label>
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
            <div className="mt-6">
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                Exam Center
              </label>
              <select
                value={examCenter}
                onChange={(e) => setExamCenter(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
              >
                <option value="">Select Exam Center</option>
                {EXAM_CENTER_OPTIONS.map((center) => (
                  <option key={center} value={center}>
                    {center}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dynamic Exams */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Exam Schedule</h3>
              <Button type="button" onClick={addExam}>
                Add Exam
              </Button>
            </div>

            <div className="space-y-4">
              {exams.map((exam, index) => {
                const [startTime = "", endTime = ""] = (exam.time || "").split(" - ");
                return (
                  <div
                    key={index}
                    className="bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl p-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
                  >
                    {/* Subject */}
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
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Date */}
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

                    {/* Shift */}
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

                    {/* Time Range */}
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
                            <option key={t} value={t}>
                              {t}
                            </option>
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
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => removeExam(index)}
                    >
                      <Trash2 size={20} />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            loading={loading}
          >
            {initialData ? "Update Schedule" : "Save Schedule"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ExamRoutine;
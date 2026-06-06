import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { X, Calendar, Clock } from "lucide-react";

import {
  EXAM_OPTIONS,
  SESSION_OPTIONS,
  TIME_OPTIONS,
} from "../../utils/academicOptions";

const CurrentExamModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
  loading,
}) => {
  const [examName, setExamName] = useState("");
  const [academicSession, setAcademicSession] = useState("");

  const [morningStart, setMorningStart] = useState("");
  const [morningEnd, setMorningEnd] = useState("");

  const [afternoonStart, setAfternoonStart] = useState("");
  const [afternoonEnd, setAfternoonEnd] = useState("");

  // Load initial data
  useEffect(() => {
    if (open && initialData) {
      setExamName(initialData.examName || "");
      setAcademicSession(initialData.academicSession || "");

      const [mStart = "", mEnd = ""] = (initialData.morning || "").split(" - ");
      const [aStart = "", aEnd = ""] = (initialData.afternoon || "").split(" - ");

      setMorningStart(mStart);
      setMorningEnd(mEnd);
      setAfternoonStart(aStart);
      setAfternoonEnd(aEnd);
    } else if (open) {
      // Reset form
      setExamName("");
      setAcademicSession("");
      setMorningStart("");
      setMorningEnd("");
      setAfternoonStart("");
      setAfternoonEnd("");
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!examName || !academicSession) {
      return toast.error("Exam name and academic session are required");
    }

    if (!morningStart || !morningEnd || !afternoonStart || !afternoonEnd) {
      return toast.error("Please set both morning and afternoon timings");
    }

    onSubmit({
      examName,
      academicSession,
      morning: `${morningStart} - ${morningEnd}`,
      afternoon: `${afternoonStart} - ${afternoonEnd}`,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1200] flex items-center justify-center p-4">
      <div
        className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl w-full max-w-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[var(--border-default)]">
          <div className="flex items-center gap-3">
            <Calendar className="text-[var(--color-primary)]" size={26} />
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Update Current Exam</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--bg-surface-2)] rounded-xl transition-colors"
          >
            <X size={26} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-8 space-y-8">
          {/* Exam Name & Session */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                Exam Name <span className="text-red-500">*</span>
              </label>
              <select
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                required
              >
                <option value="">Select Exam</option>
                {EXAM_OPTIONS.map((exam) => (
                  <option key={exam} value={exam}>{exam}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                Academic Session <span className="text-red-500">*</span>
              </label>
              <select
                value={academicSession}
                onChange={(e) => setAcademicSession(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                required
              >
                <option value="">Select Session</option>
                {SESSION_OPTIONS.map((session) => (
                  <option key={session} value={session}>{session}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Morning Shift */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-3 flex items-center gap-2">
              <Clock size={18} /> Morning Shift
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">Start Time</label>
                <select
                  value={morningStart}
                  onChange={(e) => setMorningStart(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                  required
                >
                  <option value="">Start Time</option>
                  {TIME_OPTIONS.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">End Time</label>
                <select
                  value={morningEnd}
                  onChange={(e) => setMorningEnd(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                  required
                >
                  <option value="">End Time</option>
                  {TIME_OPTIONS.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Afternoon Shift */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-3 flex items-center gap-2">
              <Clock size={18} /> Afternoon Shift
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">Start Time</label>
                <select
                  value={afternoonStart}
                  onChange={(e) => setAfternoonStart(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                  required
                >
                  <option value="">Start Time</option>
                  {TIME_OPTIONS.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">End Time</label>
                <select
                  value={afternoonEnd}
                  onChange={(e) => setAfternoonEnd(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                  required
                >
                  <option value="">End Time</option>
                  {TIME_OPTIONS.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] rounded-2xl font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-bright)] text-white font-semibold rounded-2xl transition-all disabled:opacity-70"
            >
              {loading ? "Saving..." : "Save Exam Details"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CurrentExamModal;
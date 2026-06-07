import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { X, Calendar, Clock } from "lucide-react";

import { Button } from "../common/Button";
import { AdminContext } from "../../context/AdminContext";

import {
  EXAM_OPTIONS,
  SESSION_OPTIONS,
  TIME_OPTIONS,
} from "../../utils/academicOptions";

const CurrentExamUpdate = () => {
  const navigate = useNavigate();
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [examName, setExamName] = useState("");
  const [academicSession, setAcademicSession] = useState("");

  const [morningStart, setMorningStart] = useState("");
  const [morningEnd, setMorningEnd] = useState("");

  const [afternoonStart, setAfternoonStart] = useState("");
  const [afternoonEnd, setAfternoonEnd] = useState("");

  const [loading, setLoading] = useState(false);

  const location = useLocation()

  const {initialData} = location.state;

  // Load initial data
  useEffect(() => {
    if (initialData) {
      setExamName(initialData.examName || "");
      setAcademicSession(initialData.academicSession || "");

      const [mStart = "", mEnd = ""] = (initialData.morning || "").split(" - ");
      const [aStart = "", aEnd = ""] = (initialData.afternoon || "").split(" - ");

      setMorningStart(mStart);
      setMorningEnd(mEnd);
      setAfternoonStart(aStart);
      setAfternoonEnd(aEnd);
    } else {
      // Reset form
      setExamName("");
      setAcademicSession("");
      setMorningStart("");
      setMorningEnd("");
      setAfternoonStart("");
      setAfternoonEnd("");
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!examName || !academicSession) {
      return toast.error("Exam name and academic session are required");
    }

    if (!morningStart || !morningEnd || !afternoonStart || !afternoonEnd) {
      return toast.error("Please set both morning and afternoon timings");
    }

    setLoading(true);

    const payload = {
      examName,
      academicSession,
      morning: `${morningStart} - ${morningEnd}`,
      afternoon: `${afternoonStart} - ${afternoonEnd}`,
    };

    try {
      const res = await axios.post(
        `${backendUrl}/api/settings/exam/upsert`,
        payload,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      if (res.data.success) {
        toast.success("Current exam updated successfully");
        navigate(-1);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update exam");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <div>
        {/* Header */}
        <div className="flex justify-between items-center gap-4 mb-8">
         
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Update Current Exam</h1>

           <button
            onClick={() => navigate(-1)}
            className="p-3 rounded-2xl border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
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

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full"
          >
            Save Exam Details
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CurrentExamUpdate;
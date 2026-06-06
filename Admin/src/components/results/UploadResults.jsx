import React, { useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { X, Upload, FileSpreadsheet } from "lucide-react";

import { AdminContext } from "../../context/AdminContext";
import {
  CLASS_OPTIONS,
  STREAM_OPTIONS,
  EXAM_OPTIONS,
  SESSION_OPTIONS,
} from "../../utils/academicOptions";

const UploadResults = ({ isOpen, onClose, onSuccess }) => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [medium, setMedium] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [stream, setStream] = useState("");
  const [examName, setExamName] = useState("");
  const [academicSession, setAcademicSession] = useState("");
  const [maxMarksPerSubject, setMaxMarksPerSubject] = useState("");

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const availableClasses = medium ? CLASS_OPTIONS[medium] || [] : [];
  const isSeniorClass = (cls) => cls === "11" || cls === "12";

  const resetForm = () => {
    setFile(null);
    setMedium("");
    setSelectedClass("");
    setStream("");
    setExamName("");
    setAcademicSession("");
    setMaxMarksPerSubject("");
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const submitResult = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select an Excel file");

    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("class", selectedClass);
    formData.append("medium", medium);
    formData.append("stream", isSeniorClass(selectedClass) ? stream : "");
    formData.append("examName", examName);
    formData.append("academicSession", academicSession);
    formData.append("maxMarksPerSubject", maxMarksPerSubject);

    try {
      const res = await axios.post(
        `${backendUrl}/api/results/upload`,
        formData,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );

      if (res.data.success) {
        setSuccessMsg(`✅ Successfully uploaded ${res.data.count || 0} results`);
        toast.success("Results uploaded successfully!");
        resetForm();
        onSuccess?.();
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Upload failed";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1100] flex items-center justify-center p-4">
      <div
        className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl w-full max-w-lg max-h-[70vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[var(--border-default)] flex-shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Upload Results</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-[var(--bg-surface-2)] rounded-xl transition-colors"
          >
            <X size={26} />
          </button>
        </div>

        {/* Scrollable Content */}
        <form
          onSubmit={submitResult}
          className="flex-1 overflow-auto p-8 space-y-6"
        >
          {successMsg && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded-2xl text-center font-medium">
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-500 rounded-2xl text-center font-medium">
              {errorMsg}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Medium <span className="text-red-500">*</span></label>
              <select
                value={medium}
                onChange={(e) => {
                  setMedium(e.target.value);
                  setSelectedClass("");
                  setStream("");
                }}
                required
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
              >
                <option value="">Select Medium</option>
                <option value="english">English</option>
                <option value="assamese">Assamese</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Class <span className="text-red-500">*</span></label>
              <select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setStream("");
                }}
                disabled={!medium}
                required
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none disabled:opacity-60"
              >
                <option value="">Select Class</option>
                {availableClasses.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {isSeniorClass(selectedClass) && (
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Stream <span className="text-red-500">*</span></label>
                <select
                  value={stream}
                  onChange={(e) => setStream(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                >
                  <option value="">Select Stream</option>
                  {STREAM_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Exam Name <span className="text-red-500">*</span></label>
              <select
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
              >
                <option value="">Select Exam</option>
                {EXAM_OPTIONS.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Academic Session <span className="text-red-500">*</span></label>
              <select
                value={academicSession}
                onChange={(e) => setAcademicSession(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
              >
                <option value="">Select Session</option>
                {SESSION_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Max Marks per Subject <span className="text-red-500">*</span></label>
              <input
                type="number"
                value={maxMarksPerSubject}
                onChange={(e) => setMaxMarksPerSubject(e.target.value)}
                placeholder="e.g. 100"
                required
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Excel File (.xlsx) <span className="text-red-500">*</span></label>
              <div className="border-2 border-dashed border-[var(--border-default)] rounded-3xl p-8 text-center hover:border-[var(--color-primary)] transition-colors">
                <Upload size={48} className="mx-auto text-[var(--text-muted)] mb-3" />
                <p className="text-[var(--text-secondary)] mb-1">Click to upload Excel file</p>
                <p className="text-xs text-[var(--text-muted)]">Only .xlsx files supported</p>

                <input
                  type="file"
                  accept=".xlsx"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                  id="result-file"
                  required
                />
                <label
                  htmlFor="result-file"
                  className="mt-4 inline-block px-6 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] rounded-2xl cursor-pointer text-sm font-medium"
                >
                  Choose File
                </label>

                {file && (
                  <p className="mt-3 text-sm text-emerald-500 font-medium">Selected: {file.name}</p>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Fixed Footer */}
        <div className="p-6 border-t border-[var(--border-default)] flex gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={submitResult}
            disabled={loading || !file}
            className="flex-1 py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-bright)] text-white font-semibold rounded-2xl transition-all disabled:opacity-60"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadResults;
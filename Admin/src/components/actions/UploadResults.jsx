import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
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
import { Button } from "../common/Button";

const UploadResults = ({ onSuccess }) => {
  const navigate = useNavigate();
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

  const handleSubmit = async (e) => {
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
    <div className="min-h-screen bg-[var(--bg-base)]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border-default)]">
        <div className="flex items-center gap-3">
          <FileSpreadsheet className="text-[var(--color-primary)]" size={28} />
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Upload Results</h1>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="p-3 rounded-2xl border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] transition-all"
        >
          <X size={26} />
        </button>
      </div>

      <div className="bg-[var(--bg-surface)] border-b border-[var(--border-default)]">
        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
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
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                Medium <span className="text-red-500">*</span>
              </label>
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
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                Class <span className="text-red-500">*</span>
              </label>
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
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                  Stream <span className="text-red-500">*</span>
                </label>
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
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                Exam Name <span className="text-red-500">*</span>
              </label>
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
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                Academic Session <span className="text-red-500">*</span>
              </label>
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
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                Max Marks per Subject <span className="text-red-500">*</span>
              </label>
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
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                Excel File (.xlsx) <span className="text-red-500">*</span>
              </label>
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
      </div>

      {/* Upload Button */}
      <div className="p-4 md:p-6">
        <Button
          onClick={handleSubmit}
          disabled={loading || !file}
          variant="success"
          loading={loading}
          className="w-full"
        >
          {loading ? "Uploading..." : "Upload Results"}
        </Button>
      </div>
    </div>
  );
};

export default UploadResults;
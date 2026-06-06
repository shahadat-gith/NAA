import React, { useState, useContext } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { X } from "lucide-react";

import { AdminContext } from "../../context/AdminContext";
import { CLASS_OPTIONS, STREAM_OPTIONS } from "../../utils/academicOptions";

const PromoteStudentsModal = ({ isOpen, onClose, onSuccess }) => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    medium: "",
    class: "",
    stream: "",
    nextClass: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "medium" ? { class: "", stream: "", nextClass: "" } : {}),
      ...(name === "class" ? { stream: "", nextClass: "" } : {}),
    }));
  };

  const handleClose = () => {
    setFormData({
      medium: "",
      class: "",
      stream: "",
      nextClass: "",
    });
    setLoading(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { medium, class: studentClass, stream, nextClass } = formData;

    if (!medium || !studentClass || !nextClass) {
      return toast.error("Please select medium, current class, and next class");
    }

    if (["11", "12"].includes(studentClass) && !stream) {
      return toast.error("Stream is required for Class 11 and 12");
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${backendUrl}/api/student/promote`,
        { medium, class: studentClass, stream, nextClass },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      if (res.data.success) {
        toast.success(`Successfully promoted ${res.data.promotedCount || 0} students`);
        onSuccess?.();
        handleClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to promote students");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1000] flex items-center justify-center p-4">
      <div
        className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[var(--border-default)]">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Promote Students</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-[var(--bg-surface-2)] rounded-xl transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-5">
            {/* Medium */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                Medium <span className="text-red-500">*</span>
              </label>
              <select
                name="medium"
                value={formData.medium}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
              >
                <option value="">Select Medium</option>
                <option value="english">English</option>
                <option value="assamese">Assamese</option>
              </select>
            </div>

            {/* Current Class */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                Current Class <span className="text-red-500">*</span>
              </label>
              <select
                name="class"
                value={formData.class}
                onChange={handleChange}
                disabled={!formData.medium}
                required
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none disabled:opacity-60"
              >
                <option value="">Select Current Class</option>
                {formData.medium &&
                  CLASS_OPTIONS[formData.medium].map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
              </select>
            </div>

            {/* Stream (for Class 11 & 12) */}
            {["11", "12"].includes(formData.class) && (
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                  Stream <span className="text-red-500">*</span>
                </label>
                <select
                  name="stream"
                  value={formData.stream}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                >
                  <option value="">Select Stream</option>
                  {STREAM_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Next Class */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                Promote To <span className="text-red-500">*</span>
              </label>
              <select
                name="nextClass"
                value={formData.nextClass}
                onChange={handleChange}
                disabled={!formData.class}
                required
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none disabled:opacity-60"
              >
                <option value="">Select Next Class</option>
                {formData.medium &&
                  CLASS_OPTIONS[formData.medium]
                    .filter((cls) => cls !== formData.class)
                    .map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-bright)] text-white font-semibold rounded-2xl transition-all disabled:opacity-70 mt-4"
          >
            {loading ? "Promoting Students..." : "Promote Students"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PromoteStudentsModal;
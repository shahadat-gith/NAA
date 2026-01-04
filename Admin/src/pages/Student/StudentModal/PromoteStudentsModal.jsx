import React, { useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AdminContext } from "../../../context/AdminContext";
import { CLASS_OPTIONS, STREAM_OPTIONS } from "../../../utils/academicOptions";
import { formatClassName } from "../../../utils/utility";
import "./PromoteStudentsModal.css";

const PromoteStudentsModal = ({ isOpen, onClose, fetchStudents }) => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    medium: "",
    class: "",
    stream: "",
    nextClass: "",
  });

  if (!isOpen) return null;

  /* ================= HANDLERS ================= */

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
      return toast.error("Please select medium, class and next class");
    }

    if (["11", "12"].includes(studentClass) && !stream) {
      return toast.error("Stream is required for class 11 and 12");
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${backendUrl}/api/student/promote`,
        {
          medium,
          class: studentClass,
          stream,
          nextClass,
        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(
          `Students promoted successfully (${res.data.promotedCount})`
        );
        fetchStudents?.();
        handleClose();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to promote students"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="ps-modal-overlay" onClick={handleClose}>
      <div
        className="ps-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="ps-modal-header">
          <h2>Promote Students</h2>
          <button className="ps-close-button" onClick={handleClose}>
            ✕
          </button>
        </div>

        {/* Form */}
        <form className="ps-form" onSubmit={handleSubmit}>
          {/* Medium */}
          <select
            name="medium"
            value={formData.medium}
            onChange={handleChange}
            required
          >
            <option value="">Select Medium</option>
            <option value="english">English</option>
            <option value="assamese">Assamese</option>
          </select>

          {/* Current Class */}
          <select
            name="class"
            value={formData.class}
            onChange={handleChange}
            required
            disabled={!formData.medium}
          >
            <option value="">Select Current Class</option>
            {formData.medium &&
              CLASS_OPTIONS[formData.medium].map((cls) => (
                <option key={cls} value={cls}>
                  {formatClassName(cls)}
                </option>
              ))}
          </select>

          {/* Stream (only for 11/12) */}
          {["11", "12"].includes(formData.class) && (
            <select
              name="stream"
              value={formData.stream}
              onChange={handleChange}
              required
            >
              <option value="">Select Stream</option>
              {STREAM_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          )}

          {/* Next Class */}
          <select
            name="nextClass"
            value={formData.nextClass}
            onChange={handleChange}
            required
            disabled={!formData.class}
          >
            <option value="">Select Next Class</option>
            {formData.medium &&
              CLASS_OPTIONS[formData.medium]
                .filter((cls) => cls !== formData.class)
                .map((cls) => (
                  <option key={cls} value={cls}>
                    {formatClassName(cls)}
                  </option>
                ))}
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "Promoting..." : "Promote Students"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PromoteStudentsModal;

import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/TimetableUpdateModal.css";
import { CLASS_OPTIONS, SUBJECT_OPTIONS } from "../../Utils/utility";

const TimetableUpdateModal = ({
  isOpen,
  onClose,
  selectedDay = "Monday",
  currentSchedule = [],
  onUpdateSuccess,
}) => {
  const { backendUrl } = useContext(AppContext);

  const token = localStorage.getItem("teacher-token");

  // Only selected day's schedule
  const [scheduleList, setScheduleList] = useState(currentSchedule || []);

  const [selectedMedium, setSelectedMedium] = useState("english");

  const [formData, setFormData] = useState({
    class: CLASS_OPTIONS.english[0],
    subject: SUBJECT_OPTIONS[0],
    timeSlot: "",
  });

  const [submitting, setSubmitting] = useState(false);

  // Sync modal state
  useEffect(() => {
    if (isOpen) {
      setScheduleList(currentSchedule || []);
    }
  }, [currentSchedule, isOpen]);

  // Reset class on medium change
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      class: CLASS_OPTIONS[selectedMedium][0],
    }));
  }, [selectedMedium]);

  if (!isOpen) return null;

  // Input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add new schedule
  const addScheduleRow = (e) => {
    e.preventDefault();

    if (!formData.class || !formData.subject || !formData.timeSlot.trim()) {
      toast.error("Please fill all fields.");

      return;
    }

    const newSlotRow = {
      class: formData.class,
      medium: selectedMedium,
      subject: formData.subject,
      timeSlot: formData.timeSlot.trim(),
    };

    setScheduleList((prev) => [...prev, newSlotRow]);

    // Reset only time slot
    setFormData((prev) => ({
      ...prev,
      timeSlot: "",
    }));
  };

  // Remove row
  const removeScheduleRow = (indexToRemove) => {
    setScheduleList((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Submit timetable
  const handleSubmitTimetable = async () => {
    if (!token) {
      toast.error("Authentication expired.");

      return;
    }

    try {
      setSubmitting(true);

      const response = await axios.put(
        `${backendUrl}/api/teacher/timetable/update`,
        {
          day: selectedDay,
          schedule: scheduleList,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        toast.success(
          response.data.message || "Timetable updated successfully!",
        );

        if (onUpdateSuccess) {
          // Send updated day schedule only
          onUpdateSuccess(scheduleList);
        }

        onClose();
      }
    } catch (err) {
      const errMsg =
        err.response?.data?.message || "Failed to update timetable.";

      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="tum-modal-backdrop">
      <div className="tum-modal-content">
        {/* Header */}

        <div className="tum-modal-header">
          <div>
            <h3>Update {selectedDay} Timetable</h3>

            <p className="tum-day-subtitle">Manage classes for {selectedDay}</p>
          </div>

          <button className="tum-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Form */}

        <form className="tum-form" onSubmit={addScheduleRow}>
          <div className="tum-form-grid">
            <div className="tum-form-group">
              <label>Medium</label>

              <select
                value={selectedMedium}
                onChange={(e) => setSelectedMedium(e.target.value)}
                className="tum-select"
              >
                <option value="english">English</option>

                <option value="assamese">Assamese</option>
              </select>
            </div>

            <div className="tum-form-group">
              <label>Class</label>

              <select
                name="class"
                value={formData.class}
                onChange={handleInputChange}
                className="tum-select"
              >
                {CLASS_OPTIONS[selectedMedium].map((cls) => (
                  <option key={cls} value={cls}>
                    Class {cls}
                  </option>
                ))}
              </select>
            </div>

            <div className="tum-form-group">
              <label>Subject</label>

              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="tum-select"
              >
                {SUBJECT_OPTIONS.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            <div className="tum-form-group">
              <label>Time Slot</label>

              <input
                type="text"
                name="timeSlot"
                placeholder="09:00 AM - 09:45 AM"
                value={formData.timeSlot.toUpperCase()}
                onChange={handleInputChange}
                className="tum-input"
              />
            </div>
          </div>

          <button type="submit" className="tum-add-btn">
              <i className="fa-solid fa-plus"></i>
              Add Schedule
            </button>
        </form>

        <hr className="tum-divider" />

        {/* Preview */}

        <div className="tum-preview-section">
          <div className="tum-preview-header">
            <h4>{selectedDay} Schedule</h4>
            <span className="tum-preview-count">
              {scheduleList.length} Classes
            </span>

             <button
              type="button"
              className="tum-save-btn"
              onClick={handleSubmitTimetable}
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save"}
            </button>
          </div>
          {scheduleList.length === 0 ? (
            <p className="tum-empty-text">
              No classes added for {selectedDay}.
            </p>
          ) : (
            <div className="tum-preview-list">
              {scheduleList.map((item, index) => (
                <div className="tum-preview-row" key={index}>
                  <div className="tum-preview-left">
                    <span className="tum-preview-subject">{item.subject}</span>
                    <span className="tum-preview-separator">•</span>
                    <span className="tum-preview-class">
                      Class {item.class}
                    </span>
                    <span className="tum-preview-separator">•</span>
                    <span className="tum-preview-medium">
                      {item.medium} medium
                    </span>
                  </div>
                  <div className="tum-preview-right">
                    <span className="tum-preview-time">{item.timeSlot}</span>
                    <button
                      type="button"
                      className="tum-delete-btn"
                      onClick={() => removeScheduleRow(index)}
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimetableUpdateModal;

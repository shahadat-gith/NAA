import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import '../styles/TimetableUpdateModal.css';
import { CLASS_OPTIONS, SUBJECT_OPTIONS } from '../../Utils/utility';

const TimetableUpdateModal = ({ isOpen, onClose, currentSchedule = [], onUpdateSuccess }) => {
  const { backendUrl } = useContext(AppContext);
  const token = localStorage.getItem("teacher-token");

  const [scheduleList, setScheduleList] = useState(currentSchedule);
  
  // Track selected medium to filter class configurations dynamically
  const [selectedMedium, setSelectedMedium] = useState("english");

  // Single dynamic field row manager state
  const [formData, setFormData] = useState({
    day: "Monday",
    class: CLASS_OPTIONS.english[0], // Safe fallback default
    subject: SUBJECT_OPTIONS[0],      // Safe fallback default
    timeSlot: ""
  });

  const [submitting, setSubmitting] = useState(false);
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Sync state if backend data updates after the component has mounted
  useEffect(() => {
    if (isOpen) {
      setScheduleList(currentSchedule);
    }
  }, [currentSchedule, isOpen]);

  // Adjust default class input instantly whenever medium selection toggle switches
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      class: CLASS_OPTIONS[selectedMedium][0]
    }));
  }, [selectedMedium]);

  if (!isOpen) return null;

  // Handle local text inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add a newly structured slot to the local array state
  const addScheduleRow = (e) => {
    e.preventDefault();
    if (!formData.class || !formData.subject || !formData.timeSlot.trim()) {
      toast.error("Please fill out all fields for this schedule block.");
      return;
    }

    // FIXED: Formulate row structure to strictly match your updated Mongoose Schema keys
    const newSlotRow = {
      day: formData.day,
      class: formData.class, // Sent cleanly (e.g. "10" or "Mukul")
      medium: selectedMedium, // Map directly to the database 'medium' field
      subject: formData.subject,
      timeSlot: formData.timeSlot.trim()
    };

    setScheduleList((prev) => [...prev, newSlotRow]);
    
    // Clear out only time text inputs while locking category states for speed data entry
    setFormData((prev) => ({
      ...prev,
      timeSlot: ""
    }));
  };

  // Remove a row locally before committing changes to database
  const removeScheduleRow = (indexToRemove) => {
    setScheduleList((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Submit the completed array block to your atomic backend controller
  const handleSubmitTimetable = async () => {
    if (!token) {
      toast.error("Authentication expired. Please log in again.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.put(
        `${backendUrl}/api/teacher/timetable/update`, 
        { schedule: scheduleList },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Timetable synced perfectly!");
        if (onUpdateSuccess) onUpdateSuccess(response.data.timetable.schedule); 
        onClose(); 
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to update timetable matrix.";
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="timetable-modal-content">
        <div className="modal-header">
          <h3>Configure Routine Timetable Slots</h3>
          <button className="close-x-btn" onClick={onClose}>&times;</button>
        </div>

        {/* Dynamic Selectors Option Entry Block */}
        <form className="modal-inner-form" onSubmit={addScheduleRow}>
          <div className="form-row-grid">
            <div className="form-group">
              <label>Day</label>
              <select name="day" value={formData.day} onChange={handleInputChange}>
                {daysOfWeek.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Medium Context</label>
              <select 
                value={selectedMedium} 
                onChange={(e) => setSelectedMedium(e.target.value)}
              >
                <option value="english">English Medium</option>
                <option value="assamese">Assamese Medium</option>
              </select>
            </div>

            <div className="form-group">
              <label>Class / Standard</label>
              <select name="class" value={formData.class} onChange={handleInputChange}>
                {CLASS_OPTIONS[selectedMedium].map((cls) => (
                  <option key={cls} value={cls}>Class {cls}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Subject</label>
              <select name="subject" value={formData.subject} onChange={handleInputChange}>
                {SUBJECT_OPTIONS.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            <div className="form-group full-width-input">
              <label>Time Slot Window</label>
              <input 
                type="text" 
                name="timeSlot" 
                placeholder="e.g. 09:00 AM - 09:45 AM" 
                value={formData.timeSlot} 
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <button type="submit" className="add-slot-row-btn">
            <i className="fa-solid fa-plus"></i> Add Slot to Stack
          </button>
        </form>

        <hr className="modal-divider" />

        {/* Interactive Preview List Area */}
        <div className="modal-schedule-preview-area">
          <h4>Compiled Schedule List Stack ({scheduleList.length} items)</h4>
          {scheduleList.length === 0 ? (
            <p className="empty-preview-text">No slots added to the stack yet. Formulate items using the options above.</p>
          ) : (
            <div className="preview-items-scrollbox">
              {scheduleList.map((item, index) => (
                <div className="preview-item-pill" key={index}>
                  <div className="pill-meta">
                    <span className="pill-day">{item.day}</span>
                    <span className="pill-details">
                      <strong>{item.subject}</strong> — Class {item.class} 
                      <span className="pill-medium-tag">({item.medium})</span> [{item.timeSlot}]
                    </span>
                  </div>
                  <button 
                    type="button" 
                    className="remove-pill-btn" 
                    onClick={() => removeScheduleRow(index)}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Controls Footer */}
        <div className="modal-actions-footer">
          <button type="button" className="cancel-btn" onClick={onClose} disabled={submitting}>
            Discard
          </button>
          <button 
            type="button" 
            className="save-submit-btn" 
            onClick={handleSubmitTimetable}
            disabled={submitting}
          >
            {submitting ? "Syncing Workspace..." : "Save & Sync Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimetableUpdateModal;
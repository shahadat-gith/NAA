import React from "react";
import { toast } from "react-hot-toast";
import { deleteStudent } from "../api";
import "./DeleteConfirmPopup.css";

const DeleteConfirmPopup = ({ student, onConfirm, onCancel, backendUrl, adminToken }) => {
  const handleDeleteStudent = async () => {
    try {
      await deleteStudent(backendUrl, adminToken, student._id);
      toast.success("Student deleted successfully");
      onConfirm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete student");
      onCancel();
    }
  };

  return (
    <div className="naa-modal-overlay" onClick={onCancel}>
      <div className="naa-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="naa-modal-header">
          <div className="naa-modal-title">
            <div className="naa-warning-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v6h2V7zm0 8h-2v2h2v-2z" fill="currentColor"/>
              </svg>
            </div>
            <h2>Confirm Deletion</h2>
          </div>
          <button className="naa-close-button" onClick={onCancel} aria-label="Close modal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="naa-delete-modal-content">
          <div>Are you sure you want to delete <strong>{student.name}</strong>?</div>
          <div className="naa-delete-warning-text">This action cannot be undone.</div>
          <div className="naa-form-actions">
            <button onClick={handleDeleteStudent} className="naa-delete-btn">
              Yes, Delete
            </button>
            <button onClick={onCancel} className="naa-cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmPopup;
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import "./DeleteConfirmPopup.css";

const DeleteConfirmPopup = ({
  student,
  onConfirm,
  onCancel,
  backendUrl,
  adminToken,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDeleteStudent = async () => {
    if (!student?._id) return;

    setLoading(true);
    try {
      await axios.delete(
        `${backendUrl}/api/student/${student._id}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      toast.success("Student deleted successfully");
      onConfirm();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete student"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="naa-modal-overlay" onClick={onCancel}>
      <div
        className="naa-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="naa-modal-header">
          <div className="naa-modal-title">
            <div className="naa-warning-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v6h2V7zm0 8h-2v2h2v-2z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h2>Confirm Deletion</h2>
          </div>

          <button
            className="naa-close-button"
            onClick={onCancel}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="naa-delete-modal-content">
          <div>
            Are you sure you want to delete{" "}
            <strong>{student.name}</strong>?
          </div>
          <div className="naa-delete-warning-text">
            This action cannot be undone.
          </div>

          <div className="naa-form-actions">
            <button
              onClick={handleDeleteStudent}
              className="naa-delete-btn"
              disabled={loading}
            >
              {loading ? "Deleting..." : "Yes, Delete"}
            </button>

            <button
              onClick={onCancel}
              className="naa-cancel-btn"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmPopup;

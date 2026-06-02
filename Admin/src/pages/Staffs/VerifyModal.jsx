import React, { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AdminContext } from "../../context/AdminContext";
import "./VerifyModal.css";

const VerifyModal = ({ isOpen, onClose, staffId, staffName, setStaff }) => {
  const { adminToken, backendUrl } = useContext(AdminContext);
  
  const [assignedStaffId, setAssignedStaffId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (!assignedStaffId.trim()) {
      toast.error("Please assign a valid Staff ID to verify this record.");
      return;
    }

    setSubmitting(true);
    try {
      // Dispatches request directly to the admin verification route
      const { data } = await axios.put(
        `${backendUrl}/api/staff/verify/${staffId}`,
        { staffId: assignedStaffId.trim() },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      if (data.success) {
        toast.success(`${staffName} verified successfully!`);
        
        // Directly update the state in StaffDetails with the backend response
        setStaff(data.staff); 
        
        setAssignedStaffId("");
        onClose(); // Seamlessly close the modal container
      }
    } catch (error) {
      console.error("Verification execution runtime exception:", error);
      toast.error(error.response?.data?.message || "Failed to complete verification.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="vmod-overlay" onClick={onClose}>
      <div className="vmod-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Top Close Handle */}
        <header className="vmod-header">
          <h3 className="vmod-title">Verify Staff Member</h3>
          <button type="button" className="vmod-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </header>

        {/* Informative Subtext Body */}
        <div className="vmod-body-prompt">
          <p>
            Please allocate the official school <strong>Staff ID</strong> below to confirm activation for <strong>{staffName}</strong>.
          </p>
        </div>

        {/* Verification Form Execution Layout */}
        <form onSubmit={handleVerifySubmit} className="vmod-form-wrapper">
          <div className="vmod-input-group">
            <label htmlFor="assigned-id-field">Assign Official Staff ID *</label>
            <input
              id="assigned-id-field"
              type="text"
              placeholder="e.g. NAA-2026-042"
              value={assignedStaffId}
              onChange={(e) => setAssignedStaffId(e.target.value)}
              disabled={submitting}
              autoFocus
              required
              className="vmod-text-input"
            />
          </div>

          {/* Action Trigger Buttons Strip */}
          <footer className="vmod-actions-footer">
            <button
              type="button"
              className="vmod-btn btn-secondary-cancel"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="vmod-btn btn-primary-verify"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="vmod-spinner"></span>
                  <span>Activating...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-user-check"></i>
                  <span>Approve & Activate</span>
                </>
              )}
            </button>
          </footer>
        </form>

      </div>
    </div>
  );
};

export default VerifyModal;
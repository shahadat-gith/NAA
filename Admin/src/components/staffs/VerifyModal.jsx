import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { X, CheckCircle, UserCheck } from "lucide-react";

import { AdminContext } from "../../context/AdminContext";

const VerifyModal = ({ isOpen, onClose, staffId, staffName, setStaff }) => {
  const { backendUrl, adminToken } = React.useContext(AdminContext);

  const [assignedStaffId, setAssignedStaffId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleVerifySubmit = async (e) => {
    e.preventDefault();

    if (!assignedStaffId.trim()) {
      return toast.error("Please assign a valid Staff ID");
    }

    setSubmitting(true);

    try {
      const { data } = await axios.put(
        `${backendUrl}/api/staff/verify/${staffId}`,
        { staffId: assignedStaffId.trim() },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      if (data.success) {
        toast.success(`${staffName} has been verified successfully!`);

        if (setStaff && data.staff) {
          setStaff(data.staff);
        }

        setAssignedStaffId("");
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1300] flex items-center justify-center p-4">
      <div
        className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[var(--border-default)]">
          <div className="flex items-center gap-3">
            <UserCheck className="text-emerald-500" size={26} />
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Verify Staff</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--bg-surface-2)] rounded-xl transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8">
          <p className="text-[var(--text-secondary)] mb-6">
            Assign an official <strong>Staff ID</strong> to activate the profile for{" "}
            <strong>{staffName}</strong>.
          </p>

          <form onSubmit={handleVerifySubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                Official Staff ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={assignedStaffId}
                onChange={(e) => setAssignedStaffId(e.target.value)}
                placeholder="e.g. NAA-2026-042"
                className="w-full px-4 py-3.5 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none text-base"
                autoFocus
                required
                disabled={submitting}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="flex-1 py-4 border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] rounded-2xl font-medium transition-all"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting || !assignedStaffId.trim()}
                className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting ? (
                  "Verifying..."
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Verify & Activate
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyModal;
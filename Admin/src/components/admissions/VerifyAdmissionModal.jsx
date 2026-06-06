import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { X, CheckCircle, FileText } from "lucide-react";

import { AdminContext } from "../../context/AdminContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const VerifyAdmissionModal = ({
  isOpen,
  onClose,
  admissionId,
  onSuccess,
}) => {
  const { backendUrl, adminToken } = useContext(AdminContext);
  const navigate = useNavigate();

  const [registrationNo, setRegistrationNo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifySubmit = async () => {
    if (!registrationNo.trim()) {
      return toast.error("Registration number is required");
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admission/verify`,
        {
          admissionId,
          registrationNumber: registrationNo,
        },
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );

      if (data?.success && data?.student) {
        toast.success("Admission verified successfully!");
        onSuccess?.();
        onClose();
        navigate(-1);
      } else {
        toast.error(data?.message || "Verification failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error verifying admission");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1200] flex items-center justify-center p-4">
      <div
        className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[var(--border-default)]">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-emerald-500" size={26} />
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Verify Admission</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--bg-surface-2)] rounded-xl transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
              Assign Registration Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={registrationNo}
              onChange={(e) => setRegistrationNo(e.target.value)}
              placeholder="e.g., NB2025-0456"
              className="w-full px-4 py-3.5 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none text-base"
            />
          </div>

          <p className="text-sm text-[var(--text-secondary)]">
            This will verify the admission
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 px-8 py-6 border-t border-[var(--border-default)]">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-4 border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] rounded-2xl font-medium transition-all"
          >
            Cancel
          </button>

          <button
            onClick={handleVerifySubmit}
            disabled={loading || !registrationNo.trim()}
            className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              "Verifying..."
            ) : (
              <>
                <FileText size={20} />
                Verify
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyAdmissionModal;
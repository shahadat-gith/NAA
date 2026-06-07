import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { X, Upload, User, Edit2 } from "lucide-react";

import { AdminContext } from "../../context/AdminContext";
import { Button } from "../common/Button";


const EditAuthorityModal = ({ open, onClose, authority, onSuccess }) => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [formData, setFormData] = useState({
    role: "",
    name: "",
    image: null,
    signature: null,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authority) {
      setFormData({
        role: authority.role || "",
        name: authority.name || "",
        image: null,
        signature: null,
      });
    }
  }, [authority]);

  if (!open || !authority) return null;

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [field]: file }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.role) {
      return toast.error("Name and Role are required");
    }

    setLoading(true);
    const fd = new FormData();

    if (authority?._id) fd.append("id", authority._id);
    if (formData.name) fd.append("name", formData.name);
    if (formData.role) fd.append("role", formData.role);
    if (formData.image instanceof File) fd.append("image", formData.image);
    if (formData.signature instanceof File) fd.append("signature", formData.signature);

    try {
      await axios.post(`${backendUrl}/api/settings/authority`, fd, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Authority updated successfully!");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save authority");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1100] flex items-center justify-center p-4">
      <div
        className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl w-full max-w-lg max-h-[70vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[var(--border-default)] flex-shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Edit Authority</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--bg-surface-2)] rounded-xl transition-colors"
          >
            <X size={26} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-8 space-y-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Role <span className="text-red-500">*</span></label>
              <input
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                placeholder="e.g. Principal"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Full Name <span className="text-red-500">*</span></label>
              <input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                placeholder="Enter full name"
              />
            </div>

            {/* Profile Photo */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Profile Photo</label>
              <div className="border border-dashed border-[var(--border-default)] rounded-3xl p-8 text-center hover:border-[var(--color-primary)] transition-colors">
                <Upload size={40} className="mx-auto text-[var(--text-muted)] mb-3" />
                <p className="text-sm text-[var(--text-secondary)]">Click to upload new photo</p>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "image")}
                  className="hidden"
                  id="authority-image"
                />
                <label
                  htmlFor="authority-image"
                  className="mt-4 inline-block px-6 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] rounded-2xl cursor-pointer text-sm font-medium"
                >
                  Choose Image
                </label>

                {formData.image && (
                  <p className="mt-3 text-xs text-emerald-500">Selected: {formData.image.name}</p>
                )}
              </div>
            </div>

            {/* Digital Signature */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Digital Signature</label>
              <div className="border border-dashed border-[var(--border-default)] rounded-3xl p-8 text-center hover:border-[var(--color-primary)] transition-colors">
                <Upload size={40} className="mx-auto text-[var(--text-muted)] mb-3" />
                <p className="text-sm text-[var(--text-secondary)]">Upload signature image</p>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "signature")}
                  className="hidden"
                  id="authority-signature"
                />
                <label
                  htmlFor="authority-signature"
                  className="mt-4 inline-block px-6 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] rounded-2xl cursor-pointer text-sm font-medium"
                >
                  Choose Signature
                </label>

                {formData.signature && (
                  <p className="mt-3 text-xs text-emerald-500">Selected: {formData.signature.name}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="p-6 border-t border-[var(--border-default)] flex gap-3 flex-shrink-0">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-bright)] text-white font-semibold rounded-2xl transition-all disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditAuthorityModal;
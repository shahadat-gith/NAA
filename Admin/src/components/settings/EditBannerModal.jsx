import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { X, Upload, Image as ImageIcon } from "lucide-react";

import { AdminContext } from "../../context/AdminContext";

const EditBannerModal = ({ open, image, isAddMode, onClose, onSuccess }) => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) setFile(null);
  }, [open]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!file) {
      return toast.error("Please select an image file");
    }

    const formData = new FormData();
    formData.append("image", file);

    if (!isAddMode && image?._id) {
      formData.append("heroImageId", image._id);
    }

    try {
      setLoading(true);

      await axios.post(
        `${backendUrl}/api/settings/hero-images/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      toast.success(isAddMode ? "Banner image added successfully!" : "Banner image updated successfully!");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1100] flex items-center justify-center p-4">
      <div
        className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl w-full max-w-md max-h-[70vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[var(--border-default)] flex-shrink-0">
          <div className="flex items-center gap-3">
            <ImageIcon className="text-[var(--color-primary)]" size={26} />
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              {isAddMode ? "Add Banner Image" : "Update Banner Image"}
            </h2>
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
          {/* Current Image Preview (for edit mode) */}
          {!isAddMode && image?.url && (
            <div>
              <p className="text-sm font-medium text-[var(--text-muted)] mb-3">Current Banner</p>
              <img
                src={image.url}
                alt="Current Banner"
                className="w-full rounded-2xl border border-[var(--border-default)]"
              />
            </div>
          )}

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
              {isAddMode ? "Select Banner Image" : "Upload New Image"}
            </label>
            <div className="border border-dashed border-[var(--border-default)] rounded-3xl p-10 text-center hover:border-[var(--color-primary)] transition-colors">
              <Upload size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
              <p className="text-[var(--text-secondary)]">Click or drag image here</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Recommended: 1920×800 px or similar</p>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
                id="banner-upload"
              />
              <label
                htmlFor="banner-upload"
                className="mt-6 inline-block px-6 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] rounded-2xl cursor-pointer text-sm font-medium transition-all"
              >
                Choose Image
              </label>

              {file && (
                <p className="mt-4 text-sm text-emerald-500 font-medium">
                  Selected: {file.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="p-6 border-t border-[var(--border-default)] flex gap-3 flex-shrink-0">
          <button
            onClick={handleSubmit}
            disabled={loading || !file}
            className="flex-1 py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-bright)] text-white font-semibold rounded-2xl transition-all disabled:opacity-60"
          >
            {loading ? "Uploading..." : "Save Banner"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBannerModal;
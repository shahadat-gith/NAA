import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { X, Upload } from "lucide-react";

const UpdateAchieverModal = ({
  isOpen,
  onClose,
  backendUrl,
  adminToken,
  achiever,
  onUpdateSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    father: "",
    mother: "",
    village: "",
    percentage: "",
    className: "",
    year: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);

  // Initialize form with existing data
  useEffect(() => {
    if (achiever) {
      setFormData({
        name: achiever.name || "",
        father: achiever.father || "",
        mother: achiever.mother || "",
        village: achiever.village || "",
        percentage: achiever.percentage || "",
        className: achiever.className || "",
        year: achiever.year || "",
      });
      setImagePreview(achiever.image || "");
    }
  }, [achiever]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setUploading(true);
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key]) data.append(key, formData[key]);
    });

    if (image) {
      data.append("image", image);
    }

    try {
      await toast.promise(
        axios.put(
          `${backendUrl}/api/achievers/update-achiever/${achiever._id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
              "Content-Type": "multipart/form-data",
            },
          },
        ),
        {
          pending: "Updating achiever...",
          success: "Achiever updated successfully!",
          error: "Failed to update achiever.",
        },
      );

      onUpdateSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating achiever");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1100] flex items-center justify-center p-4">
      <div
        className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[var(--border-default)]">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            Update Achiever
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--bg-surface-2)] rounded-xl transition-colors"
          >
            <X size={26} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-auto p-8 space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                Father's Name
              </label>
              <input
                type="text"
                name="father"
                value={formData.father}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                Mother's Name
              </label>
              <input
                type="text"
                name="mother"
                value={formData.mother}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                Village
              </label>
              <input
                type="text"
                name="village"
                value={formData.village}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                Percentage (%)
              </label>
              <input
                type="text"
                name="percentage"
                value={formData.percentage}
                onChange={handleInputChange}
                placeholder="e.g., 92.5"
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                Class
              </label>
              <input
                type="text"
                name="className"
                value={formData.className}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                Year
              </label>
              <input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                placeholder="e.g., 2025"
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
              Profile Image
            </label>
            <div className="border border-dashed border-[var(--border-default)] rounded-3xl p-8 text-center">
              {imagePreview ? (
                <div className="flex flex-col items-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-40 h-40 object-cover rounded-2xl mb-4 shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(achiever?.image || "");
                    }}
                    className="text-red-500 hover:text-red-600 text-sm font-medium"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div className="text-[var(--text-muted)]">
                  <Upload size={40} className="mx-auto mb-3" />
                  <p className="text-sm">Click to upload new image</p>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="mt-4 inline-block px-6 py-2.5 bg-[var(--bg-base)] border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] rounded-2xl cursor-pointer text-sm font-medium transition-all"
              >
                Choose Image
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] rounded-2xl font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-bright)] text-white font-semibold rounded-2xl transition-all disabled:opacity-70"
            >
              {uploading ? "Updating..." : "Update Achiever"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateAchieverModal;

import React, { useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { X, Upload, Plus } from "lucide-react";

const AddAchieverModal = ({ 
  isOpen, 
  onClose, 
  backendUrl, 
  adminToken, 
  onAddSuccess 
}) => {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    father: "",
    mother: "",
    village: "",
    percentage: "",
    year: "",
    className: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      toast.error("Please select a valid image file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.percentage || !formData.year || !formData.className) {
      return toast.error("Name, Percentage, Year, and Class are required");
    }

    setUploading(true);
    const form = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key]) form.append(key, formData[key]);
    });

    if (imageFile) form.append("image", imageFile);

    try {
      await toast.promise(
        axios.post(`${backendUrl}/api/achievers/add-achiever`, form, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "multipart/form-data",
          },
        }),
        {
          pending: "Adding achiever...",
          success: "Achiever added successfully!",
          error: "Failed to add achiever.",
        }
      );

      onAddSuccess();
      onClose();
      
      // Reset form
      setFormData({
        name: "",
        father: "",
        mother: "",
        village: "",
        percentage: "",
        year: "",
        className: "",
      });
      setImageFile(null);
      setImagePreview("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding achiever");
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
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center text-white">
              <Plus size={20} />
            </div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Add New Achiever</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--bg-surface-2)] rounded-xl transition-colors"
          >
            <X size={26} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Student Name <span className="text-red-500">*</span></label>
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
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Percentage (%) <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="percentage"
                value={formData.percentage}
                onChange={handleInputChange}
                placeholder="e.g., 95.5"
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Year <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                placeholder="e.g., 2025"
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Class <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="className"
                value={formData.className}
                onChange={handleInputChange}
                placeholder="e.g., Class 10"
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Father's Name</label>
              <input
                type="text"
                name="father"
                value={formData.father}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Mother's Name</label>
              <input
                type="text"
                name="mother"
                value={formData.mother}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Village</label>
              <input
                type="text"
                name="village"
                value={formData.village}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Achiever Photo</label>
            <div className="border border-dashed border-[var(--border-default)] rounded-3xl p-8 text-center hover:border-[var(--color-primary)] transition-colors">
              {imagePreview ? (
                <div className="flex flex-col items-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-40 h-40 object-cover rounded-2xl shadow-md mb-4"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview("");
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="text-red-500 hover:text-red-600 text-sm font-medium"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div>
                  <Upload size={48} className="mx-auto text-[var(--text-muted)] mb-3" />
                  <p className="text-[var(--text-secondary)]">Click to upload achiever photo</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="achiever-image"
              />
              <label
                htmlFor="achiever-image"
                className="mt-4 inline-block px-6 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] rounded-2xl cursor-pointer text-sm font-medium transition-all"
              >
                Choose Image
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6">
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
              className="flex-1 py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-bright)] text-white font-semibold rounded-2xl transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {uploading ? "Adding..." : "Add Achiever"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAchieverModal;
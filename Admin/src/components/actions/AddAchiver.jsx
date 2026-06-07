import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { X, Upload } from "lucide-react";

import { Button } from "../common/Button";
import { AdminContext } from "../../context/AdminContext";

const AddAchiver = ({ onAddSuccess }) => {
  const navigate = useNavigate();
  const { backendUrl, adminToken } = useContext(AdminContext);

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

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    const name = formData.name.trim();
    const percentage = formData.percentage.trim();
    const year = formData.year.trim();
    const className = formData.className.trim();

    if (!name || !percentage || !year || !className) {
      toast.error("Name, percentage, year, and class are required");
      return false;
    }

    const percentageRegex = /^\d+(\.\d{1,2})?$/;

    if (!percentageRegex.test(percentage) || Number(percentage) > 100) {
      toast.error("Percentage must be a valid number and should not exceed 100");
      return false;
    }

    const yearRegex = /^\d{4}$/;

    if (!yearRegex.test(year)) {
      toast.error("Year must be a valid four-digit number");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (uploading) return;
    if (!validateForm()) return;

    setUploading(true);

    const form = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value.trim());
    });

    if (imageFile) {
      form.append("image", imageFile);
    }

    try {
      const res = await axios.post(
        `${backendUrl}/api/achievers/add-achiever`,
        form,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Achiever added successfully");
        onAddSuccess?.();
        navigate(-1);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding achiever");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen p-5 rounded-xl">
      <div>
        <div className="flex items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Add Achiever
          </h1>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-3 rounded-2xl border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                Student Name <span className="text-red-500">*</span>
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
                Percentage (%) <span className="text-red-500">*</span>
              </label>

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
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                Year <span className="text-red-500">*</span>
              </label>

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
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                Class <span className="text-red-500">*</span>
              </label>

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

            <div className="md:col-span-2">
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
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
              Achiever Photo
            </label>

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
                    onClick={removeImage}
                    className="text-red-500 hover:text-red-600 text-sm font-medium"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div>
                  <Upload
                    size={48}
                    className="mx-auto text-[var(--text-muted)] mb-3"
                  />

                  <p className="text-[var(--text-secondary)]">
                    Click to upload achiever photo
                  </p>
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

          <Button
            type="submit"
            size="lg"
            variant="primary"
            loading={uploading}
            className="w-full"
          >
            Add Achiever
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddAchiver;
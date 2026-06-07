import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { X, Upload } from "lucide-react";

import { Button } from "../common/Button";
import { AdminContext } from "../../context/AdminContext";

const UpdateAchiver = ({ onUpdateSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const { backendUrl, adminToken } = React.useContext(AdminContext);

  const achiever = location.state?.achiever;

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

  useEffect(() => {
    if (!achiever) {
      toast.error("Achiever data not found");
      navigate(-1);
      return;
    }

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
  }, [achiever, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeSelectedImage = () => {
    setImage(null);
    setImagePreview(achiever?.image || "");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    if (
      !formData.name.trim() ||
      !formData.percentage.trim() ||
      !formData.className.trim() ||
      !formData.year.trim()
    ) {
      toast.error("Name, percentage, class, and year are required");
      return false;
    }

    const percentageRegex = /^\d+(\.\d{1,2})?$/;

    if (
      !percentageRegex.test(formData.percentage.trim()) ||
      Number(formData.percentage) > 100
    ) {
      toast.error("Percentage must be a valid number and should not exceed 100");
      return false;
    }

    const yearRegex = /^\d{4}$/;

    if (!yearRegex.test(formData.year.trim())) {
      toast.error("Year must be a valid four-digit number");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (uploading) return;
    if (!achiever?._id) return toast.error("Invalid achiever ID");
    if (!validateForm()) return;

    setUploading(true);

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value.trim());
    });

    if (image) {
      data.append("image", image);
    }

    try {
      const res = await axios.put(
        `${backendUrl}/api/achievers/update-achiever/${achiever._id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Achiever updated successfully");
        onUpdateSuccess?.();
        navigate(-1);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating achiever");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <div className="mx-auto">
        <div className="flex justify-between items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Update Achiever
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
                Name <span className="text-red-500">*</span>
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
                Percentage (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="percentage"
                value={formData.percentage}
                onChange={handleInputChange}
                placeholder="e.g., 92.5"
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
          </div>

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

                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={removeSelectedImage}
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div className="text-[var(--text-muted)]">
                  <Upload size={40} className="mx-auto mb-3" />
                  <p className="text-sm">Click to upload new image</p>
                </div>
              )}

              <input
                ref={fileInputRef}
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

          <Button
            type="submit"
            variant="primary"
            loading={uploading}
            className="w-full"
          >
            Update Achiever
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UpdateAchiver;
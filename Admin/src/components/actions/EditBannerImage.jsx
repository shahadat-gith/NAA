import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { X, Upload, Image as ImageIcon } from "lucide-react";

import { AdminContext } from "../../context/AdminContext";
import { Button } from "../common/Button";

const EditBannerImage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { backendUrl, adminToken } = useContext(AdminContext);

  const image = location.state?.image;
  const isAddMode = location.state?.isAddMode || !image;

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Reset file when switching modes
  useEffect(() => {
    setFile(null);
  }, [isAddMode, image]);

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
      navigate(-1);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border-default)]">
        <div className="flex items-center gap-3">
          <ImageIcon className="text-[var(--color-primary)]" size={28} />
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            {isAddMode ? "Add Banner Image" : "Update Banner Image"}
          </h1>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="p-3 rounded-2xl border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] transition-all"
        >
          <X size={26} />
        </button>
      </div>

      <div className="p-6">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-8">
          {/* Current Image Preview (Edit Mode) */}
          {!isAddMode && image?.url && (
            <div className="mb-8">
              <p className="text-sm font-medium text-[var(--text-muted)] mb-3">Current Banner</p>
              <img
                src={image.url}
                alt="Current Banner"
                className="w-full rounded-2xl border border-[var(--border-default)]"
              />
            </div>
          )}

          {/* File Upload Area */}
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

        {/* Save Button */}
        <div className="mt-8">
          <Button
            onClick={handleSubmit}
            disabled={loading || !file}
            variant="primary"
            loading={loading}
            className="w-full py-4"
          >
            {loading ? "Uploading..." : "Save Banner"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditBannerImage;
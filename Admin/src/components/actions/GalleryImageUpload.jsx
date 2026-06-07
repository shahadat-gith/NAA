import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { X, Upload, Trash2 } from "lucide-react";

import { Button } from "../common/Button";
import { AdminContext } from "../../context/AdminContext";

const GalleryImageUpload = () => {
  const navigate = useNavigate();
  const { backendUrl, adminToken } = React.useContext(AdminContext);

  const [imageFiles, setImageFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => file.type.startsWith("image/"));

    if (validFiles.length !== files.length) {
      toast.error("Only image files are allowed");
    }

    setImageFiles((prev) => [...prev, ...validFiles]);
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imageFiles.length === 0) return;

    setLoading(true);

    const formData = new FormData();
    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      await axios.post(`${backendUrl}/api/gallery/upload`, formData, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Images uploaded successfully!");
      navigate(-1);
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border-default)]">
        <div className="flex items-center gap-3">
          <Upload className="text-[var(--color-primary)]" size={28} />
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Upload Gallery Images</h1>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="p-3 rounded-2xl border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] transition-all"
        >
          <X size={26} />
        </button>
      </div>

      <div className="bg-[var(--bg-surface)] border-b border-[var(--border-default)]">
        {/* Upload Area */}
        <div className="p-6 border-b border-[var(--border-default)]">
          <div 
            className="border border-dashed border-[var(--border-default)] rounded-3xl p-10 text-center hover:border-[var(--color-primary)] transition-colors cursor-pointer"
            onClick={() => fileInputRef.current.click()}
          >
            <Upload size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
            <p className="text-[var(--text-secondary)] text-lg">Click or drag images here</p>
            <p className="text-sm text-[var(--text-muted)] mt-1">Multiple images supported • Max size per image recommended under 5MB</p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current.click();
              }}
              className="mt-6 px-8 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] rounded-2xl text-sm font-medium transition-all"
            >
              Select Images
            </button>
          </div>
        </div>

        {/* Preview Grid */}
        {imageFiles.length > 0 && (
          <div className="p-6">
            <p className="text-sm font-medium text-[var(--text-muted)] mb-4">
              Selected Images ({imageFiles.length})
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {imageFiles.map((file, index) => (
                <div 
                  key={index} 
                  className="relative group rounded-2xl overflow-hidden border border-[var(--border-default)]"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-full aspect-square object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-red-600 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Upload Button */}
      <div className="p-4 md:p-6">
        <Button
          onClick={handleSubmit}
          disabled={imageFiles.length === 0 || loading}
          variant="success"
          loading={loading}
          className="w-full"
        >
          {loading ? "uploading" : `Upload ${imageFiles.length == 0 ? "": imageFiles.length}`}
        </Button>
      </div>
    </div>
  );
};

export default GalleryImageUpload;
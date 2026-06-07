import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Plus, Eye, Trash2, Image as ImageIcon } from "lucide-react";

import { AdminContext } from "../context/AdminContext";
import Loader from "../components/common/Loader";
import { Button } from "../components/common/Button";
import ImagePreviewModal from "../components/gallery/ImagePreviewModal";

const Gallery = () => {
  const { backendUrl, adminToken, navigate } = useContext(AdminContext);

  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  
  /* ================= FETCH GALLERY ================= */
  const fetchGalleries = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/gallery/`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      if (response.data.success) {
        setGalleryImages(response.data.images || []);
      }
    } catch (error) {
      console.error("Error fetching galleries:", error);
      toast.error("Failed to load gallery images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, [adminToken, backendUrl]);

  const handleDelete = async (publicId) => {
    if (!window.confirm("Delete this image permanently?")) return;

    try {
      await toast.promise(
        axios.delete(`${backendUrl}/api/gallery/${publicId}`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        }),
        {
          loading: "Deleting...",
          success: "Image deleted successfully!",
          error: "Failed to delete image",
        },
      );
      fetchGalleries();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const openUploadGallery = () => {
    navigate("/actions?type=GalleryImageUpload");
  };

  if (loading) return <Loader text="Loading gallery..." />;

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <ImageIcon className="text-[var(--color-primary)]" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                Gallery
              </h1>
              <p className="text-[var(--text-secondary)]">
                School memories & events
              </p>
            </div>
          </div>

          <Button onClick={openUploadGallery} variant="success">
            Upload more
          </Button>
        </div>

        {/* Gallery Grid */}
        {galleryImages.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[var(--border-default)] rounded-3xl">
            <ImageIcon
              size={64}
              className="mx-auto text-[var(--text-muted)] mb-6"
            />
            <p className="text-xl text-[var(--text-secondary)]">
              No images yet
            </p>
            <p className="text-[var(--text-muted)] mt-2">
              Upload your first gallery image
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {galleryImages.map((img) => (
              <div
                key={img._id}
                className="group relative bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={img.url}
                    alt="Gallery"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end justify-end p-4 gap-2">
                  <button
                    onClick={() => setSelectedImage(img)}
                    className="p-3 bg-white/90 hover:bg-white text-black rounded-2xl transition-all"
                  >
                    <Eye size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(img.public_id)}
                    className="p-3 bg-red-500/90 hover:bg-red-500 text-white rounded-2xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <ImagePreviewModal
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
};

export default Gallery;

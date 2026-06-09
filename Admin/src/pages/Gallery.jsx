import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Eye, Trash2, Image as ImageIcon } from "lucide-react";

import { AdminContext } from "../context/AdminContext";
import Loader from "../components/common/Loader";
import { Button } from "../components/common/Button";
import ImagePreviewModal from "../components/gallery/ImagePreviewModal";

const Gallery = () => {
  const { backendUrl, adminToken, navigate } = useContext(AdminContext);

  const [galleryImages, setGalleryImages] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

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

      setGalleryImages((prev) =>
        prev.filter((image) => image.public_id !== publicId),
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const openUploadGallery = () => {
    navigate("/actions?type=GalleryImageUpload");
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 12, galleryImages.length));
  };

  const visibleImages = galleryImages.slice(0, visibleCount);

  if (loading) return <Loader text="Loading gallery..." />;

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
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

        {galleryImages.length > 0 && (
          <div className="mb-6 text-[var(--text-secondary)]">
            Showing{" "}
            <span className="font-semibold text-[var(--text-primary)]">
              {visibleImages.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[var(--text-primary)]">
              {galleryImages.length}
            </span>{" "}
            images
          </div>
        )}

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
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {visibleImages.map((img) => (
                <div
                  key={img._id}
                  className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={img.url}
                      alt="Gallery"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3 p-4 border-t border-[var(--border-default)]">
                    <Button
                      variant="primary"
                      onClick={() => setSelectedImage(img)}
                      className="flex-1"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Eye size={18} />
                        View
                      </span>
                    </Button>

                    <Button
                      variant="danger"
                      onClick={() => handleDelete(img.public_id)}
                      className="flex-1"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Trash2 size={18} />
                        Remove
                      </span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {visibleCount < galleryImages.length && (
              <div className="flex justify-center mt-8">
                <Button variant="primary" onClick={handleShowMore}>
                  Show More
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <ImagePreviewModal
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
};

export default Gallery;
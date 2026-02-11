import React, { useContext, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import "./Gallery.css";

import ImagePreviewModal from "./ImagePreviewModal";
import UploadModal from "./UploadModal";

const Gallery = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);
  const { gallerImages, fetchGalleryImages, fetchingImages } = useContext(AppContext);

  const [selectedImage, setSelectedImage] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const toggleScroll = (lock) => {
    document.body.style.overflow = lock ? "hidden" : "unset";
  };

  const handleUpload = async (imageFiles) => {
    const formData = new FormData();
    imageFiles.forEach((file) => formData.append("images", file));

    try {
      await toast.promise(
        axios.post(`${backendUrl}/api/gallery/upload`, formData, {
          headers: { Authorization: `Bearer ${adminToken}`, "Content-Type": "multipart/form-data" },
        }),
        { loading: "Uploading...", success: "Uploaded!", error: "Upload failed." }
      );
      setShowUploadModal(false);
      toggleScroll(false);
      fetchGalleryImages();
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    }
  };

  const handleDelete = async (publicId) => {
    // Simple Browser Alert
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        await toast.promise(
          axios.delete(`${backendUrl}/api/gallery/${publicId}`, {
            headers: { Authorization: `Bearer ${adminToken}` },
          }),
          { loading: "Deleting...", success: "Deleted!", error: "Delete failed" }
        );
        fetchGalleryImages();
      } catch (error) {
        toast.error(error.response?.data?.message || "Delete failed");
      }
    }
  };

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h1>Gallery Images</h1>
        <button className="gallery-upload-btn" onClick={() => { setShowUploadModal(true); toggleScroll(true); }}>
          <i className="fas fa-upload"></i> Upload Images
        </button>
      </div>

      <div className="gallery-stats">
        <div className="gallery-stat-card">
          <i className="fas fa-images"></i>
          <div>
            <span className="stat-value">{gallerImages?.length || 0}</span>
            <span className="stat-label"> Images</span>
          </div>
        </div>
      </div>

      {fetchingImages ? (
        <div className="gallery-loader">
          <div className="loader-spinner"></div>
          <p>Loading images...</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {gallerImages?.map((item) => (
            <div key={item._id} className="gallery-card">
              <div className="gallery-image-wrapper">
                <img src={item.url} alt="Gallery" className="gallery-image" />
                <div className="gallery-overlay">
                  <button className="gallery-action-btn view-btn" onClick={() => { setSelectedImage(item); toggleScroll(true); }}>
                    <i className="fas fa-eye"></i>
                  </button>
                  <button className="gallery-action-btn delete-btn" onClick={() => handleDelete(item.publicId)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ImagePreviewModal 
        image={selectedImage} 
        onClose={() => { setSelectedImage(null); toggleScroll(false); }} 
      />

      <UploadModal 
        isOpen={showUploadModal} 
        onClose={() => { setShowUploadModal(false); toggleScroll(false); }} 
        onUpload={handleUpload} 
      />
    </div>
  );
};

export default Gallery;
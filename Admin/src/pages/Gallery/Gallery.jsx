import React, { useContext, useState, useEffect, useRef } from 'react';
import { AdminContext } from '../../context/AdminContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import './Gallery.css';

const Gallery = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);
  const [galleryItems, setGalleryItems] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Helper to extract public_id from URL
  const extractPublicId = (url) => {
    try {
      const parts = url.split('/');
      const filenameWithExt = parts.pop();
      const filename = filenameWithExt.split('.')[0];
      const folder = parts[parts.length - 1];
      return `${folder}/${filename}`;
    } catch {
      return '';
    }
  };

  // Fetch all images
  const loadImages = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${backendUrl}/api/gallery`,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );

      const images = response.data.images.map((img, index) => ({
        id: index + 1,
        src: img.url,
        public_id: extractPublicId(img.url),
      }));

      setGalleryItems(images);
      setIsLoading(false);
    } catch (error) {
      console.error('Fetch images error:', error);
      toast.error('Failed to fetch images: ' + (error.response?.data?.message || error.message));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, [backendUrl, adminToken]);

  // Modal for image preview
  const openModal = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  // Open upload modal
  const openUploadModal = () => {
    setShowUploadModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
    setImageFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = null;
    document.body.style.overflow = 'unset';
  };

  // Open delete confirmation popup
  const openDeleteConfirm = (public_id) => {
    setShowDeleteConfirm(public_id);
    document.body.style.overflow = 'hidden';
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(null);
    document.body.style.overflow = 'unset';
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validImageFiles = files.filter((file) => file.type.startsWith('image/'));

    if (validImageFiles.length !== files.length) {
      toast.error("Only image files are allowed");
    }

    setImageFiles((prevFiles) => [...prevFiles, ...validImageFiles]);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const removeImage = (indexToRemove) => {
    setImageFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  // Handle image upload
  const handleUpload = async (e) => {
    e.preventDefault();

    if (imageFiles.length === 0) {
      toast.error("Please select at least one image to upload");
      return;
    }

    const formData = new FormData();
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });

    try {
      await toast.promise(
        axios.post(`${backendUrl}/api/gallery/upload`, formData, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }),
        {
          loading: 'Uploading images...',
          success: 'Images uploaded successfully!',
          error: 'Failed to upload images.'
        }
      );

      closeUploadModal();
      await loadImages();
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error(error.response?.data?.message || 'Error uploading images: ' + error.message);
    }
  };

  // Handle image deletion
  const handleDelete = async (public_id) => {
    try {
      await toast.promise(
        axios.delete(`${backendUrl}/api/gallery/${public_id}`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        }),
        {
          loading: 'Deleting image...',
          success: 'Image deleted successfully!',
          error: 'Failed to delete image.'
        }
      );

      closeDeleteConfirm();
      await loadImages();
    } catch (error) {
      console.error('Delete image error:', error);
      toast.error(error.response?.data?.message || 'Error deleting image: ' + error.message);
    }
  };

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <div className="gallery-header-content">
          <h1>Gallery Management</h1>
          <p className="gallery-subtitle">Manage and organize your image collection</p>
        </div>
        <button className="gallery-upload-btn" onClick={openUploadModal}>
          <i className="fas fa-upload"></i>
          Upload Images
        </button>
      </div>

      <div className="gallery-stats">
        <div className="gallery-stat-card">
          <i className="fas fa-images"></i>
          <div>
            <span className="stat-value">{galleryItems.length}</span>
            <span className="stat-label">Total Images</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="gallery-loader">
          <div className="loader-spinner"></div>
          <p>Loading images...</p>
        </div>
      ) : galleryItems.length === 0 ? (
        <div className="gallery-empty">
          <i className="fas fa-image"></i>
          <h3>No Images Yet</h3>
          <p>Start by uploading your first image</p>
          <button className="gallery-upload-btn" onClick={openUploadModal}>
            <i className="fas fa-upload"></i>
            Upload Images
          </button>
        </div>
      ) : (
        <div className="gallery-grid">
          {galleryItems.map(item => (
            <div key={item.id} className="gallery-card">
              <div className="gallery-image-wrapper">
                <img
                  src={item.src.replace('/upload/', '/upload/w_400,h_300,q_auto,f_webp/')}
                  alt={`Image ${item.id}`}
                  className="gallery-image"
                />
                <div className="gallery-overlay">
                  <button
                    className="gallery-action-btn view-btn"
                    onClick={() => openModal(item)}
                    title="View Image"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button
                    className="gallery-action-btn delete-btn"
                    onClick={() => openDeleteConfirm(item.public_id)}
                    title="Delete Image"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="gallery-modal-overlay" onClick={closeModal}>
          <div className="gallery-modal-content" onClick={e => e.stopPropagation()}>
            <button className="gallery-modal-close" onClick={closeModal}>
              <i className="fas fa-times"></i>
            </button>
            <img
              src={selectedImage.src}
              alt={`Image ${selectedImage.id}`}
              className="gallery-modal-image"
            />
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="gallery-modal-overlay" onClick={closeUploadModal}>
          <div className="gallery-modal-content upload-modal-content" onClick={e => e.stopPropagation()}>
            <button className="gallery-modal-close" onClick={closeUploadModal}>
              <i className="fas fa-times"></i>
            </button>
            <h2>Upload Images</h2>
            <form onSubmit={handleUpload} className="gallery-upload-form">
              <div className="gallery-form-group">
                <input
                  type="file"
                  id="image-file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  multiple
                  style={{ display: 'none' }}
                />
                
                {imageFiles.length === 0 ? (
                  <div className="gallery-dropzone" onClick={triggerFileInput}>
                    <i className="fas fa-cloud-upload-alt"></i>
                    <p>Click to select images</p>
                    <span>or drag and drop</span>
                  </div>
                ) : (
                  <div className="gallery-preview-container">
                    {imageFiles.map((file, index) => (
                      <div key={index} className="gallery-preview-item">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="gallery-preview-image"
                        />
                        <button
                          type="button"
                          className="gallery-remove-btn"
                          onClick={() => removeImage(index)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                        <span className="gallery-filename">{file.name}</span>
                      </div>
                    ))}
                    <div className="gallery-add-more" onClick={triggerFileInput}>
                      <i className="fas fa-plus"></i>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="gallery-modal-actions">
                <button type="button" className="gallery-cancel-btn" onClick={closeUploadModal}>
                  Cancel
                </button>
                <button type="submit" className="gallery-submit-btn" disabled={imageFiles.length === 0}>
                  <i className="fas fa-upload"></i>
                  Upload {imageFiles.length > 0 && `(${imageFiles.length})`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="gallery-modal-overlay" onClick={closeDeleteConfirm}>
          <div className="gallery-modal-content delete-modal-content" onClick={e => e.stopPropagation()}>
            <div className="gallery-delete-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this image? This action cannot be undone.</p>
            <div className="gallery-modal-actions">
              <button className="gallery-cancel-btn" onClick={closeDeleteConfirm}>
                Cancel
              </button>
              <button className="gallery-delete-confirm-btn" onClick={() => handleDelete(showDeleteConfirm)}>
                <i className="fas fa-trash"></i>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
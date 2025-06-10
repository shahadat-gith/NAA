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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null); // null or public_id
  const [imageFiles, setImageFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalImages, setTotalImages] = useState(0);
  const fileInputRef = useRef(null);
  const imagesPerPage = 6;

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

  // Fetch images
  const loadImages = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${backendUrl}/api/gallery?page=${currentPage}&limit=${imagesPerPage}`,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );

      const images = response.data.images.map((img, index) => ({
        id: (currentPage - 1) * imagesPerPage + index + 1,
        src: img.url,
        public_id: extractPublicId(img.url),
      }));

      setGalleryItems(images);
      setTotalImages(response.data.totalImages || 0);
      setIsLoading(false);
    } catch (error) {
      console.error('Fetch images error:', error);
      toast.error('Failed to fetch images: ' + (error.response?.data?.message || error.message));
      setIsLoading(false);
    }
  };

  // Fetch images on mount and when page changes
  useEffect(() => {
    loadImages();
  }, [backendUrl, adminToken, currentPage]);

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
      const response = await toast.promise(
        axios.post(`${backendUrl}/api/gallery/upload`, formData, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }),
        {
          pending: 'Uploading images...',
          success: 'Images uploaded successfully!',
          error: 'Failed to upload images.'
        }
      );

      console.log('Upload API Response:', response.data);
      closeUploadModal();
      setCurrentPage(1); // Reset to first page
      await loadImages(); // Refresh gallery
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error(error.response?.data?.message || 'Error uploading images: ' + error.message);
    }
  };

  // Handle image deletion
  const handleDelete = async (public_id) => {
    try {
      const response = await toast.promise(
        axios.delete(`${backendUrl}/api/gallery/${public_id}`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        }),
        {
          pending: 'Deleting image...',
          success: 'Image deleted successfully!',
          error: 'Failed to delete image.'
        }
      );

      if (response.status === 200) {
        setCurrentPage(1); // Reset to first page
        closeDeleteConfirm();
        await loadImages(); // Refresh gallery
      }
    } catch (error) {
      console.error('Delete image error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      toast.error(error.response?.data?.message || 'Error deleting image: ' + error.message);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(totalImages / imagesPerPage);
  const startIdx = (currentPage - 1) * imagesPerPage + 1;
  const endIdx = Math.min(currentPage * imagesPerPage, totalImages);
  const currentImages = galleryItems;

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="admin-content">
      <div className="gallery-header">
        <h1>Manage Gallery</h1>
        <p className="gallery-subtitle">Total images: {totalImages}</p>
        <button className="upload-btn" onClick={openUploadModal}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Upload Images
        </button>
      </div>

      <div className="gallery-grid">
        {isLoading ? (
          <div className="loader-container">
            <div className="loader"></div>
            <p>Loading images...</p>
          </div>
        ) : galleryItems.length === 0 ? (
          <p>No images available.</p>
        ) : (
          currentImages.map(item => (
            <div key={item.id} className="gallery-item">
              <div className="image-container">
                <img
                  src={item.src.replace('/upload/', '/upload/w_400,h_300,q_auto,f_webp/')}
                  alt={`Image ${item.id}`}
                  className="gallery-image"
                />
              </div>
              <div className="gallery-actions">
                <button
                  className="view-btn"
                  onClick={() => openModal(item)}
                  title="View Image"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
                <button
                  className="delete-btn"
                  onClick={() => openDeleteConfirm(item.public_id)}
                  title="Delete Image"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="gallery-footer">
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="prev-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              title="Previous Page"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`number-btn ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(index + 1)}
                title={`Page ${index + 1}`}
              >
                {index + 1}
              </button>
            ))}

            <button
              className="next-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              title="Next Page"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        )}
        {!isLoading && (
          <div className="gallery-status">
            {galleryItems.length > 0 ? (
              <p>Showing {startIdx}-{endIdx} of {totalImages} images</p>
            ) : (
              <p>No images available.</p>
            )}
          </div>
        )}
      </div>

      {/* Modal for image preview */}
      {selectedImage && (
        <div className="modal-container" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-btn" onClick={closeModal} title="Close">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="modal-image-container">
              <img
                src={selectedImage.src}
                alt={`Image ${selectedImage.id}`}
                className="modal-image"
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal for image upload */}
      {showUploadModal && (
        <div className="modal-container" onClick={closeUploadModal}>
          <div className="modal-content upload-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-btn" onClick={closeUploadModal} title="Close">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <h2>Upload Images</h2>
            <form onSubmit={handleUpload} className="image-upload-form">
              <div className="form-group">
                <label htmlFor="image-file">Select Images</label>
                <div className="custom-file-upload">
                  {imageFiles.length === 0 ? (
                    <button type="button" onClick={triggerFileInput} className="upload-btn">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      Add Image
                    </button>
                  ) : (
                    <button type="button" onClick={triggerFileInput} className="add-more-btn">
                      +
                    </button>
                  )}
                  <input
                    type="file"
                    id="image-file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    multiple
                    style={{ display: 'none' }}
                  />
                </div>
                {imageFiles.length > 0 && (
                  <div className="image-preview-container">
                    {imageFiles.map((file, index) => (
                      <div key={index} className="image-preview">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="preview-image"
                        />
                        <span className="file-name">{file.name}</span>
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => removeImage(index)}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#fff"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button type="submit" className="premium-button">
                Upload Images
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation popup */}
      {showDeleteConfirm && (
        <div className="modal-container" onClick={closeDeleteConfirm}>
          <div className="modal-content delete-confirm-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-btn" onClick={closeDeleteConfirm} title="Close">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this image? This action cannot be undone.</p>
            <div className="delete-confirm-buttons">
              <button
                className="cancel-btn"
                onClick={closeDeleteConfirm}
              >
                Cancel
              </button>
              <button
                className="confirm-delete-btn"
                onClick={() => handleDelete(showDeleteConfirm)}
              >
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
import React, { useState, useContext } from 'react';
import './Gallery.css';
import toast from 'react-hot-toast';
import { AppContext } from '../../context/AppContext';
import { Helmet } from 'react-helmet-async';

const Gallery = () => {
  const { galleryImages = [] } = useContext(AppContext);
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const handleDownload = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `gallery-image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download image.');
    }
  };

  return (
    <div className="gallery-container">
      <Helmet>
        <title>Gallery | Nashib Ali Academy</title>
        <meta
          name="description"
          content="Explore photos and highlights of academic activities, events, classrooms and student life at Nashib Ali Academy in Barpeta, Assam."
        />
      </Helmet>

      <div className="gallery-header">
        <h1 className="gallery-title">School Gallery</h1>
        <p className="gallery-subtitle">
          Capturing moments of learning, growth, and achievement at our school
        </p>
      </div>

      <div className="gallery-grid">
        {galleryImages.length === 0 ? (
          <p>No images available.</p>
        ) : (
          galleryImages.map((item) => (
            <div
              key={item._id}
              className="gallery-item"
              onClick={() => openModal(item)}
            >
              <div className="image-container">
                <img
                  src={item.url.replace(
                    '/upload/',
                    '/upload/w_400,h_300,q_auto,f_webp/'
                  )}
                  alt="Nashib Ali Academy gallery image"
                  className="gallery-image"
                  loading="lazy"
                />
              </div>
            </div>
          ))
        )}
      </div>

      {selectedImage && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              ×
            </button>

            <div className="modal-image-container">
              <img
                src={selectedImage.url}
                alt="Nashib Ali Academy gallery image"
                className="modal-image"
              />
            </div>

            <div className="modal-info">
              <button
                className="download-btn"
                onClick={() => handleDownload(selectedImage.url)}
              >
                Download Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;

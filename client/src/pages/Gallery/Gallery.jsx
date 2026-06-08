import React, { useState, useContext, useEffect } from 'react';
import './Gallery.css';
import toast from 'react-hot-toast';
import { AppContext } from '../../context/AppContext';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import Loader from '../../components/Loader/Loader';

const Gallery = () => {
  const { backendUrl } = useContext(AppContext);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchGalleryImages = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/gallery`);
      if (data.success) {
        setImages(data.images);
      }
    } catch (error) {
      console.error("Failed to fetch gallery items:", error);
    } finally {
      setLoading(false);
    }
  }; 

  useEffect(() => {
    fetchGalleryImages();
  }, []);

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
    <div className="gl-gallery-page">
      <Helmet>
        <title>Gallery | Nashib Ali Academy</title>
        <meta
          name="description"
          content="Explore photos and highlights of academic activities, events, classrooms and student life at Nashib Ali Academy in Barpeta, Assam."
        />
      </Helmet>

      {/* Gallery Header */}
      <div className="gl-gallery-header">
        <h1 className="gl-gallery-title">School Gallery</h1>
        <p className="gl-gallery-subtitle">
          Capturing moments of learning, growth, and achievement at our school
        </p>
      </div>

      {/* Conditional Rendering: Loader vs Layout Grid */}
      {loading ? (
        <Loader />
      ) : (
        <div className="gl-gallery-grid">
          {images.length === 0 ? (
            <p className="gl-no-images">No images available at the moment.</p>
          ) : (
            images.map((item) => (
              <div
                key={item._id}
                className="gl-gallery-item"
                onClick={() => openModal(item)}
              >
                <div className="gl-image-wrapper">
                  <img
                    src={item.url.replace(
                      '/upload/',
                      '/upload/w_400,h_300,q_auto,f_webp/'
                    )}
                    alt="Nashib Ali Academy gallery moment"
                    className="gl-gallery-img"
                    loading="lazy"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Lightbox Modal Overlay */}
      {selectedImage && (
        <div className="gl-modal-overlay" onClick={closeModal}>
          <div className="gl-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="gl-modal-close-btn" onClick={closeModal} aria-label="Close modal">
              &times;
            </button>

            <div className="gl-modal-img-wrapper">
              <img
                src={selectedImage.url}
                alt="Nashib Ali Academy gallery presentation view"
                className="gl-modal-img"
              />
            </div>

            <div className="gl-modal-actions">
              <button
                className="gl-download-btn"
                onClick={() => handleDownload(selectedImage.url)}
              >
                <i className="fas fa-download"></i> Download Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
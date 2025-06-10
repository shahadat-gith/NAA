import React, { useState, useEffect, useContext, useRef } from 'react';
import './Gallery.css';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AppContext } from '../../context/AppContext';

const Gallery = () => {
  const { backendUrl } = useContext(AppContext);
  const [galleryItems, setGalleryItems] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const imagesPerPage = 6;
  const loaderRef = useRef(null);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      if (!hasMore || isLoading) return;

      setIsLoading(true);
      try {
        const res = await axios.get(`${backendUrl}/api/gallery?page=${page}&limit=${imagesPerPage}`);
        const newImages = res.data.images.map((img, index) => ({
          id: galleryItems.length + index + 1,
          src: img.url,
        }));

        setGalleryItems(prev => [...prev, ...newImages]);
        setHasMore(res.data.hasMore);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching gallery images:', err);
        toast.error('Failed to load gallery images.');
        setIsLoading(false);
      }
    };

    fetchGalleryImages();
  }, [backendUrl, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, isLoading]);

  const openModal = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const handleDownload = async (imageSrc) => {
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `image-${Date.now()}.jpg`;
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
      <div className="gallery-header">
        <h1 className="gallery-title">School Gallery</h1>
        <p className="gallery-subtitle">
          Capturing moments of learning, growth, and achievement at our school
        </p>
      </div>

      <div className="gallery-grid">
        {galleryItems.length === 0 && !isLoading ? (
          <p>No images available.</p>
        ) : (
          galleryItems.map(item => (
            <div
              key={item.id}
              className="gallery-item"
              onClick={() => openModal(item)}
            >
              <div className="image-container">
                <img
                  src={item.src.replace('/upload/', '/upload/w_400,h_300,q_auto,f_webp/')}
                  alt={`Image ${item.id}`}
                  className="gallery-image"
                />
              </div>
            </div>
          ))
        )}
      </div>

      <div className="gallery-footer">
        {isLoading && (
          <div className="loader-container">
            <div className="loader"></div>
            <p>Loading more images...</p>
          </div>
        )}
        {hasMore && <div ref={loaderRef} style={{ height: '20px' }} />}
        {!hasMore && galleryItems.length > 0 && (
          <div className="no-more-images">
            <p>No more images to scroll.</p>
          </div>
        )}
      </div>

      {selectedImage && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <div className="modal-image-container">
              <img
                src={selectedImage.src}
                alt={`Image ${selectedImage.id}`}
                className="modal-image"
              />
            </div>
            <div className="modal-info">
              <button
                className="download-btn"
                onClick={() => handleDownload(selectedImage.src)}
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
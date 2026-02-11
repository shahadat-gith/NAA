import React from "react";

const ImagePreviewModal = ({ image, onClose }) => {
  if (!image) return null;
  return (
    <div className="gallery-modal-overlay" onClick={onClose}>
      <div className="gallery-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="gallery-modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        <img src={image.url} alt="Preview" className="gallery-modal-image" />
      </div>
    </div>
  );
};

export default ImagePreviewModal;
import "./ImagePreviewModal.css"

const ImagePreviewModal = ({ image, onClose }) => {
  if (!image) return null;
  return (
    <div className="ipm-gallery-modal-overlay" onClick={onClose}>
      <div className="ipm-gallery-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="ipm-gallery-modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        <img src={image.url} alt="Preview" className="ipm-gallery-modal-image" />
      </div>
    </div>
  );
};

export default ImagePreviewModal;
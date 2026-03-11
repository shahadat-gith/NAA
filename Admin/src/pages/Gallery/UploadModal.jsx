import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import "./UploadModal.css"

const UploadModal = ({ isOpen, onClose, onUpload }) => {
  const [imageFiles, setImageFiles] = useState([]);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    if (validFiles.length !== files.length) toast.error("Only image files are allowed");
    setImageFiles((prev) => [...prev, ...validFiles]);
  };

  const removeImage = (index) => setImageFiles(imageFiles.filter((_, i) => i !== index));

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpload(imageFiles);
    setImageFiles([]);
  };

  return (
    <div className="gallery-modal-overlay" onClick={onClose}>
      <div className="gallery-modal-content upload-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="gallery-modal-close" onClick={onClose}><i className="fas fa-times"></i></button>
        <h2>Upload Images</h2>
        <form onSubmit={handleSubmit} className="gallery-upload-form">
          <input type="file" ref={fileInputRef} accept="image/*" multiple onChange={handleFileChange} style={{ display: "none" }} />
          
          {imageFiles.length === 0 ? (
            <div className="gallery-dropzone" onClick={() => fileInputRef.current.click()}>
              <i className="fas fa-cloud-upload-alt"></i>
              <p>Click to select images</p>
            </div>
          ) : (
            <div className="gallery-preview-container">
              {imageFiles.map((file, index) => (
                <div key={index} className="gallery-preview-item">
                  <img src={URL.createObjectURL(file)} alt="preview" />
                  <button type="button" onClick={() => removeImage(index)}><i className="fas fa-times"></i></button>
                </div>
              ))}
              <div className="gallery-add-more" onClick={() => fileInputRef.current.click()}><i className="fas fa-plus"></i></div>
            </div>
          )}

          <div className="gallery-modal-actions">
            <button type="button" className="gallery-cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="gallery-submit-btn" disabled={imageFiles.length === 0}>
              Upload ({imageFiles.length})
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
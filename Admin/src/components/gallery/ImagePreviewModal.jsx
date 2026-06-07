import React from "react";
import { X } from "lucide-react";

const ImagePreviewModal = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-[1200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative max-w-5xl w-full max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 z-10 bg-black/70 hover:bg-black text-white p-3 rounded-full transition-all"
        >
          <X size={28} />
        </button>

        {/* Image Container */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl overflow-hidden flex-1 flex items-center justify-center p-4">
          <img
            src={image.url}
            alt="Gallery Preview"
            className="max-h-[80vh] max-w-full object-contain rounded-2xl"
          />
        </div>

        {/* Optional Caption */}
        {image.title && (
          <div className="text-center mt-4 text-[var(--text-secondary)]">
            {image.title}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagePreviewModal;
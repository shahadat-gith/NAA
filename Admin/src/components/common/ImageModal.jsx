import React, { useEffect } from "react";
import { X, Download } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "./Button.jsx";


const ImageModal = ({ isOpen, person, onClose }) => {
  // Prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleDownload = (imageUrl) => {
    fetch(imageUrl, { mode: "cors" })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${person.name.replace(/\s+/g, "_")}_image-${Date.now()}.jpg`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        toast.success("Image downloaded successfully!");
      })
      .catch((err) => {
        console.error("Image download failed:", err);
        toast.error("Failed to download image");
      });
  };

  if (!isOpen || !person) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1200] flex items-center justify-center p-4">
      <div
        className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl w-full max-w-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[var(--border-default)]">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            {person.name}
          </h2>
          <Button
            onClick={onClose}
            className="p-2 hover:bg-[var(--bg-surface-2)] rounded-xl transition-colors"
          >
            <X size={26} />
          </Button>
        </div>

        {/* Image Display */}
        <div className="p-8 bg-black flex items-center justify-center min-h-[500px]">
          <img
            src={person.image}
            alt={person.name}
            className="max-h-[520px] max-w-full rounded-2xl shadow-2xl object-contain"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 p-6 border-t border-[var(--border-default)]">
          <Button
            onClick={() => handleDownload(person.image)}
            variant="success"
            className="w-full"
          >
            <Download size={20} />
            Download Image
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
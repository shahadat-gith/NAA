import React, { useState } from "react";
import Cropper from "react-easy-crop";
import "./CropModal.css";
import toast from "react-hot-toast";

const CropModal = ({ isOpen, imageSrc, onClose, onCropSave }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [processing, setProcessing] = useState(false);

  const onCropComplete = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const getFileExtensionFromMimeType = (mimeType) => {
    if (mimeType === "image/png") return "png";
    if (mimeType === "image/webp") return "webp";
    return "jpg";
  };

  const generateUniqueImageName = (mimeType = "image/jpeg") => {
    const extension = getFileExtensionFromMimeType(mimeType);
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).slice(2, 8);

    return `teacher-photo-${timestamp}-${randomString}.${extension}`;
  };

  const getCroppedImg = async (src, cropPixels) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = src;

    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () =>
        reject(new Error("Failed to load source image asset for cropping."));
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Canvas context is not available.");
    }

    canvas.width = cropPixels.width;
    canvas.height = cropPixels.height;

    ctx.drawImage(
      image,
      cropPixels.x,
      cropPixels.y,
      cropPixels.width,
      cropPixels.height,
      0,
      0,
      cropPixels.width,
      cropPixels.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to create cropped image blob."));
            return;
          }

          const uniqueFileName = generateUniqueImageName(blob.type);

          const croppedFile = new File([blob], uniqueFileName, {
            type: blob.type || "image/jpeg",
          });

          resolve({
            file: croppedFile,
            preview: URL.createObjectURL(blob),
          });
        },
        "image/jpeg",
        0.95
      );
    });
  };

  const handleSave = async () => {
    if (!croppedAreaPixels) {
      toast.error("Crop data is not ready yet.");
      return;
    }

    try {
      setProcessing(true);

      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);

      onCropSave(croppedImage.file, croppedImage.preview);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to crop image properly.");
    } finally {
      setProcessing(false);
    }
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div className="cm-crop-backdrop" onClick={onClose}>
      <div className="cm-crop-card" onClick={(e) => e.stopPropagation()}>
        <div className="cm-crop-header">
          <h3>Adjust Profile Photo</h3>
          <button className="cm-close-x" onClick={onClose} disabled={processing}>
            ✕
          </button>
        </div>

        <div className="cm-crop-workspace">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="cm-crop-controls">
          <div className="cm-slider-group">
            <label htmlFor="zoom-range">Zoom</label>
            <input
              id="zoom-range"
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="cm-crop-zoom-range"
              disabled={processing}
            />
          </div>

          <div className="cm-crop-actions">
            <button
              type="button"
              className="cm-btn-secondary"
              onClick={onClose}
              disabled={processing}
            >
              Cancel
            </button>

            <button
              type="button"
              className="cm-btn-primary"
              onClick={handleSave}
              disabled={processing}
            >
              {processing ? "Cropping..." : "Save Photo"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropModal;
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Cropper from "react-easy-crop";
import axios from "axios";
import toast from "react-hot-toast";
import { X, Upload, RotateCw, Image as ImageIcon } from "lucide-react";

import { AdminContext } from "../../context/AdminContext";
import { capitalizeWords } from "../../utils/utility";

const ImageUploadModal = ({ isOpen, student, onClose, onSuccess }) => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  const fileInputRef = useRef(null);

  const [rawImageUrl, setRawImageUrl] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedBlob, setCroppedBlob] = useState(null);
  const [croppedPreview, setCroppedPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isOpen) resetState();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && student?.image?.url) {
      setRawImageUrl(student.image.url);
    }
  }, [isOpen, student]);

  const resetState = () => {
    setRawImageUrl(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setCroppedBlob(null);
    setCroppedPreview("");
  };

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleImageSelection = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRawImageUrl(URL.createObjectURL(file));
    setCroppedBlob(null);
    setCroppedPreview("");
  };

  const applyCrop = async () => {
    if (!croppedAreaPixels || !rawImageUrl) return;

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = rawImageUrl;

    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
    });

    const canvas = document.createElement("canvas");
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          setCroppedBlob(blob);
          setCroppedPreview(URL.createObjectURL(blob));
          resolve();
        },
        "image/jpeg",
        0.9,
      );
    });
  };

  const handleUpload = async () => {
    if (!croppedBlob || !student) return;

    setUploading(true);
    const formData = new FormData();
    const uniqueFileName = `student-${student._id}-${Date.now()}.jpg`;
    formData.append("image", croppedBlob, uniqueFileName);

    if (student.image?.public_id) {
      formData.append("oldPublicId", student.image.public_id);
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/student/upload-profile-picture?id=${student._id}`,
        formData,
        { headers: { Authorization: `Bearer ${adminToken}` } },
      );

      if (data.success) {
        toast.success("Profile picture updated successfully!");
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1100] flex items-center justify-center p-4">
      <div
        className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[var(--border-default)]">
          <div>
            <h2 className="text-2xl font-bold">Upload Student Photo</h2>
            <p className="text-[var(--text-secondary)]">
              {capitalizeWords(student?.name)} • Class {student?.class}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--bg-surface-2)] rounded-xl transition-colors"
          >
            <X size={26} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Crop Area */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Crop Image</h3>
              <div className="relative h-[420px] bg-black rounded-2xl overflow-hidden border border-[var(--border-default)]">
                {rawImageUrl ? (
                  <Cropper
                    image={rawImageUrl}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)]">
                    <ImageIcon size={64} />
                    <p className="mt-4 text-lg">No image selected</p>
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="mt-6 px-6 py-3 bg-[var(--color-primary)] text-white rounded-2xl font-medium flex items-center gap-2 hover:bg-[var(--color-primary-bright)] transition-all"
                    >
                      <Upload size={18} />
                      Select Photo
                    </button>
                  </div>
                )}
              </div>

              {rawImageUrl && (
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium">Zoom</label>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="flex-1 accent-[var(--color-primary)]"
                  />
                  <span className="text-sm w-12 text-right">
                    {zoom.toFixed(1)}x
                  </span>
                </div>
              )}
            </div>

            {/* Preview & Controls */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Preview</h3>
              <div className="border border-[var(--border-default)] rounded-3xl p-6 bg-[var(--bg-base)] min-h-[300px] flex items-center justify-center">
                {croppedPreview ? (
                  <img
                    src={croppedPreview}
                    alt="Cropped Preview"
                    className="max-h-[300px] rounded-2xl shadow-md object-cover"
                  />
                ) : (
                  <div className="text-center text-[var(--text-muted)]">
                    <div className="mx-auto w-20 h-20 rounded-full border-2 border-dashed border-[var(--border-default)] flex items-center justify-center mb-4">
                      <Upload size={32} />
                    </div>
                    <p>Cropped image will appear here</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={applyCrop}
                  disabled={!rawImageUrl}
                  className="flex-1 py-3.5 bg-[var(--bg-base)] border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] rounded-2xl font-medium transition-all disabled:opacity-50"
                >
                  Apply Crop
                </button>

                <button
                  onClick={handleUpload}
                  disabled={!croppedBlob || uploading}
                  className="flex-1 py-3.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-bright)] text-white rounded-2xl font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <RotateCw size={18} className="animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      Upload Photo
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[var(--border-default)] flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 text-[var(--text-secondary)] hover:bg-[var(--bg-surface-2)] rounded-2xl font-medium transition-all"
          >
            Cancel
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageSelection}
        />
      </div>
    </div>
  );
};

export default ImageUploadModal;

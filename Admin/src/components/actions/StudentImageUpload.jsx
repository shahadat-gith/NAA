import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cropper from "react-easy-crop";
import axios from "axios";
import toast from "react-hot-toast";
import { X, Upload, RotateCw, Image as ImageIcon } from "lucide-react";

import { AdminContext } from "../../context/AdminContext";
import { Button } from "../common/Button";

const StudentImageUpload = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { backendUrl, adminToken } = useContext(AdminContext);

  const student = location.state?.student;

  const fileInputRef = useRef(null);

  const [rawImageUrl, setRawImageUrl] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedBlob, setCroppedBlob] = useState(null);
  const [croppedPreview, setCroppedPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  // Load existing image if editing
  useEffect(() => {
    if (student?.image?.url) {
      setRawImageUrl(student.image.url);
    }
  }, [student]);

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
    if (!croppedBlob || !student?._id) {
      return toast.error("Please crop an image first");
    }

    setUploading(true);

    try {
      const formData = new FormData();
      const uniqueFileName = `student-${student._id}-${Date.now()}.jpg`;

      formData.append("image", croppedBlob, uniqueFileName);

      const { data } = await axios.put(
        `${backendUrl}/api/student/${student._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (data.success) {
        toast.success("Profile picture updated successfully!");
        navigate(-1);
      }
    } catch (error) {
      console.error("Student image update error:", error);
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border-default)]">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-[var(--text-primary)]">
            Upload Student Photo
          </h1>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="p-3 rounded-2xl border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] transition-all"
        >
          <X size={26} />
        </button>
      </div>

      <div className="">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl overflow-hidden">
          <div className="p-8">
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
                      <Button
                        onClick={() => fileInputRef.current.click()}
                        className="mt-6"
                      >
                        <Upload size={18} className="mr-2" />
                        Select Photo
                      </Button>
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
                  <Button
                    onClick={applyCrop}
                    disabled={!rawImageUrl}
                    variant="warning"
                  >
                    Apply Crop
                  </Button>

                  <Button
                    onClick={handleUpload}
                    disabled={!croppedBlob || uploading}
                    variant="success"
                    loading={uploading}
                  >
                    {uploading ? (
                      <>
                        <RotateCw size={18} className="animate-spin mr-2" />
                        Uploading...
                      </>
                    ) : (
                      "Upload Photo"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
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

export default StudentImageUpload;

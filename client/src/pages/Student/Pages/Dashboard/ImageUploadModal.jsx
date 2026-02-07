import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AppContext } from "../../../../context/AppContext";
import "../../Styles/ImageUploadModal.css";

const ImageUploadModal = ({ open, onClose, studentId }) => {
  const { backendUrl } = useContext(AppContext);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const previewUrl = useMemo(() => {
    if (!file) return "";
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!open) return null;

  const handleClose = () => {
    setFile(null);
    setUploading(false);
    onClose();
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select an image");
    if (!studentId) return toast.error("Student ID missing");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("id", studentId);

    try {
      setUploading(true);

      const res = await axios.post(
        `${backendUrl}/api/student/upload-temp-profile-pic/${studentId}`,
        formData
      );

      if (res.data?.success) {
        toast.success("Image uploaded. wait for approval");
        handleClose(); 
      } else {
        toast.error(res.data?.message || "Upload failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="ium-overlay">
      <div className="ium-modal">
        <div className="ium-header">
          <h3>Upload Profile Photo</h3>
          <button type="button" onClick={handleClose}>
            ✕
          </button>
        </div>

        <div className="ium-body">
          <div className="ium-preview">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" />
            ) : (
              <div className="ium-placeholder">
                <i className="fas fa-user"></i>
              </div>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div className="ium-actions">
          <button className="ium-cancel" type="button" onClick={handleClose}>
            Cancel
          </button>
          <button
            className="ium-upload"
            type="button"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;

import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AdminContext } from "../../../../context/AdminContext";
import "./EditBannerModal.css";

const EditBannerModal = ({ open, image, isAddMode, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { backendUrl, adminToken } = useContext(AdminContext);

  /* Reset file on open/close */
  useEffect(() => {
    if (!open) setFile(null);
  }, [open]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    // update case
    if (!isAddMode && image?._id) {
      formData.append("heroImageId", image._id);
    }

    try {
      setLoading(true);

      await axios.post(
        `${backendUrl}/api/settings/hero-images/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      toast.success(
        isAddMode ? "Banner image added" : "Banner image updated"
      );

      onSuccess();
      onClose();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Image upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="banner-modal-overlay">
      <div className="banner-modal">
        <h3>{isAddMode ? "Add Banner Image" : "Update Banner Image"}</h3>

        {!isAddMode && image?.url && (
          <img src={image.url} alt="Preview" className="banner-preview" />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <div className="banner-modal-actions">
          <button onClick={onClose} className="cancel-btn" disabled={loading}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBannerModal;

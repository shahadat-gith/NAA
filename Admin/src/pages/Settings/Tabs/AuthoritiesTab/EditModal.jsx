import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./EditModal.css";
import { AdminContext } from "../../../../context/AdminContext";

const EditModal = ({ open, onClose, authority, onSuccess }) => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [formData, setFormData] = useState({
    role: "",
    name: "",
    image: null,
    signature: null,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authority) {
      setFormData({
        role: authority.role || "",
        name: authority.name || "",
        image: null,
        signature: null,
      });
    }
  }, [authority]);

  if (!open || !authority) return null;

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [field]: file }));
    }
  };

 /* ================= SAVE ================= */
const handleSubmit = async () => {
  try {
    setLoading(true);

    const fd = new FormData();


    if (authority?._id) {
      fd.append("id", authority._id);
    }

    if (formData.name) {
      fd.append("name", formData.name);
    }

    if (formData.role) {
      fd.append("role", formData.role);
    }

    if (formData.image instanceof File) {
      fd.append("image", formData.image);
    }

    if (formData.signature instanceof File) {
      fd.append("signature", formData.signature);
    }

    await axios.post(
      `${backendUrl}/api/settings/authority`,
      fd,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    toast.success(
      authority?._id
        ? "Authority updated successfully"
        : "Authority created successfully"
    );

    onClose();
    onSuccess(); // re-fetch authorities
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to save authority"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="em-modal-overlay" onClick={onClose}>
      <div
        className="em-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="em-modal-header">
          <h3 className="em-modal-title">
            <i className="fas fa-user-edit"></i> Edit Authority
          </h3>
          <button className="em-modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* BODY */}
        <div className="em-modal-body">
          <div className="em-form-row">
            <div className="em-form-group">
              <label className="em-form-label">Role</label>
              <input
                className="em-form-input"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              />
            </div>

            <div className="em-form-group">
              <label className="em-form-label">Full Name</label>
              <input
                className="em-form-input"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
          </div>

          <div className="em-form-row">
            <div className="em-form-group">
              <label className="em-form-label">Profile Photo</label>
              <input
                type="file"
                accept="image/*"
                className="em-hidden-file"
                id="em-image-upload"
                onChange={(e) => handleFileChange(e, "image")}
              />
              <label htmlFor="em-image-upload" className="em-upload-box">
                <i className="fas fa-image"></i>
                <span>
                  {formData.image ? formData.image.name : "Choose image"}
                </span>
              </label>
            </div>

            <div className="em-form-group">
              <label className="em-form-label">Digital Signature</label>
              <input
                type="file"
                accept="image/*"
                className="em-hidden-file"
                id="em-sign-upload"
                onChange={(e) => handleFileChange(e, "signature")}
              />
              <label htmlFor="em-sign-upload" className="em-upload-box">
                <i className="fas fa-signature"></i>
                <span>
                  {formData.signature
                    ? formData.signature.name
                    : "Choose signature"}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="em-modal-footer">
          <button
            className="em-btn-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="em-btn-save"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;

import { useState, useContext } from "react";
import "./NoticeAddModal.css";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
import toast from "react-hot-toast";
import { pages } from "./Notices";

const NoticeAddModal = ({ onClose, onSuccess }) => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [formData, setFormData] = useState({
    title: "",
    noticeType: "TEXT",
    externalUrl: "",
    linkedPage: "",
    file: null,
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("noticeType", formData.noticeType);

      if (formData.noticeType === "EXTERNAL_LINK") {
        data.append("externalUrl", formData.externalUrl);
      }

      if (formData.noticeType === "INTERNAL_LINK") {
        data.append("linkedPage", formData.linkedPage);
      }

      if (formData.noticeType === "FILE" && formData.file) {
        data.append("file", formData.file);
      }

      const response = await axios.post(`${backendUrl}/api/notices`, data, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Notice added successfully!");
        onSuccess();
      }
    } catch (error) {
      console.error("Error adding notice:", error);
      toast.error(error.response?.data?.message || "Failed to add notice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Notice</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="notice-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Enter notice title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="noticeType">Notice Type *</label>
            <select
              id="noticeType"
              name="noticeType"
              value={formData.noticeType}
              onChange={handleInputChange}
              required
            >
              <option value="TEXT">Text</option>
              <option value="FILE">File</option>
              <option value="INTERNAL_LINK">Internal Link</option>
              <option value="EXTERNAL_LINK">External Link</option>
            </select>
          </div>

          {formData.noticeType === "EXTERNAL_LINK" && (
            <div className="form-group">
              <label htmlFor="externalUrl">External URL *</label>
              <input
                type="url"
                id="externalUrl"
                name="externalUrl"
                value={formData.externalUrl}
                onChange={handleInputChange}
                required
                placeholder="https://example.com"
              />
            </div>
          )}

          {formData.noticeType === "INTERNAL_LINK" && (
            <div className="form-group">
              <label htmlFor="linkedPage">Linked Page *</label>
              <select
                id="linkedPage"
                name="linkedPage"
                value={formData.linkedPage}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a page</option>
                {pages.map((page) => (
                  <option key={page.path} value={page.path}>
                    {page.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {formData.noticeType === "FILE" && (
            <div className="form-group">
              <label htmlFor="file">Upload File *</label>
              <input
                type="file"
                id="file"
                name="file"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                required
              />
              <small>Supported formats: PDF, Images, Documents</small>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Adding..." : "Add Notice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoticeAddModal;
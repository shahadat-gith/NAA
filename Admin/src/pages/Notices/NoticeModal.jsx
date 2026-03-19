import { useState, useContext, useEffect } from "react";
import "./NoticeModal.css";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
import toast from "react-hot-toast";

const pages = [
  { name: 'Student Portal', path: '/student' },
  { name: 'Academics', path: '/academics' },
  { name: 'Curriculum', path: '/curriculum?type=kinder' },
  { name: 'Teachers', path: '/teachers' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Admission', path: '/admission' },
  { name: 'Result', path: '/result' },
];

const NoticeModal = ({
  onClose,
  setNotices,
  isUpdate,
  currNotice = {}
}) => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    noticeType: "TEXT",
    externalUrl: "",
    linkedPage: "",
    targetDate: "",
    file: null,
  });

  const [loading, setLoading] = useState(false);

  // ✅ Prefill (Update Mode)
  useEffect(() => {
    if (isUpdate && currNotice) {
      setFormData({
        title: currNotice.title || "",
        description: currNotice.description || "",
        noticeType: currNotice.noticeType || "TEXT",
        externalUrl: currNotice.externalUrl || "",
        linkedPage: currNotice.linkedPage || "",
        targetDate: currNotice.targetDate
          ? new Date(currNotice.targetDate).toISOString().slice(0, 16)
          : "",
        file: null,
      });
    }
  }, [isUpdate, currNotice]);

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
      data.append("description", formData.description);
      data.append("noticeType", formData.noticeType);

      // ✅ Handle date + time properly
      if (formData.targetDate) {
        const localDate = new Date(formData.targetDate);
        data.append("targetDate", localDate.toISOString());
      }

      if (formData.noticeType === "EXTERNAL_LINK") {
        data.append("externalUrl", formData.externalUrl);
      }

      if (formData.noticeType === "INTERNAL_LINK") {
        data.append("linkedPage", formData.linkedPage);
      }

      if (formData.noticeType === "FILE" && formData.file) {
        data.append("file", formData.file);
      }

      // ✅ Create vs Update
      const url = isUpdate
        ? `${backendUrl}/api/notices/${currNotice._id}`
        : `${backendUrl}/api/notices`;

      const method = isUpdate ? "put" : "post";

      const response = await axios({
        method,
        url,
        data,
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(
          isUpdate ? "Notice updated successfully!" : "Notice added successfully!"
        );

        if (setNotices) {
          setNotices(response.data.notices);
        }

        onClose();
      }

    } catch (error) {
      console.error("Error saving notice:", error);
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        <div className="modal-header">
          <h3>{isUpdate ? "Update Notice" : "Add New Notice"}</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="notice-form">

          {/* Title */}
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Enter notice title"
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Optional description..."
            />
          </div>

          {/* Notice Type */}
          <div className="form-group">
            <label>Notice Type *</label>
            <select
              name="noticeType"
              value={formData.noticeType}
              onChange={handleInputChange}
            >
              <option value="TEXT">Text</option>
              <option value="FILE">File</option>
              <option value="INTERNAL_LINK">Internal Link</option>
              <option value="EXTERNAL_LINK">External Link</option>
            </select>
          </div>

          {/* External Link */}
          {formData.noticeType === "EXTERNAL_LINK" && (
            <div className="form-group">
              <label>External URL *</label>
              <input
                type="url"
                name="externalUrl"
                value={formData.externalUrl}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          {/* Internal Link */}
          {formData.noticeType === "INTERNAL_LINK" && (
            <div className="form-group">
              <label>Linked Page *</label>
              <select
                name="linkedPage"
                value={formData.linkedPage}
                onChange={handleInputChange}
                required
              >
                <option value="">Select page</option>
                {pages.map((page) => (
                  <option key={page.path} value={page.path}>
                    {page.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* File Upload */}
          {formData.noticeType === "FILE" && (
            <div className="form-group">
              <label>Upload File *</label>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                required={!isUpdate}
              />
            </div>
          )}

          {/* Target Date + Time */}
          <div className="form-group">
            <label>Target Date & Time (Optional)</label>
            <input
              type="datetime-local"
              name="targetDate"
              value={formData.targetDate}
              onChange={handleInputChange}
            />
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Processing...
                </>
              ) : isUpdate ? (
                "Update"
              ) : (
                "Add"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default NoticeModal;
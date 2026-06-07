import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { X, Plus, Upload, Link, FileText, Calendar, Megaphone } from "lucide-react";

import { AdminContext } from "../../context/AdminContext";
import { Button } from "../../components/common/Button";

const pages = [
  { name: "Student Portal", path: "/student" },
  { name: "Academics", path: "/academics" },
  { name: "Curriculum", path: "/curriculum?type=kinder" },
  { name: "Teachers", path: "/teachers" },
  { name: "Gallery", path: "/gallery" },
  { name: "Admission", path: "/admission" },
  { name: "Result", path: "/result" },
];

const NoticeModal = ({
  onClose,
  setNotices,
  isUpdate,
  currNotice = {},
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

  // Prefill in update mode
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("noticeType", formData.noticeType);

    if (formData.targetDate) {
      data.append("targetDate", new Date(formData.targetDate).toISOString());
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

    try {
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
        toast.success(isUpdate ? "Notice updated successfully!" : "Notice added successfully!");
        setNotices?.(response.data.notices || []);
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1100] flex items-center justify-center p-4">
      <div
        className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl w-full max-w-2xl max-h-[70vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[var(--border-default)] flex-shrink-0">
          <div className="flex items-center gap-3">
            <Megaphone className="text-[var(--color-primary)]" size={26} />
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              {isUpdate ? "Update Notice" : "Add New Notice"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--bg-surface-2)] rounded-xl transition-colors"
          >
            <X size={26} />
          </button>
        </div>

        {/* Scrollable Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-8 space-y-8">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Enter notice title"
              className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              placeholder="Optional description..."
              className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none resize-y"
            />
          </div>

          {/* Notice Type */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Notice Type <span className="text-red-500">*</span></label>
            <select
              name="noticeType"
              value={formData.noticeType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
            >
              <option value="TEXT">Text Notice</option>
              <option value="FILE">File Attachment</option>
              <option value="INTERNAL_LINK">Internal Link</option>
              <option value="EXTERNAL_LINK">External Link</option>
            </select>
          </div>

          {/* External URL */}
          {formData.noticeType === "EXTERNAL_LINK" && (
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">External URL <span className="text-red-500">*</span></label>
              <input
                type="url"
                name="externalUrl"
                value={formData.externalUrl}
                onChange={handleInputChange}
                required
                placeholder="https://example.com"
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
              />
            </div>
          )}

          {/* Internal Link */}
          {formData.noticeType === "INTERNAL_LINK" && (
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Linked Page <span className="text-red-500">*</span></label>
              <select
                name="linkedPage"
                value={formData.linkedPage}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
              >
                <option value="">Select Page</option>
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
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Upload File <span className="text-red-500">*</span></label>
              <div className="border border-dashed border-[var(--border-default)] rounded-3xl p-8 text-center">
                <Upload size={48} className="mx-auto text-[var(--text-muted)] mb-3" />
                <p className="text-sm text-[var(--text-secondary)]">Click to upload file</p>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden"
                  id="notice-file"
                  required={!isUpdate}
                />
                <label
                  htmlFor="notice-file"
                  className="mt-4 inline-block px-6 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] rounded-2xl cursor-pointer text-sm font-medium"
                >
                  Choose File
                </label>
                {formData.file && <p className="mt-3 text-emerald-500 text-sm">{formData.file.name}</p>}
              </div>
            </div>
          )}

          {/* Target Date */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Target Date & Time (Optional)</label>
            <input
              type="datetime-local"
              name="targetDate"
              value={formData.targetDate}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
            />
          </div>
        </form>

        {/* Fixed Footer */}
        <div className="p-6 border-t border-[var(--border-default)] flex gap-3 flex-shrink-0">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full"
            loading={loading}
          >
            {loading ? "Saving..." : isUpdate ? "Update Notice" : "Add Notice"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NoticeModal;
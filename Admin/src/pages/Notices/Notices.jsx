import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, Megaphone } from "lucide-react";

import { AdminContext } from "../../context/AdminContext";
import Loader from "../../components/common/Loader";
import { Button } from "../../components/common/Button";

const Notices = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);
  const navigate = useNavigate();

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH NOTICES ================= */
  const fetchNotices = async () => {
    if (!adminToken) return;
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/notices`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      if (response.data.success) {
        setNotices(response.data.notices || []);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [adminToken]);

  /* ================= DELETE ================= */
  const handleDelete = async (notice) => {
    const confirmDelete = window.confirm(`Delete notice "${notice.title}"?`);
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`${backendUrl}/api/notices/${notice._id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      if (res.data.success) {
        toast.success("Notice deleted successfully");
        setNotices(res.data.notices || notices.filter((n) => n._id !== notice._id));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete notice");
    }
  };

  /* ================= NAVIGATE TO ACTION PAGE ================= */
  const openAddNotice = () => {
    navigate("/actions?type=NoticeForm");
  };

  const openEditNotice = (notice) => {
    navigate("/actions?type=NoticeForm", { 
      state: { isUpdate: true, currNotice: notice } 
    });
  };

  if (loading) return <Loader text="Loading notices..." />;

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border-default)]">
        <div className="flex items-center gap-4">
          <Megaphone className="text-[var(--color-primary)]" size={32} />
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Notices</h1>
            <p className="text-[var(--text-secondary)]">Manage school announcements and notices</p>
          </div>
        </div>

        <Button onClick={openAddNotice}>
          Add New Notice
        </Button>
      </div>

      {/* Table */}
      <div className="p-4">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="border-b border-[var(--border-default)] bg-[var(--bg-surface-2)]">
                  <th className="px-6 py-5 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Title</th>
                  <th className="px-6 py-5 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Type</th>
                  <th className="px-6 py-5 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-5 text-center text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-default)]">
                {notices.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-20 text-center">
                      <Megaphone size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
                      <p className="text-[var(--text-secondary)]">No notices found</p>
                    </td>
                  </tr>
                ) : (
                  notices.map((notice) => (
                    <tr key={notice._id} className="hover:bg-[var(--bg-surface-2)] transition-colors">
                      <td className="px-6 py-5 font-medium">{notice.title}</td>
                      <td className="px-6 py-5">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border capitalize
                          ${notice.noticeType === "TEXT" ? "bg-blue-500/10 text-blue-500 border-blue-500/30" : ""}
                          ${notice.noticeType === "FILE" ? "bg-amber-500/10 text-amber-500 border-amber-500/30" : ""}
                          ${notice.noticeType === "LINK" ? "bg-purple-500/10 text-purple-500 border-purple-500/30" : ""}
                        `}>
                          {notice.noticeType}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-[var(--text-secondary)]">
                        {new Date(notice.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditNotice(notice)}
                            className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(notice)}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notices;
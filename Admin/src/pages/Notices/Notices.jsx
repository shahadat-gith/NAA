import { useState, useEffect, useContext } from "react";
import "./Notices.css";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import NoticeModal from "./NoticeModal";

const Notices = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);

  const noticeTypeOptions = ["", "TEXT", "FILE", "INTERNAL_LINK", "EXTERNAL_LINK"];

  const [filters, setFilters] = useState({
    noticeType: "",
  });

  /* ================= FETCH ================= */
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
    const confirmDelete = window.confirm(
      `Delete "${notice.title}"?`
    );
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(
        `${backendUrl}/api/notices/${notice._id}`,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );

      if (res.data.success) {
        toast.success("Notice deleted");
        setNotices(res.data.notices);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (notice) => {
    setSelectedNotice(notice);
    setIsUpdate(true);
    setShowModal(true);
  };

  /* ================= ADD ================= */
  const handleAdd = () => {
    setSelectedNotice(null);
    setIsUpdate(false);
    setShowModal(true);
  };

  if (loading) {
    return <Loader text="Loading notices..." />;
  }

  return (
    <div className="notices-page">
      
      {/* Header */}
      <div className="notices-header">
        <h2>Notices</h2>
        <button className="add-notice-btn" onClick={handleAdd}>
          <i className="fas fa-plus"></i> Add Notice
        </button>
      </div>

      {/* Table */}
      <div className="notices-table-container">
        <table className="notices-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {notices.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data">
                  No notices found.
                </td>
              </tr>
            ) : (
              notices.map((notice) => (
                <tr key={notice._id}>
                  
                  <td>{notice.title}</td>

                  <td>
                    <span className={`notice-type ${notice.noticeType.toLowerCase()}`}>
                      {notice.noticeType}
                    </span>
                  </td>

                  <td>
                    {new Date(notice.createdAt).toLocaleDateString("en-IN")}
                  </td>

                  <td className="actions-cell">
                    
                    {/* ✏️ Edit */}
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(notice)}
                      title="Edit"
                    >
                      <i className="fas fa-pen"></i>
                    </button>

                    {/* 🗑 Delete */}
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(notice)}
                      title="Delete"
                    >
                      <i className="fas fa-trash"></i>
                    </button>

                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <NoticeModal
          onClose={() => setShowModal(false)}
          setNotices={setNotices}
          isUpdate={isUpdate}
          currNotice={selectedNotice}
        />
      )}
    </div>
  );
};

export default Notices;
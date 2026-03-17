
import { useState, useEffect, useContext } from "react";
import "./Notices.css";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../components/Loader/Loader";
import NoticeAddModal from "./NoticeAddModal";


export const pages = [
  { name: 'Student Portal', path: '/student'},

  { name: 'Academics', path: '/academics'},

  { name: 'Curriculum', path: '/curriculum?type=kinder'},

  { name: 'Teachers', path: '/teachers'},

  { name: 'Gallery', path: '/gallery'},

  { name: 'Admission', path: '/admission'},

  { name: 'Result', path: '/result'},
];


const Notices = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const noticeTypeOptions = ["", "TEXT", "FILE", "INTERNAL_LINK", "EXTERNAL_LINK"];

  const [filters, setFilters] = useState({
    noticeType: "",
  });

  /* ================= FETCH NOTICES ================= */
  const fetchNotices = async () => {
    if (!adminToken) return;
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/notices`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      if (response.data.success) {
        setNotices(response.data.notices || []);
      }
    } catch (error) {
      console.error("Error fetching notices:", error);
      toast.error("Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD ON MOUNT ================= */
  useEffect(() => {
    fetchNotices();
  }, [adminToken]);

  /* ================= CLEAR FILTERS ================= */
  const clearFilters = () => {
    setFilters({
      noticeType: "",
    });
  };

  /* ================= FILTERED DATA ================= */
  const filteredNotices = notices.filter((notice) => {
    if (filters.noticeType && notice.noticeType !== filters.noticeType) {
      return false;
    }
    return true;
  });

  /* ================= DELETE ================= */
  const handleDelete = async (notice) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the notice "${notice.title}"?`);
    if (!confirmDelete) return;

    try {
      await axios.delete(`${backendUrl}/api/notices/${notice._id}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      toast.success("Notice deleted successfully");
      fetchNotices();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting notice");
    }
  };

  if (loading) {
    return <Loader text="Loading notices..." />;
  }

  return (
    <div className="notices-page">
      <div className="notices-header">
        <h2>Notices</h2>
        <button
          className="add-notice-btn"
          onClick={() => setShowAddModal(true)}
        >
          <i className="fas fa-plus"></i> Add Notice
        </button>
      </div>

      {/* ================= FILTERS ================= */}
      <div className="notices-filter">
        <label>Type</label>
        <select
          value={filters.noticeType}
          onChange={(e) =>
            setFilters({
              ...filters,
              noticeType: e.target.value,
            })
          }
        >
          {noticeTypeOptions.map((type) => (
            <option key={type} value={type}>
              {type || "All"}
            </option>
          ))}
        </select>

        <button className="clear-filter-btn" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      {/* ================= NOTICES TABLE ================= */}
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
            {filteredNotices.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data">
                  No notices found.
                </td>
              </tr>
            ) : (
              filteredNotices.map((notice) => (
                <tr key={notice._id}>
                  <td>{notice.title}</td>
                  <td>
                    <span className={`notice-type ${notice.noticeType.toLowerCase()}`}>
                      {notice.noticeType}
                    </span>
                  </td>
                  <td>{new Date(notice.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(notice)}
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

      {/* ================= MODALS ================= */}
      {showAddModal && (
        <NoticeAddModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            fetchNotices();
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Notices;
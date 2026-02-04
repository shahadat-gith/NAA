import React, { useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AdminContext } from "../../../../context/AdminContext";
import { formatClassName } from "../../../../utils/formatclass";
import { CLASS_OPTIONS } from "../../../../utils/academicOptions";
import ExamModal from "./ExamModal";
import ExamRoutineModal from "./ExamRoutineModal";
import ExamSettingsModal from "./ExamSettingsModal";
import "./AdmitcardTab.css";

const AdmitCardTab = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [settings, setSettings] = useState([]);
  const [currentExam, setCurrentExam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMedium, setFilterMedium] = useState("");

  // Exam add/edit modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // Exam routine modal
  const [routineOpen, setRoutineOpen] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState(null);

  // Current exam modal
  const [examModalOpen, setExamModalOpen] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/settings/admitcard`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.data.success) {
        const data = res.data.data || {};
        const admitCardSettings = data.admitCardSettings || data || [];
        const examSettings = data.examSettings || [];
        setSettings(admitCardSettings);
        setCurrentExam(examSettings[examSettings.length - 1] || null);
      }
    } catch {
      toast.error("Failed to load exam schedules");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER & SORT LOGIC ================= */
  const filteredSettings = useMemo(() => {
    let data = [...settings];

    // 1. Filter by Medium
    if (filterMedium) {
      data = data.filter((s) => s.medium === filterMedium);
    }

    // 2. Search by Class Name
    if (searchTerm) {
      data = data.filter((s) =>
        formatClassName(s.class).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 3. Sort based on CLASS_OPTIONS order
    return data.sort((a, b) => {
      const orderA = CLASS_OPTIONS[a.medium]?.indexOf(a.class) ?? 999;
      const orderB = CLASS_OPTIONS[b.medium]?.indexOf(b.class) ?? 999;
      
      if (a.medium !== b.medium) {
        return a.medium.localeCompare(b.medium); // Group by medium first
      }
      return orderA - orderB;
    });
  }, [settings, searchTerm, filterMedium]);

  /* ================= SAVE / DELETE / VIEW (Keep Existing) ================= */
  const handleSave = async (data) => {
    try {
      setLoading(true);
      const res = await axios.put(
        `${backendUrl}/api/settings/update`,
        data,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      if (res.data.success) {
        toast.success("Exam schedule saved");
        setModalOpen(false);
        setEditData(null);
        fetchSettings();
      }
    } catch {
      toast.error("Failed to save schedule");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;
    try {
      setLoading(true);
      await axios.delete(`${backendUrl}/api/settings/admitcard/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      toast.success("Exam schedule deleted");
      fetchSettings();
    } catch {
      toast.error("Failed to delete schedule");
    } finally {
      setLoading(false);
    }
  };

  const openRoutineModal = (schedule) => {
    setSelectedRoutine(schedule);
    setRoutineOpen(true);
  };

  const handleExamUpdate = async (payload) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${backendUrl}/api/settings/exam/upsert`,
        payload,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      if (res.data.success) {
        toast.success("Current exam updated");
        setExamModalOpen(false);
        fetchSettings();
      }
    } catch {
      toast.error("Failed to update exam");
    } finally {
      setLoading(false);
    }
  };

  if (loading && settings.length === 0) {
    return (
      <div className="srv-loading">
        <div className="srv-spinner"></div>
        <div>Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="act-container">
      <div className="act-header">
        <h3>Admit Card – Exam Schedules</h3>
        <div className="act-header-actions">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by class..."
            className="act-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Medium Filter */}
          <select 
            value={filterMedium} 
            onChange={(e) => setFilterMedium(e.target.value)}
            className="act-filter-select"
          >
            <option value="">All Mediums</option>
            {["english", "assamese"].map(m => (
              <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
            ))}
          </select>

          <button className="act-add-btn" onClick={() => setModalOpen(true)}>
            + Add Schedule
          </button>
        </div>
      </div>

      <div className="act-current-exam">
        <div className="act-current-exam-info">
          <div className="act-current-exam-label">Current Exam</div>
          <div className="act-current-exam-value">
            {currentExam?.examName || "Not set"}
            {currentExam?.academicSession
              ? ` (${currentExam.academicSession})`
              : ""}
          </div>
        </div>
        <button
          className="act-current-exam-btn"
          onClick={() => setExamModalOpen(true)}
        >
          Update Exam
        </button>
      </div>

      <table className="act-table">
        <thead>
          <tr>
            <th>Class</th>
            <th>Stream</th>
            <th>Medium</th>
            <th>Exam Center</th>
            <th>Exam Routine</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredSettings.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", opacity: 0.7 }}>
                No exam schedules found matching your criteria
              </td>
            </tr>
          ) : (
            filteredSettings.map((s) => (
              <tr key={s._id}>
                <td>{formatClassName(s.class)}</td>
                <td>{s.stream || "-"}</td>
                <td style={{ textTransform: 'capitalize' }}>{s.medium || "-"}</td>
                <td>{s.examCenter || "-"}</td>
                <td>
                  <button className="act-link-btn" onClick={() => openRoutineModal(s)}>
                    View Routine
                  </button>
                </td>
                <td className="act-action-cell">
                  <button className="act-edit-btn" onClick={() => { setEditData(s); setModalOpen(true); }}>
                    Edit
                  </button>
                  <button className="act-delete-btn" onClick={() => handleDelete(s._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modals remain the same */}
      <ExamModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditData(null); }}
        onSubmit={handleSave}
        initialData={editData}
        loading={loading}
      />
      <ExamRoutineModal
        open={routineOpen}
        onClose={() => { setRoutineOpen(false); setSelectedRoutine(null); }}
        routine={selectedRoutine}
        examDetails={currentExam}
      />
      <ExamSettingsModal
        open={examModalOpen}
        onClose={() => setExamModalOpen(false)}
        onSubmit={handleExamUpdate}
        initialData={currentExam}
        loading={loading}
      />
    </div>
  );
};

export default AdmitCardTab;
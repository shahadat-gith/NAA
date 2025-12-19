import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AdminContext } from "../../../../context/AdminContext";
import { formatClassName } from "../../../../utils/formatclass";
import ExamModal from "./ExamModal";
import ExamRoutineModal from "./ExamRoutineModal";
import "./AdmitcardTab.css";

const AdmitCardTab = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Exam add/edit modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // Exam routine modal
  const [routineOpen, setRoutineOpen] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/settings/admitcard`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.data.success) setSettings(res.data.data || []);
    } catch {
      toast.error("Failed to load exam schedules");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SAVE ================= */
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

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this exam schedule? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);
      const res = await axios.delete(
        `${backendUrl}/api/settings/admitcard/${id}`,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );

      if (res.data.success) {
        toast.success("Exam schedule deleted");
        fetchSettings();
      }
    } catch {
      toast.error("Failed to delete schedule");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VIEW ROUTINE ================= */
  const openRoutineModal = (schedule) => {
    setSelectedRoutine(schedule);
    setRoutineOpen(true);
  };

  if (loading) {
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
        <button className="act-add-btn" onClick={() => setModalOpen(true)}>
          + Add Schedule
        </button>
      </div>

      {/* ================= TABLE ================= */}
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
          {settings.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", opacity: 0.7 }}>
                No exam schedules configured
              </td>
            </tr>
          )}

          {settings.map((s) => (
            <tr key={s._id}>
              <td>{formatClassName(s.class)}</td>
              <td>{s.stream || "-"}</td>
              <td>{s.medium || "-"}</td>
              <td>{s.examCenter || "-"}</td>

              {/* Exam Routine */}
              <td>
                <button
                  className="act-link-btn"
                  onClick={() => openRoutineModal(s)}
                >
                  View Routine
                </button>
              </td>

              {/* Actions */}
              <td className="act-action-cell">
                <button
                  className="act-edit-btn"
                  onClick={() => {
                    setEditData(s);
                    setModalOpen(true);
                  }}
                >
                  Edit
                </button>

                <button
                  className="act-delete-btn"
                  onClick={() => handleDelete(s._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= ADD / EDIT MODAL ================= */}
      <ExamModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSubmit={handleSave}
        initialData={editData}
        loading={loading}
      />

      {/* ================= ROUTINE MODAL ================= */}
      <ExamRoutineModal
        open={routineOpen}
        onClose={() => {
          setRoutineOpen(false);
          setSelectedRoutine(null);
        }}
        routine={selectedRoutine}
      />
    </div>
  );
};

export default AdmitCardTab;

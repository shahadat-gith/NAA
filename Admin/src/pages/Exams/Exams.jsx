import React, { useContext, useMemo, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./Styles/Exams.css";
import { AdminContext } from "../../context/AdminContext";
import { CLASS_OPTIONS } from "../../utils/academicOptions";
import RoutineModal from "./Components/RoutineModal";
import RoutinePreviewModal from "./Components/RoutinePreviewModal";
import CurrentExamModal from "./Components/CurrentExamModal";
import AdmitCardDownloadModal from "./Components/AdmitCardDownloadModal";
import Loader from "../../components/Loader/Loader";

const Exams = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMedium, setFilterMedium] = useState("");

  const [routineModalOpen, setRoutineModalOpen] = useState(false);
  const [editRoutine, setEditRoutine] = useState(null);

  const [routinePreviewOpen, setRoutinePreviewOpen] = useState(false);
  const [routineToPreview, setRoutineToPreview] = useState(null);

  const [currentExamModalOpen, setCurrentExamModalOpen] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  const [savingLoading, setSavingLoading] = useState(false);


  

  /* ================= FETCH EXAMS ================= */
  const fetchExams = async () => {
    if (!adminToken) return;
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/settings/`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      if (response.data.success) {
        const {
          admitCards,
          exams,
          authorities,
          heroImages,
        } = response.data.data || {};

        setSettings({
          admitCards: admitCards || [],
          exams: exams || [],
          authorities: authorities || [],
          heroImages: heroImages || [],
        });
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
      toast.error("Failed to load exams");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD ON MOUNT ================= */
  useEffect(() => {
    fetchExams();
  }, [adminToken]);

  const admitCards = settings?.admitCards || [];
  const exams = settings?.exams || [];
  const authorities = settings?.authorities || [];
  const currentExam = exams?.[exams.length - 1] || null;

  /* ================= FILTER & SORT ================= */
  const filteredAdmitCards = useMemo(() => {
    let data = [...admitCards];

    if (filterMedium) {
      data = data.filter((s) => s.medium === filterMedium);
    }

    if (searchTerm) {
      data = data.filter((s) =>
        s.class.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return data.sort((a, b) => {
      const orderA = CLASS_OPTIONS[a.medium]?.indexOf(a.class) ?? 999;
      const orderB = CLASS_OPTIONS[b.medium]?.indexOf(b.class) ?? 999;

      if (a.medium !== b.medium) {
        return a.medium.localeCompare(b.medium);
      }

      return orderA - orderB;
    });
  }, [admitCards, searchTerm, filterMedium]);

  /* ================= SAVE / DELETE ================= */

  const handleSaveRoutine = async (data) => {
    try {
      const res = await axios.put(
        `${backendUrl}/api/settings/update`,
        data,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      if (res.data.success) {
        toast.success("Exam schedule saved");
        setRoutineModalOpen(false);
        setEditRoutine(null);
      }
    } catch {
      toast.error("Failed to save schedule");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${backendUrl}/api/settings/admitcard/${id}`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      toast.success("Exam schedule deleted");
    } catch {
      toast.error("Failed to delete schedule");
    }
  };

  const handleCurrentExamUpdate = async (payload) => {
    setSavingLoading(true)
    try {
      const res = await axios.post(
        `${backendUrl}/api/settings/exam/upsert`,
        payload,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      if (res.data.success) {
        toast.success("Current exam updated");
        setCurrentExamModalOpen(false);
        fetchExams();
      }
    } catch {
      toast.error("Failed to update exam");
    }finally{
      setSavingLoading(false)
    }
  };

  if(loading) return <Loader text="Loading exams..." />

  return (
    <div className="act-container">
      <div className="act-header">
        <h3>Admit Card – Exam Schedules</h3>

        <div className="act-header-actions">
          <input
            type="text"
            placeholder="Search by class..."
            className="act-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            value={filterMedium}
            onChange={(e) => setFilterMedium(e.target.value)}
            className="act-filter-select"
          >
            <option value="">All Mediums</option>
            <option value="english">English</option>
            <option value="assamese">Assamese</option>
          </select>

          <button
            className="act-add-btn"
            onClick={() => setRoutineModalOpen(true)}
          >
            + Add Schedule
          </button>

          <button
            className="exams-header-btn"
            onClick={() => setDownloadModalOpen(true)}
          >
            Admit Card
          </button>
        </div>
      </div>

      {/* Current Exam */}
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

        <div className="act-current-exam-info">
          <div className="act-current-exam-label">Morning Time</div>
          <div className="act-current-exam-value">
            {currentExam?.time?.morning || "NOT SET"}
          </div>
        </div>

        <div className="act-current-exam-info">
          <div className="act-current-exam-label">Afternoon Time</div>
          <div className="act-current-exam-value">
            {currentExam?.time?.afternoon || "NOT SET"}
          </div>
        </div>

        <button
          className="act-current-exam-btn"
          onClick={() => setCurrentExamModalOpen(true)}
        >
          Update Exam
        </button>
      </div>

      {/* Table */}
      <div className="act-table-wrapper">
        <table className="act-table">
          <thead>
            <tr>
              <th>Class</th>
              <th>Medium</th>
              <th>Exam Routine</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmitCards.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", opacity: 0.7 }}>
                  No exam schedules found
                </td>
              </tr>
            ) : (
              filteredAdmitCards.map((s) => (
              <tr key={s._id}>
                <td>{s.class.toUpperCase()}</td>
                <td style={{ textTransform: "capitalize" }}>
                  {s.medium || "-"}
                </td>
                <td>
                  <button
                    className="act-link-btn"
                    onClick={() => {
                      setRoutineToPreview(s);
                      setRoutinePreviewOpen(true);
                    }}
                  >
                    View Routine
                  </button>
                </td>
                <td className="act-action-cell">
                  <button
                    className="act-edit-btn"
                    onClick={() => {
                      setEditRoutine(s);
                      setRoutineModalOpen(true);
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
            ))
          )}
        </tbody>
        </table>
      </div>

      {/* Modals */}
      <RoutineModal
        open={routineModalOpen}
        onClose={() => {
          setRoutineModalOpen(false);
          setEditRoutine(null);
        }}
        onSubmit={handleSaveRoutine}
        initialData={editRoutine}
        loading={savingLoading}
      />

      <RoutinePreviewModal
        open={routinePreviewOpen}
        onClose={() => {
          setRoutinePreviewOpen(false);
          setRoutineToPreview(null);
        }}
        routine={routineToPreview}
        examDetails={currentExam}
        authorities={authorities}
      />

      <CurrentExamModal
        open={currentExamModalOpen}
        onClose={() => setCurrentExamModalOpen(false)}
        onSubmit={handleCurrentExamUpdate}
        initialData={currentExam}
        loading={savingLoading}
      />

      <AdmitCardDownloadModal
        open={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
      />
    </div>
  );
};

export default Exams;

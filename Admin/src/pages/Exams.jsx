import React, { useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Plus, Search, Edit2, Trash2, Eye, Calendar } from "lucide-react";
import { CLASS_OPTIONS } from "../utils/academicOptions";

import { AdminContext } from "../context/AdminContext";
import Loader from "../components/common/Loader";

import RoutineModal from "../components/exams/RoutineModal";
import RoutinePreviewModal from "../components/exams/RoutinePreviewModal";
import CurrentExamModal from "../components/exams/CurrentExamModal";
import AdmitCardDownloadModal from "../components/exams/AdmitCardDownloadModal";

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

  /* ================= FETCH SETTINGS ================= */
  const fetchExams = async () => {
    if (!adminToken) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/settings/`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      if (data.success) {
        const { admitCards, exams, authorities, heroImages } = data.data || {};
        setSettings({
          admitCards: admitCards || [],
          exams: exams || [],
          authorities: authorities || [],
          heroImages: heroImages || [],
        });
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
      toast.error("Failed to load exam data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, [adminToken]);

  const admitCards = settings?.admitCards || [];
  const exams = settings?.exams || [];
  const authorities = settings?.authorities || [];
  const currentExam = exams?.[exams.length - 1] || null;

  /* ================= FILTERED DATA ================= */
  const filteredAdmitCards = useMemo(() => {
    let data = [...admitCards];

    if (filterMedium) {
      data = data.filter((s) => s.medium === filterMedium);
    }

    if (searchTerm) {
      data = data.filter((s) =>
        s.class?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return data.sort((a, b) => {
      if (a.medium !== b.medium) return a.medium.localeCompare(b.medium);

      const orderA = CLASS_OPTIONS[a.medium]?.indexOf(a.class) ?? 999;
      const orderB = CLASS_OPTIONS[b.medium]?.indexOf(b.class) ?? 999;
      return orderA - orderB;
    });
  }, [admitCards, searchTerm, filterMedium]);

  /* ================= HANDLERS ================= */
  const handleSaveRoutine = async (data) => {
    try {
      const res = await axios.put(
        `${backendUrl}/api/settings/update`,
        data,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      if (res.data.success) {
        toast.success("Exam schedule saved successfully");
        setRoutineModalOpen(false);
        setEditRoutine(null);
        fetchExams();
      }
    } catch (error) {
      toast.error("Failed to save schedule");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this exam schedule?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${backendUrl}/api/settings/admitcard/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      toast.success("Schedule deleted successfully");
      fetchExams();
    } catch (error) {
      toast.error("Failed to delete schedule");
    }
  };

  const handleCurrentExamUpdate = async (payload) => {
    setSavingLoading(true);
    try {
      const res = await axios.post(
        `${backendUrl}/api/settings/exam/upsert`,
        payload,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      if (res.data.success) {
        toast.success("Current exam updated successfully");
        setCurrentExamModalOpen(false);
        fetchExams();
      }
    } catch (error) {
      toast.error("Failed to update exam");
    } finally {
      setSavingLoading(false);
    }
  };

  if (loading) return <Loader text="Loading exams..." />;

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Exams & Admit Cards</h1>
            <p className="text-[var(--text-secondary)] mt-1">Manage routines and admit cards</p>
          </div>

          <div className="flex gap-3 mt-4 md:mt-0">
            <button
              onClick={() => setRoutineModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-bright)] text-white rounded-2xl font-semibold transition-all"
            >
              Add Schedule
            </button>

            <button
              onClick={() => setDownloadModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] rounded-2xl font-semibold transition-all"
            >
              Admit Card
            </button>
          </div>
        </div>

        {/* Current Exam */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="text-sm md:text-xl font-semibold">Current Exam</h3>
                <p className="text-[var(--text-secondary)] text-sm">
                  {currentExam?.examName || "No exam configured"} 
                  {currentExam?.academicSession && ` (${currentExam.academicSession})`}
                </p>
              </div>
            </div>

            <button
              onClick={() => setCurrentExamModalOpen(true)}
              className="px-5 py-2.5 border bg-[var(--color-primary)] border-[var(--border-default)] hover:bg-[var(--bg-surface)] rounded-2xl font-medium transition-all"
            >
              Update
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <p className="text-sm text-[var(--text-muted)]">Morning Shift</p>
              <p className="text-md font-semibold mt-1">{currentExam?.time?.morning || "Not Set"}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--text-muted)]">Afternoon Shift</p>
              <p className="text-md font-semibold mt-1">{currentExam?.time?.afternoon || "Not Set"}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={20} />
            <input
              type="text"
              placeholder="Search by class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
            />
          </div>

          <select
            value={filterMedium}
            onChange={(e) => setFilterMedium(e.target.value)}
            className="px-5 py-4 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
          >
            <option value="">All Mediums</option>
            <option value="english">English</option>
            <option value="assamese">Assamese</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="border-b border-[var(--border-default)] bg-[var(--bg-surface-2)]">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Class</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Medium</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Exam Routine</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[var(--border-default)]">
                {filteredAdmitCards.length > 0 ? (
                  filteredAdmitCards.map((s) => (
                    <tr key={s._id} className="hover:bg-[var(--bg-surface-2)] transition-colors">
                      <td className="px-6 py-4 font-semibold">{s.class}</td>
                      <td className="px-6 py-4 capitalize">{s.medium}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setRoutineToPreview(s);
                            setRoutinePreviewOpen(true);
                          }}
                          className="text-[var(--color-primary)] hover:underline flex items-center gap-1.5"
                        >
                          <Eye size={16} />
                          View Routine
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => {
                              setEditRoutine(s);
                              setRoutineModalOpen(true);
                            }}
                            className="p-2 hover:bg-[var(--bg-surface-2)] rounded-xl text-[var(--color-primary)] transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(s._id)}
                            className="p-2 hover:bg-red-500/10 rounded-xl text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-20 text-center text-[var(--text-secondary)]">
                      No exam schedules found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
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
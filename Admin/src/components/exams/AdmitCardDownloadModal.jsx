import React, { useContext, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Search, X, Download } from "lucide-react";

import { CLASS_OPTIONS, STREAM_OPTIONS } from "../../utils/academicOptions";
import { generateAdmitCards } from "./generateAdmitCard";
import { pdf } from "@react-pdf/renderer";

import StudentList from "./StudentList";
import DownloadProgressModal from "./DownloadProgressModal";
import { AppContext } from "../../context/AppContext";

const AdmitCardDownloadModal = ({ open, onClose }) => {
  const { settings, students } = useContext(AppContext);

  const [medium, setMedium] = useState("");
  const [cls, setCls] = useState("");
  const [stream, setStream] = useState("");
  const [query, setQuery] = useState("");
  const [selectedStudentKey, setSelectedStudentKey] = useState("");

  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentExam = settings?.exams?.[settings.exams?.length - 1] ?? null;
  const principal = settings?.authorities?.find(
    (a) => a.role?.toLowerCase() === "principal"
  ) ?? null;

  const availableClasses = useMemo(() => {
    return medium ? CLASS_OPTIONS[medium] || [] : [];
  }, [medium]);

  const classStudents = useMemo(() => {
    if (!medium || !cls) return [];
    return (students || []).filter((s) => {
      if (s.medium !== medium) return false;
      if (s.class !== cls) return false;
      if ((cls === "11" || cls === "12") && stream && s.stream !== stream) return false;
      return true;
    });
  }, [students, medium, cls, stream]);

  const searchedStudents = useMemo(() => {
    if (!query.trim()) return [];
    const term = query.toLowerCase();
    return (students || []).filter(
      (s) =>
        s.name?.toLowerCase().includes(term) ||
        s.registrationNo?.toLowerCase().includes(term)
    );
  }, [students, query]);

  const isSearchMode = query.trim().length > 0;
  const studentsToShow = isSearchMode ? searchedStudents : classStudents;

  let studentsToDownload = [];
  let admitCard = null;
  let errorMessage = "";

  if (isSearchMode) {
    if (searchedStudents.length === 1) {
      studentsToDownload = searchedStudents;
    } else if (searchedStudents.length > 1) {
      if (selectedStudentKey) {
        const picked = searchedStudents.find(
          (s) => (s._id || s.registrationNo) === selectedStudentKey
        );
        if (picked) studentsToDownload = [picked];
      } else {
        errorMessage = "Multiple students found. Please select one.";
      }
    }
  } else {
    if (!medium) errorMessage = "Please select Medium";
    else if (!cls) errorMessage = "Please select Class";
    else if ((cls === "11" || cls === "12") && !stream) errorMessage = "Please select Stream";
    else if (classStudents.length === 0) errorMessage = "No students found in this category";
    else studentsToDownload = classStudents;
  }

  if (studentsToDownload.length > 0) {
    admitCard = (settings?.admitCards || []).find((card) => {
      const stu = studentsToDownload[0];
      if (card.class !== stu.class) return false;
      if (card.medium !== stu.medium) return false;
      return stu.stream ? card.stream === stu.stream : !card.stream;
    });

    if (!currentExam) errorMessage = "Current exam is not set";
    else if (!principal) errorMessage = "Principal details not found";
    else if (!admitCard) errorMessage = "No admit card schedule found";
  }

  const handleDownload = async () => {
    if (studentsToDownload.length === 0) return;

    try {
      setIsProgressOpen(true);
      setProgress(0);

      await new Promise((resolve) => setTimeout(resolve, 300));

      const blob = await pdf(
        generateAdmitCards({
          students: studentsToDownload,
          admitCard,
          examDetails: currentExam,
          principal,
        })
      ).toBlob();

      setProgress(100);

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = studentsToDownload.length === 1
        ? `admit_card_${studentsToDownload[0].registrationNo}.pdf`
        : `admit_cards_${cls || "all"}_${medium}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      toast.success("Admit card(s) downloaded successfully!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to generate admit card");
    } finally {
      setTimeout(() => {
        setIsProgressOpen(false);
        setProgress(0);
      }, 800);
    }
  };

  const resetAndClose = () => {
    if (isProgressOpen) return;
    setMedium("");
    setCls("");
    setStream("");
    setQuery("");
    setSelectedStudentKey("");
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1100] flex items-center justify-center p-4">
        <div
          className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl w-full max-w-4xl max-h-[60vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Fixed Header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-[var(--border-default)] flex-shrink-0">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Download Admit Cards</h2>
            <button
              onClick={resetAndClose}
              className="p-2 hover:bg-[var(--bg-surface-2)] rounded-xl transition-colors"
            >
              <X size={26} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-auto p-8 space-y-8">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Medium</label>
                <select
                  value={medium}
                  onChange={(e) => {
                    setMedium(e.target.value);
                    setCls("");
                    setStream("");
                    setSelectedStudentKey("");
                  }}
                  className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                >
                  <option value="">All Mediums</option>
                  <option value="english">English</option>
                  <option value="assamese">Assamese</option>
                </select>
              </div>

              {medium && (
                <div>
                  <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Class</label>
                  <select
                    value={cls}
                    onChange={(e) => {
                      setCls(e.target.value);
                      setStream("");
                      setSelectedStudentKey("");
                    }}
                    className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                  >
                    <option value="">All Classes</option>
                    {availableClasses.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              )}

              {(cls === "11" || cls === "12") && (
                <div>
                  <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Stream</label>
                  <select
                    value={stream}
                    onChange={(e) => setStream(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                  >
                    <option value="">All Streams</option>
                    <option value="science">Science</option>
                    <option value="arts">Arts</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Quick Search</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setSelectedStudentKey("");
                    }}
                    placeholder="Name or Reg No..."
                    className="w-full pl-11 pr-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Student List */}
            <StudentList
              students={studentsToShow}
              selectable={isSearchMode}
              selectedKey={selectedStudentKey}
              onSelect={setSelectedStudentKey}
            />

            {errorMessage && (
              <p className="text-red-500 text-center font-medium py-2">{errorMessage}</p>
            )}
          </div>

          {/* Fixed Footer */}
          <div className="p-6 border-t border-[var(--border-default)] flex gap-3 flex-shrink-0">
            <button
              onClick={onClose}
              className="flex-1 py-4 border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] rounded-2xl font-medium transition-all"
            >
              Cancel
            </button>

            <button
              onClick={handleDownload}
              disabled={studentsToDownload.length === 0 || !admitCard || !currentExam || !principal}
              className="flex-1 py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-bright)] text-white font-semibold rounded-2xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <Download size={20} />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Progress Modal */}
      <DownloadProgressModal
        isOpen={isProgressOpen}
        progress={progress}
        onClose={() => {
          setIsProgressOpen(false);
          setProgress(0);
        }}
      />
    </>
  );
};

export default AdmitCardDownloadModal;
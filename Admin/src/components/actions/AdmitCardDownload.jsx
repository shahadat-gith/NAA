import React, { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Search, X, Download } from "lucide-react";

import { CLASS_OPTIONS, STREAM_OPTIONS } from "../../utils/academicOptions";
import { generateAdmitCards } from "../exams/generateAdmitCard";
import { pdf } from "@react-pdf/renderer";
import StudentList from "../exams/StudentList";
import { AppContext } from "../../context/AppContext";
import { Button } from "../common/Button";

const AdmitCardDownload = () => {
  const navigate = useNavigate();
  const { settings, students } = useContext(AppContext);

  const [medium, setMedium] = useState("");
  const [cls, setCls] = useState("");
  const [stream, setStream] = useState("");
  const [query, setQuery] = useState("");
  const [selectedStudentKey, setSelectedStudentKey] = useState("");
  const [loading, setLoading] = useState(false);

  const currentExam = settings?.exams?.[settings.exams?.length - 1] ?? null;
  const principal =
    settings?.authorities?.find((a) => a.role?.toLowerCase() === "principal") ??
    null;

  const availableClasses = useMemo(() => {
    return medium ? CLASS_OPTIONS[medium] || [] : [];
  }, [medium]);

  const classStudents = useMemo(() => {
    if (!medium || !cls) return [];
    return (students || []).filter((s) => {
      if (s.medium !== medium) return false;
      if (s.class !== cls) return false;
      if ((cls === "11" || cls === "12") && stream && s.stream !== stream)
        return false;
      return true;
    });
  }, [students, medium, cls, stream]);

  const searchedStudents = useMemo(() => {
    if (!query.trim()) return [];
    const term = query.toLowerCase();
    return (students || []).filter(
      (s) =>
        s.name?.toLowerCase().includes(term) ||
        s.registrationNo?.toLowerCase().includes(term),
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
          (s) => (s._id || s.registrationNo) === selectedStudentKey,
        );
        if (picked) studentsToDownload = [picked];
      } else {
        errorMessage = "Multiple students found. Please select one.";
      }
    }
  } else {
    if (!medium) errorMessage = "Please select Medium";
    else if (!cls) errorMessage = "Please select Class";
    else if ((cls === "11" || cls === "12") && !stream)
      errorMessage = "Please select Stream";
    else if (classStudents.length === 0)
      errorMessage = "No students found in this category";
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
    setLoading(true);
    try {
      const blob = await pdf(
        generateAdmitCards({
          students: studentsToDownload,
          admitCard,
          examDetails: currentExam,
          principal,
        }),
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download =
        studentsToDownload.length === 1
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
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setMedium("");
    setCls("");
    setStream("");
    setQuery("");
    setSelectedStudentKey("");
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold text-[var(--text-primary)]">
            Download Admit Cards
          </h1>

         
          <button
            onClick={resetAndClose}
            className="p-3 rounded-2xl border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Filters */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                Medium
              </label>
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
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                  Class
                </label>
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
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(cls === "11" || cls === "12") && (
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                  Stream
                </label>
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
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
                Quick Search
              </label>
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                  size={18}
                />
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

           {/* Download Button */}
          <div className="mt-8">
            <Button
              onClick={handleDownload}
              disabled={
                studentsToDownload.length === 0 ||
                !admitCard ||
                !currentExam ||
                !principal
              }
              variant="success"
              className="w-full"
              loading={loading}
            >
              {loading ? "downloading" : "Download"}
            </Button>
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
          <p className="text-red-500 text-center font-medium py-4">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdmitCardDownload;

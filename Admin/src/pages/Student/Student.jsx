import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Search, Plus, ArrowUp, FileText, FileSpreadsheet, X } from "lucide-react";

import StudentTable from "../../components/student/StudentTable";
import StudentModal from "../../components/student/StudentModal";
import PromoteStudentsModal from "../../components/student/PromoteStudentsModal";
import { sortStudents } from "../../utils/utility";
import { CLASS_OPTIONS } from "../../utils/academicOptions";
import { exportStudentListPDF } from "./exportStudent";
import exportStudentsToExcel from "./exportToExcel";

import { AdminContext } from "../../context/AdminContext";
import Loader from "../../components/common/Loader";

const Student = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredStudents, setFilteredStudents] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [mediumFilter, setMediumFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [streamFilter, setStreamFilter] = useState("");

  const [studentModal, setStudentModal] = useState(false);
  const [promoteModalOpen, setPromoteModalOpen] = useState(false);

  /* ================= FETCH STUDENTS ================= */
  const fetchStudents = async () => {
    if (!adminToken) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/student/list`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      if (data.success) {
        setStudents(data.students || []);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  /* ================= FILTER LOGIC ================= */
  useEffect(() => {
    let filtered = [...students];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name?.toLowerCase().includes(term) ||
          s.registrationNo?.toLowerCase().includes(term)
      );
    }

    if (mediumFilter) {
      filtered = filtered.filter((s) => s.medium === mediumFilter);
    }

    if (classFilter) {
      filtered = filtered.filter((s) => s.class === classFilter);
    }

    if (
      streamFilter &&
      mediumFilter === "assamese" &&
      ["11", "12"].includes(classFilter)
    ) {
      filtered = filtered.filter((s) => s.stream === streamFilter);
    }

    setFilteredStudents(sortStudents(filtered));
  }, [searchTerm, mediumFilter, classFilter, streamFilter, students]);

  const clearFilters = () => {
    setSearchTerm("");
    setMediumFilter("");
    setClassFilter("");
    setStreamFilter("");
  };

  const exportPdf = () => {
    exportStudentListPDF(filteredStudents, classFilter, mediumFilter, streamFilter);
  };

  const exportExcel = () => {
    exportStudentsToExcel(filteredStudents, classFilter, mediumFilter, streamFilter);
  };

  if (loading) {
    return <Loader text="Loading students..." />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Students</h1>
            <p className="text-[var(--text-secondary)] mt-1">Manage all student records</p>
          </div>

          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            <button
              onClick={() => setStudentModal(true)}
              className="flex items-center gap-2 px-5 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-bright)] text-white rounded-2xl font-semibold transition-all"
            >
             
              Add 
            </button>

            <button
              onClick={() => setPromoteModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 border border-[var(--border-default)] bg-[var(--text-muted)] hover:bg-[var(--bg-surface-2)] rounded-2xl font-semibold transition-all"
            >
              
              Promote
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-6 mb-6">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={20} />
            <input
              type="text"
              placeholder="Search by student name or registration number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none text-base"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Medium Filter */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Medium</label>
              <select
                value={mediumFilter}
                onChange={(e) => {
                  setMediumFilter(e.target.value);
                  setClassFilter("");
                  setStreamFilter("");
                }}
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
              >
                <option value="">All Mediums</option>
                <option value="english">English</option>
                <option value="assamese">Assamese</option>
              </select>
            </div>

            {/* Class Filter */}
            {mediumFilter && (
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Class</label>
                <select
                  value={classFilter}
                  onChange={(e) => {
                    setClassFilter(e.target.value);
                    setStreamFilter("");
                  }}
                  className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                >
                  <option value="">All Classes</option>
                  {CLASS_OPTIONS[mediumFilter]?.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Stream Filter */}
            {mediumFilter === "assamese" && ["11", "12"].includes(classFilter) && (
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Stream</label>
                <select
                  value={streamFilter}
                  onChange={(e) => setStreamFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                >
                  <option value="">All Streams</option>
                  <option value="science">Science</option>
                  <option value="arts">Arts</option>
                </select>
              </div>
            )}

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                disabled={!searchTerm && !mediumFilter && !classFilter && !streamFilter}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] rounded-2xl font-medium transition-all disabled:opacity-50"
              >
                <X size={18} />
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Count & Export Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <p className="text-[var(--text-secondary)]">
            Showing <span className="font-semibold text-[var(--text-primary)]">{filteredStudents.length}</span> students
          </p>

          <div className="flex gap-3">
            <button
              onClick={exportPdf}
              disabled={!mediumFilter}
              className="flex items-center gap-2 px-5 py-3 border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] rounded-2xl font-medium transition-all disabled:opacity-60"
            >
              <FileText size={18} />
              Export PDF
            </button>

            <button
              onClick={exportExcel}
              disabled={!mediumFilter || !classFilter}
              className="flex items-center gap-2 px-5 py-3 border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] rounded-2xl font-medium transition-all disabled:opacity-60"
            >
              <FileSpreadsheet size={18} />
              Export Excel
            </button>
          </div>
        </div>

        {/* Student Table */}
        <StudentTable
          filteredStudents={filteredStudents}
          selectedStudent={null} // You can manage selection if needed
          setSelectedStudent={() => {}}
        />

        {/* Modals */}
        <StudentModal
          isOpen={studentModal}
          onClose={() => setStudentModal(false)}
          onSuccess={fetchStudents}
        />

        <PromoteStudentsModal
          isOpen={promoteModalOpen}
          onClose={() => setPromoteModalOpen(false)}
          onSuccess={fetchStudents}
        />
      </div>
    </div>
  );
};

export default Student;
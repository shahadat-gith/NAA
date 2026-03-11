import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import StudentTable from "./StudentTable/StudentTable";
import StudentModal from "./Modals/StudentModal";
import PromoteStudentsModal from "./Modals/PromoteStudentsModal";
import { sortStudents } from "../../utils/utility";
import { CLASS_OPTIONS } from "../../utils/academicOptions";
import { exportStudentListPDF } from "./exportStudent";
import exportStudentsToExcel from "./exportToExcel";
import "./Student.css";
import { AdminContext } from "../../context/AdminContext";
import Loader from "../../components/Loader/Loader";

const Student = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

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
      const response = await axios.get(`${backendUrl}/api/student/list`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });


      if (response.data.success) {
        setStudents(response.data.students || []);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD ON MOUNT ================= */
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

  /* ================= CLEAR FILTERS ================= */
  const clearFilters = () => {
    setSearchTerm("");
    setMediumFilter("");
    setClassFilter("");
    setStreamFilter("");
    setSelectedStudent(null);
    setFilteredStudents(sortStudents(students));
  };

  /* ===== EXPORT PDF ===== */
  const exportPdf = () => {
    exportStudentListPDF(filteredStudents, classFilter, mediumFilter, streamFilter);
  };

  const exportexcel = () => {
    // pass filters explicitly so filename is accurate
    exportStudentsToExcel(filteredStudents, classFilter, mediumFilter, streamFilter);
  };

  if (loading) {
    return <Loader text="Loading students..." />;
  }

  return (
    <div className="admin-student-list-container">
      <h2>Student List</h2>

      {/* ===== ACTION BUTTONS ===== */}
      <div className="add-student-action">
        <button
          className="naa-btn naa-btn-single"
          onClick={() => setStudentModal(true)}
        >
          Add +
        </button>

        <button
          className="naa-btn naa-btn-promote"
          onClick={() => setPromoteModalOpen(true)}
        >
          Promote
        </button>

        {/* export filtered list */}
        <div className="naa-export-wrapper">
          <button
            className={`naa-btn naa-btn-export ${!mediumFilter ? "naa-btn-disabled" : ""
              }`}
            onClick={exportPdf}
            disabled={!mediumFilter}
          >
            {mediumFilter ? "Export PDF" : "Select Medium to Export"}
          </button>
          
          <button
            className={`naa-btn naa-btn-export ${!mediumFilter || !classFilter ? "naa-btn-disabled" : ""
              }`}
            onClick={exportexcel}
            disabled={!mediumFilter || !classFilter}
          >
            {mediumFilter && classFilter ? "Export Excel" : "Select class and Medium to Export"}
          </button>
        </div>
      </div>

      {/* ===== SEARCH ===== */}
      <div className="fs-search-wrapper">
        <input
          type="text"
          className="fs-search-input"
          placeholder="Search by student name or Registration Number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ===== FILTERS ===== */}
      <div className="fs-filters-row">
        {/* Medium */}
        <div className="fs-filter-group">
          <label>Medium</label>
          <select
            value={mediumFilter}
            onChange={(e) => {
              setMediumFilter(e.target.value);
              setClassFilter("");
              setStreamFilter("");
            }}
          >
            <option value="">All Mediums</option>
            <option value="english">English</option>
            <option value="assamese">Assamese</option>
          </select>
        </div>

        {/* Class */}
        {mediumFilter && (
          <div className="fs-filter-group">
            <label>Class</label>
            <select
              value={classFilter}
              onChange={(e) => {
                setClassFilter(e.target.value);
                setStreamFilter("");
              }}
            >
              <option value="">All Classes</option>
              {CLASS_OPTIONS[mediumFilter].map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Stream */}
        {mediumFilter === "assamese" &&
          ["11", "12"].includes(classFilter) && (
            <div className="fs-filter-group">
              <label>Stream</label>
              <select
                value={streamFilter}
                onChange={(e) => setStreamFilter(e.target.value)}
              >
                <option value="">All Streams</option>
                <option value="science">Science</option>
                <option value="arts">Arts</option>
              </select>
            </div>
          )}

        <div className="fs-filter-group">
          <button
            className="fs-btn fs-clear-btn"
            onClick={clearFilters}
            disabled={
              !searchTerm && !mediumFilter && !classFilter && !streamFilter
            }
          >
            ✕ Clear Filters
          </button>
        </div>
      </div>

      {/* ===== COUNT ===== */}
      {filteredStudents.length > 0 && (
        <div className="fs-results-count">
          Showing <strong>{filteredStudents.length}</strong> student
          {filteredStudents.length !== 1 ? "s" : ""}
        </div>
      )}

      {/* ===== TABLE ===== */}
      <StudentTable
        filteredStudents={filteredStudents}
        selectedStudent={selectedStudent}
        setSelectedStudent={setSelectedStudent}
      />

      <StudentModal
        isOpen={studentModal}
        onClose={() => {
          setStudentModal(false);
        }}
        onSuccess={fetchStudents}
      />

      <PromoteStudentsModal
        isOpen={promoteModalOpen}
        onClose={() => setPromoteModalOpen(false)}
        onSuccess={fetchStudents}
      />
    </div>
  );
};

export default Student;

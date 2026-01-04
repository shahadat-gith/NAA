import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

import { AdminContext } from "../../context/AdminContext";
import StudentTable from "./StudentTable/StudentTable";
import StudentModal from "./StudentModal/StudentModal";
import SingleStudentAddModal from "./StudentModal/SingleStudentAddModal";
import PromoteStudentsModal from "./StudentModal/PromoteStudentsModal";

import { formatClassName} from "../../utils/utility";
import { CLASS_OPTIONS } from "../../utils/academicOptions";
import { generateIdCards } from "../../utils/generateIdCards";
import { exportToExcel } from "../../utils/exportToExcel";

import "./Student.css";
import Loader from "../../components/Loader/Loader";

const Student = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  /* ================= STATE ================= */
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [mediumFilter, setMediumFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [streamFilter, setStreamFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [singleStudentModal, setSingleStudentModal] = useState(false);
  const [promoteModalOpen, setPromoteModalOpen] = useState(false);

  /* ================= FETCH STUDENTS ================= */
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/student/list`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      const list = res.data?.students || [];
      setStudents(list);
      setFilteredStudents(list);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (backendUrl && adminToken) fetchStudents();
  }, [backendUrl, adminToken]);

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

    setFilteredStudents(filtered);
  }, [searchTerm, mediumFilter, classFilter, streamFilter, students]);

  /* ================= CLEAR FILTERS ================= */
  const clearFilters = () => {
    setSearchTerm("");
    setMediumFilter("");
    setClassFilter("");
    setStreamFilter("");
    setSelectedStudent(null);
    setFilteredStudents(students);
  };

  if (loading) return <Loader text="Loading students..." />;

  return (
    <div className="admin-student-list-container">
      <h2>Student List</h2>

      {/* ===== ACTION BUTTONS ===== */}
      <div className="add-student-action">
        <button
          className="naa-btn naa-btn-mass"
          onClick={() => setStudentModalOpen(true)}
        >
          Mass Addition
        </button>

        <button
          className="naa-btn naa-btn-single"
          onClick={() => setSingleStudentModal(true)}
        >
          Single Addition
        </button>

        <button
          className="naa-btn naa-btn-promote"
          onClick={() => setPromoteModalOpen(true)}
        >
          Promote Students
        </button>
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
                  {formatClassName(cls)}
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
      </div>

      {/* ===== FILTER ACTIONS ===== */}
      <div className="fs-actions">
        <button
          className="fs-btn fs-export-btn"
          onClick={() => exportToExcel(filteredStudents)}
          disabled={!filteredStudents.length}
        >
          📊 Export to Excel
        </button>

        <button
          className="fs-btn fs-clear-btn"
          onClick={clearFilters}
          disabled={
            !searchTerm && !mediumFilter && !classFilter && !streamFilter
          }
        >
          ✕ Clear Filters
        </button>

        <button
          className="fs-btn fs-idcard-btn"
          onClick={() =>
            generateIdCards(filteredStudents, mediumFilter, classFilter)
          }
          disabled={!mediumFilter || !classFilter || !filteredStudents.length}
        >
          🪪 Generate ID Cards
        </button>
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

      {/* ===== MODALS ===== */}
      <StudentModal
        isOpen={studentModalOpen}
        onClose={() => {
          setStudentModalOpen(false);
          fetchStudents();
        }}
      />

      <SingleStudentAddModal
        isOpen={singleStudentModal}
        onClose={() => {
          setSingleStudentModal(false);
          fetchStudents();
        }}
      />

      <PromoteStudentsModal
        isOpen={promoteModalOpen}
        onClose={() => setPromoteModalOpen(false)}
        fetchStudents={fetchStudents}
      />
    </div>
  );
};

export default Student;

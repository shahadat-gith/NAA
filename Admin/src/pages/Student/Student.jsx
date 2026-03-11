import React, { useState, useEffect, useContext } from "react";
import StudentTable from "./StudentTable/StudentTable";
import MassStudentModal from "./StudentModal/MassStudentModal";
import SingleStudentModal from "./StudentModal/SingleStudentModal";
import PromoteStudentsModal from "./StudentModal/PromoteStudentsModal";
import { formatClassName, sortStudents } from "../../utils/utility";
import { CLASS_OPTIONS } from "../../utils/academicOptions";

// pdf export helper
import { exportStudentListPDF } from "./exportStudent";
import exportStudentsToExcel from "./StudentTable/exportToExcel";

import "./Student.css";
import Loader from "../../components/Loader/Loader";
import { AppContext } from "../../context/AppContext";

const Student = () => {

  const { students, fetchInitialData, loading } = useContext(AppContext)

  const [filteredStudents, setFilteredStudents] = useState(students || []);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [mediumFilter, setMediumFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [streamFilter, setStreamFilter] = useState("");

  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [singleStudentModal, setSingleStudentModal] = useState(false);
  const [promoteModalOpen, setPromoteModalOpen] = useState(false);

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

      {/* ===== MODALS ===== */}
      <MassStudentModal
        isOpen={studentModalOpen}
        onClose={() => {
          setStudentModalOpen(false);
        }}

        fetchInitialData={fetchInitialData}
      />

      <SingleStudentModal
        isOpen={singleStudentModal}
        onClose={() => {
          setSingleStudentModal(false);

        }}
        fetchInitialData={fetchInitialData}
      />

      <PromoteStudentsModal
        isOpen={promoteModalOpen}
        onClose={() => setPromoteModalOpen(false)}
        fetchInitialData={fetchInitialData}
      />
    </div>
  );
};

export default Student;

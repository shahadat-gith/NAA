import React from "react";
import * as XLSX from "xlsx";
import { toast } from "react-hot-toast";
import generateBulkAdmitCards from "../../../utils/generateBulkAdmitCards";
import "./FilterSection.css";
import { formatClassName } from "../../../utils/formatclass";

const classOptions = {
  english: ["nursery", "kg", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  assamese: [
    "ankur",
    "mukul",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ],
};

const FilterSection = ({
  searchTerm,
  setSearchTerm,
  mediumFilter,
  setMediumFilter,
  classFilter,
  setClassFilter,
  streamFilter,
  setStreamFilter,
  filteredStudents = [],
  fetchStudents,
  setSelectedStudent,
  admitCardConfig,
}) => {
  /* ================= Export ================= */
  const exportToExcel = () => {
    if (!filteredStudents.length) {
      toast.error("No students to export");
      return;
    }

    const exportData = filteredStudents.map((student) => ({
      Name: student.name,
      Class: formatClassName(student.class),
      Medium: student.medium,
      Stream: student.stream || "-",
      "Registration No": student.registrationNo || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    const date = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `Student_List_${date}.xlsx`);
  };

  /* ================= Admit Cards ================= */
  const handleDownloadAllAdmitCards = () => {
    if (!admitCardConfig) {
      toast.error("Admit card configuration not available");
      return;
    }

    if (!filteredStudents.length) {
      toast.error("No students found");
      return;
    }

    generateBulkAdmitCards(filteredStudents, admitCardConfig);
  };

  /* ================= Clear Filters ================= */
  const handleClearFilters = () => {
    setSearchTerm("");
    setMediumFilter("");
    setClassFilter("");
    setStreamFilter("");
    setSelectedStudent(null);
    fetchStudents();
  };

  const onMediumChange = (e) => {
    setMediumFilter(e.target.value);
    setClassFilter("");
    setStreamFilter("");
  };

  const onClassChange = (e) => {
    setClassFilter(e.target.value);
    setStreamFilter("");
  };

  const areFiltersApplied =
    searchTerm || mediumFilter || classFilter || streamFilter;

  return (
    <div className="fs-container">
      {/* Search */}
      <div className="fs-search-wrapper">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by student name..."
          className="fs-search-input"
        />
      </div>

      {/* Filters Row */}
      <div className="fs-filters-row">
        {/* Medium */}
        <div className="fs-filter-group">
          <label>Medium</label>
          <select value={mediumFilter} onChange={onMediumChange}>
            <option value="">All Mediums</option>
            <option value="english">English</option>
            <option value="assamese">Assamese</option>
          </select>
        </div>

        {/* Class */}
        {mediumFilter && (
          <div className="fs-filter-group">
            <label>Class</label>
            <select value={classFilter} onChange={onClassChange}>
              <option value="">All Classes</option>
              {classOptions[mediumFilter].map((cls) => (
                <option key={cls} value={cls}>
                  {formatClassName(cls)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Stream */}
        {mediumFilter === "assamese" && ["11", "12"].includes(classFilter) && (
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

      {/* Action Buttons */}
      <div className="fs-actions">
        <button
          onClick={exportToExcel}
          className="fs-btn fs-export-btn"
          disabled={!filteredStudents.length}
        >
          <span className="fs-btn-icon">📊</span>
          Export to Excel
        </button>

        <button
          onClick={handleDownloadAllAdmitCards}
          className="fs-btn fs-admit-btn"
          disabled={!filteredStudents.length}
        >
          <span className="fs-btn-icon">🎫</span>
          Download Admit Cards
        </button>

        <button
          onClick={handleClearFilters}
          className="fs-btn fs-clear-btn"
          disabled={!areFiltersApplied}
        >
          <span className="fs-btn-icon">✕</span>
          Clear Filters
        </button>
      </div>

      {/* Results Count */}
      {filteredStudents.length > 0 && (
        <div className="fs-results-count">
          Showing <strong>{filteredStudents.length}</strong> student{filteredStudents.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default FilterSection;
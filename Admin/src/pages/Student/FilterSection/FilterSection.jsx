import React from "react";
import * as XLSX from "xlsx";
import { toast } from "react-hot-toast";
import generateBulkAdmitCards from '../utils/generateBulkAdmitCards'
import { addMonthlyFee } from "../api";
import './FilterSection.css'
import { formatClassName } from "../utils/formatclass";

const classOptions = {
  english: ["nursery", "kg", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  assamese: ["ankur", "mukul", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
};

const getCurrentMonthString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
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
  backendUrl,
  adminToken,
}) => {
  const exportToExcel = () => {
    if (!filteredStudents.length) {
      toast.error("No students to export.");
      return;
    }
    const exportData = filteredStudents.map((student) => ({
      Name: student.name,
      Class: formatClassName(student.class),
      Medium: student.medium,
      Stream: student.stream || "-",
      "Monthly Due": `₹${student.dues?.monthlyDue?.amount || 0}`,
      "Hostel Due": `₹${student.dues?.hostelDue?.amount || 0}`,
      "Registration No": student.registrationNo || "-",
      Hostel: student.hostel || "No",
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    const date = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `Student_List_${date}.xlsx`);
  };

  const handleAddMonthlyFee = async () => {
    if (!mediumFilter || !classFilter) {
      toast.error("Please select both medium and class to add monthly fee.");
      return;
    }
    if (mediumFilter === "assamese" && ["11", "12"].includes(classFilter) && !streamFilter) {
      toast.error("Please select a stream (Science or Arts) for Assamese Class 11 or 12.");
      return;
    }
    try {
      await addMonthlyFee(backendUrl, adminToken, classFilter, mediumFilter, streamFilter, fetchStudents);
      setSelectedStudent(null);
    } catch (error) {
       console.log(error)
    }
  };

  const handleDownloadAllAdmitCards = () => {
    if (!admitCardConfig) {
      toast.error("Admit card configuration is not available.");
      return;
    }
    if (!filteredStudents.length) {
      toast.error("No students found in the filtered list.");
      return;
    }
    generateBulkAdmitCards(filteredStudents, admitCardConfig);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setMediumFilter("");
    setClassFilter("");
    setStreamFilter("");
    setSelectedStudent(null);
    fetchStudents(backendUrl, adminToken, filteredStudents, setFilteredStudents);
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

  // Check if fees have already been added for the current month
  const currentMonth = getCurrentMonthString();
  const isFeeAddedThisMonth = filteredStudents.some(
    (student) =>
      student.class === classFilter &&
      student.medium === mediumFilter &&
      (mediumFilter !== "assamese" || !["11", "12"].includes(classFilter) || student.stream === streamFilter) &&
      student.dues?.monthlyDue?.lastUpdatedMonth === currentMonth
  );

  // Check if any filters are applied
  const areFiltersApplied = searchTerm || mediumFilter || classFilter || streamFilter;

  return (
    <div className="filter-section">
      <div className="search-section">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by student name..."
          className="search-input"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="mediumFilter">Medium:</label>
        <select id="mediumFilter" value={mediumFilter} onChange={onMediumChange}>
          <option value="">All Mediums</option>
          <option value="english">English</option>
          <option value="assamese">Assamese</option>
        </select>
      </div>

      {mediumFilter && (
        <div className="filter-group">
          <label htmlFor="classFilter">Class:</label>
          <select id="classFilter" value={classFilter} onChange={onClassChange}>
            <option value="">All Classes</option>
            {classOptions[mediumFilter].map((cls) => (
              <option key={cls} value={cls}>
                {formatClassName(cls)}
              </option>
            ))}
          </select>
        </div>
      )}

      {mediumFilter === "assamese" && ["11", "12"].includes(classFilter) && (
        <div className="filter-group">
          <label htmlFor="streamFilter">Stream:</label>
          <select id="streamFilter" value={streamFilter} onChange={(e) => setStreamFilter(e.target.value)}>
            <option value="">Select Stream</option>
            <option value="science">Science</option>
            <option value="arts">Arts</option>
          </select>
        </div>
      )}

      <div className="student-filter-btns">
        <button
          onClick={handleAddMonthlyFee}
          className="add-fee-btn"
          disabled={
            !classFilter ||
            !mediumFilter ||
            (mediumFilter === "assamese" && ["11", "12"].includes(classFilter) && !streamFilter) ||
            filteredStudents.length === 0 ||
            isFeeAddedThisMonth
          }
        >
          {isFeeAddedThisMonth ? (
            "Already updated monthly fee for this month"
          ) : (
            `Add Monthly Fee to ${formatClassName(classFilter)}${streamFilter ? ` (${streamFilter})` : ""}`
          )}
        </button>

        <button onClick={exportToExcel} className="export-btn" disabled={filteredStudents.length === 0}>
          Export to Excel
        </button>
        <button
          onClick={handleDownloadAllAdmitCards}
          className="download-all-admit-btn"
          disabled={filteredStudents.length === 0}
        >
          Download All Admit Cards
        </button>
        <button
          onClick={handleClearFilters}
          className="clear-filter-btn"
          disabled={!areFiltersApplied}
          aria-label="Clear all filters"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default FilterSection;
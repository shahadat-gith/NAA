import React from "react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import generateBulkAdmitCards from "./utils/generateBulkAdmitCards";
import { addMonthlyFee } from "./api";

const classOptions = {
  english: ["nursery", "kg", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  assamese: ["ankur", "mukul", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
};

const formatClassName = (cls) => {
  if (/^\d+$/.test(cls)) return `Class ${cls}`;
  return cls.charAt(0).toUpperCase() + cls.slice(1);
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
  filteredStudents,
  fetchStudents,
  setSelectedStudent,
  admitCardConfig,
  backendUrl,
  adminToken
}) => {
  const exportToExcel = () => {
    const exportData = filteredStudents.map((student) => ({
      "First Name": student.firstName,
      "Last Name": student.lastName,
      Class: formatClassName(student.class),
      Medium: student.medium,
      Stream: student.stream || "-",
      "Due Amount": `₹${student.dueAmount || 0}`,
      "Hostel Due Amount": `₹${student.hostelDueAmount || 0}`,
      "Roll No": student.rollNo || "-",
      "Father Name": student.fatherName,
      "Mother Name": student.motherName,
      Status: student.admissionStatus || "Pending",
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    const date = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `Student_List_${date}.xlsx`);
  };

  const handleAddMonthlyFee = async () => {
    if (!classFilter || !mediumFilter) {
      toast.warn("Please select both medium and class to add monthly fee");
      return;
    }
    if (mediumFilter === "assamese" && ["11", "12"].includes(classFilter) && !streamFilter) {
      toast.warn("Please select a stream (Science or Arts) for Assamese Class 11 or 12");
      return;
    }
    await addMonthlyFee(backendUrl,adminToken, classFilter, mediumFilter, streamFilter, fetchStudents);
    setSelectedStudent(null);
  };

  const handleDownloadAllAdmitCards = () => {
    if (!admitCardConfig) {
      toast.warn("Admit card configuration is not available.");
      return;
    }
    if (filteredStudents.length === 0) {
      toast.warn("No students found in the filtered list.");
      return;
    }
    generateBulkAdmitCards(filteredStudents, admitCardConfig);
  };

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
        <select
          id="mediumFilter"
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
      <div className="filter-group">
        {mediumFilter && (
          <>
            <label htmlFor="classFilter">Class:</label>
            <select
              id="classFilter"
              value={classFilter}
              onChange={(e) => {
                setClassFilter(e.target.value);
                setStreamFilter("");
              }}
            >
              <option value="">All Classes</option>
              {classOptions[mediumFilter].map((cls) => (
                <option key={cls} value={cls}>
                  {formatClassName(cls)}
                </option>
              ))}
            </select>
          </>
        )}
      </div>
      <div className="filter-group">
        {mediumFilter === "assamese" && ["11", "12"].includes(classFilter) && (
          <>
            <label htmlFor="streamFilter">Stream:</label>
            <select id="streamFilter" value={streamFilter} onChange={(e) => setStreamFilter(e.target.value)}>
              <option value="">Select Stream</option>
              <option value="science">Science</option>
              <option value="arts">Arts</option>
            </select>
          </>
        )}
      </div>
      <div className="student-filter-btns">
        {classFilter && mediumFilter && (
          <button onClick={handleAddMonthlyFee} className="add-fee-btn" disabled={filteredStudents.length === 0}>
            Add Monthly Fee to {formatClassName(classFilter)}
            {streamFilter ? ` (${streamFilter})` : ""}
          </button>
        )}
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
      </div>
    </div>
  );
};

export default FilterSection;
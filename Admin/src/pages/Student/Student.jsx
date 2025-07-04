import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import FilterSection from "./FilterSection/FilterSection";
import StudentTable from "./StudentTable/StudentTable";
import { fetchStudents, fetchAdmitCardConfig } from "./api";
import "./Student.css";
import StudentModal from './StudentModal/StudentModal'

const Student = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [mediumFilter, setMediumFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [streamFilter, setStreamFilter] = useState("");
  const [admitCardConfig, setAdmitCardConfig] = useState(null);
  const [formOpen, setFormOpen] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      await fetchStudents(backendUrl, adminToken, setStudents, setFilteredStudents);
      await fetchAdmitCardConfig(backendUrl, adminToken, setAdmitCardConfig);
    };
    loadData();
  }, [backendUrl, adminToken]);

  useEffect(() => {
    let filtered = students;
    if (searchTerm) {
      filtered = filtered.filter((student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (mediumFilter) filtered = filtered.filter((student) => student.medium === mediumFilter);
    if (classFilter) filtered = filtered.filter((student) => student.class === classFilter);
    if (streamFilter && mediumFilter === "assamese" && ["11", "12"].includes(classFilter)) {
      filtered = filtered.filter((student) => student.stream === streamFilter);
    }
    setFilteredStudents(filtered);
    setCurrentPage(1);
  }, [mediumFilter, classFilter, streamFilter, searchTerm, students]);

  const handleOpenModal = () => {
    setFormOpen(true);
  };

  const handleCloseModal = () => {
    setFormOpen(false);
    // Refresh student data after modal closes
    fetchStudents(backendUrl, adminToken, setStudents, setFilteredStudents);
  };


  return (
    <div className="admin-student-list-container">
      <h2>Student List</h2>
      <div className="add-student-action">
        <button
          className="naa-add-student-btn"
          onClick={handleOpenModal}
          aria-label="Add new student or students"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M12 5v14m-7-7h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Add New Student(s)
        </button>
      </div>
      <FilterSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        mediumFilter={mediumFilter}
        setMediumFilter={setMediumFilter}
        classFilter={classFilter}
        setClassFilter={setClassFilter}
        streamFilter={streamFilter}
        setStreamFilter={setStreamFilter}
        filteredStudents={filteredStudents}
        fetchStudents={() => fetchStudents(backendUrl, adminToken, setStudents, setFilteredStudents)}
        setSelectedStudent={setSelectedStudent}
        admitCardConfig={admitCardConfig}
        backendUrl={backendUrl}
        adminToken={adminToken}
      />
      <StudentTable
        filteredStudents={filteredStudents}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        selectedStudent={selectedStudent}
        setSelectedStudent={setSelectedStudent}
      />

      <StudentModal isOpen={formOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default Student;
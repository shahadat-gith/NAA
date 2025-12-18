import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import FilterSection from "./FilterSection/FilterSection";
import StudentTable from "./StudentTable/StudentTable";
import StudentModal from "./StudentModal/StudentModal";
import ResultModal from "./ResultModal/ResultModal";
import "./Student.css";

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

  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/student/list`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setStudents(res.data);
      setFilteredStudents(res.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    if (backendUrl && adminToken) fetchStudents();
  }, [backendUrl, adminToken]);

  useEffect(() => {
    let filtered = [...students];
    if (searchTerm) filtered = filtered.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    if (mediumFilter) filtered = filtered.filter(s => s.medium === mediumFilter);
    if (classFilter) filtered = filtered.filter(s => s.class === classFilter);
    if (streamFilter && mediumFilter === "assamese" && ["11", "12"].includes(classFilter)) {
      filtered = filtered.filter(s => s.stream === streamFilter);
    }
    setFilteredStudents(filtered);
    setCurrentPage(1);
  }, [searchTerm, mediumFilter, classFilter, streamFilter, students]);

  return (
    <div className="admin-student-list-container">
      <h2>Student List</h2>
      <div className="add-student-action">
        <button className="naa-add-student-btn primary" onClick={() => setStudentModalOpen(true)}>Add New Student(s)</button>
        <button className="naa-add-student-btn secondary" onClick={() => setResultModalOpen(true)}>Upload Result(s)</button>
      </div>

      <FilterSection
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        mediumFilter={mediumFilter} setMediumFilter={setMediumFilter}
        classFilter={classFilter} setClassFilter={setClassFilter}
        streamFilter={streamFilter} setStreamFilter={setStreamFilter}
        filteredStudents={filteredStudents} fetchStudents={fetchStudents}
        setSelectedStudent={setSelectedStudent} backendUrl={backendUrl} adminToken={adminToken}
      />

      <StudentTable
        filteredStudents={filteredStudents}
        currentPage={currentPage} setCurrentPage={setCurrentPage}
        selectedStudent={selectedStudent} setSelectedStudent={setSelectedStudent}
      />

      <StudentModal isOpen={studentModalOpen} onClose={() => { setStudentModalOpen(false); fetchStudents(); }} />
      <ResultModal isOpen={resultModalOpen} onClose={() => setResultModalOpen(false)} />
    </div>
  );
};

export default Student;
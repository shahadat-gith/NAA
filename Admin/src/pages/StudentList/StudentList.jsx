import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import FilterSection from "./FilterSection";
import StudentTable from "./StudentTable";
import StudentDetails from "./StudentDetails";
import { fetchStudents, fetchAdmitCardConfig } from "./api";
import "./StudentList.css";

const StudentList = () => {
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

  return (
    <div className="admin-student-list-container">
      <h2>Admin - Student List</h2>
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
      {selectedStudent && (
        <StudentDetails
          student={selectedStudent}
          setSelectedStudent={setSelectedStudent}
          fetchStudents={() => fetchStudents(backendUrl, adminToken, setStudents, setFilteredStudents)}
          admitCardConfig={admitCardConfig}
          backendUrl={backendUrl}
          adminToken={adminToken}
        />
      )}
    </div>
  );
};

export default StudentList;
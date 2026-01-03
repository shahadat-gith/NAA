import React from "react";
import { useNavigate } from "react-router-dom";
import { formatClassName } from "../../../utils/utility"; 
import "./StudentTable.css";

const StudentTable = ({
  filteredStudents = [],
  selectedStudent,
  setSelectedStudent,
}) => {
  const navigate = useNavigate();

  // 🔐 HARD SAFETY: ensure array
  const studentsArray = Array.isArray(filteredStudents)
    ? filteredStudents
    : [];

  const handleStudentClick = (student) => {
    setSelectedStudent(
      selectedStudent?._id === student._id ? null : student
    );
  };

  return (
    <div className="student-table">
      {studentsArray.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Name</th>
              <th>Class</th>
              <th>Medium</th>
              <th>Stream</th>
              <th>Registration No</th>
            </tr>
          </thead>
          <tbody>
            {studentsArray.map((student, index) => (
              <tr
                key={student._id}
                onClick={() => {
                  handleStudentClick(student);
                  navigate(`/students/${student._id}`);
                }}
              >
                <td>{index + 1}</td>
                <td>{student.name}</td>
                <td>{formatClassName(student.class)}</td>
                <td>{student.medium}</td>
                <td>{student.stream || "-"}</td>
                <td>{student.registrationNo || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};


export default StudentTable;

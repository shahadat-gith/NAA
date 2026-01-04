import React from "react";
import { useNavigate } from "react-router-dom";
import {
  formatClassName,
  capitalizeFirst,
  capitalizeWords,
} from "../../../utils/utility";
import "./StudentTable.css";

const StudentTable = ({
  filteredStudents = [],
  selectedStudent,
  setSelectedStudent,
}) => {
  const navigate = useNavigate();

  const studentsArray = Array.isArray(filteredStudents)
    ? filteredStudents
    : [];

  // ✅ SORT BY REGISTRATION NUMBER
  const sortedStudents = [...studentsArray].sort((a, b) => {
    if (!a.registrationNo) return 1;
    if (!b.registrationNo) return -1;
    return a.registrationNo.localeCompare(b.registrationNo);
  });

  const handleStudentClick = (student) => {
    setSelectedStudent(
      selectedStudent?._id === student._id ? null : student
    );
  };

  return (
    <div className="student-table">
      {sortedStudents.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Registration No</th>
              <th>Name</th>
              <th>Class</th>
              <th>Medium</th>
              <th>Stream</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((student, index) => (
              <tr
                key={student._id}
                onClick={() => {
                  handleStudentClick(student);
                  navigate(`/students/${student._id}`);
                }}
              >
                <td>{index + 1}</td>
                   {/* REG NO */}
                <td>{student.registrationNo || "-"}</td>

                {/* NAME */}
                <td>{capitalizeWords(student.name)}</td>

                {/* CLASS */}
                <td>{formatClassName(student.class)}</td>

                {/* MEDIUM */}
                <td>{capitalizeFirst(student.medium)}</td>

                {/* STREAM */}
                <td>
                  {student.stream
                    ? capitalizeFirst(student.stream)
                    : "-"}
                </td>

             
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentTable;

import React from "react";
import { useNavigate } from 'react-router-dom'
import { formatClassName } from "../utils/formatclass";
import './StudentTable.css'

const StudentTable = ({ filteredStudents = [], selectedStudent, setSelectedStudent }) => {
  const handleStudentClick = (student) => {
    setSelectedStudent(selectedStudent?._id === student._id ? null : student);
  };
  const navigate = useNavigate()

  return (
    <div className="student-table">
      {filteredStudents.length === 0 ? (
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
              <th>Monthly Due</th>
              <th>Hostel Due</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr
                key={student._id}
                onClick={() => {
                  handleStudentClick(student);
                  navigate(`/students/${student._id}`, { state: { student } });
                }}
                className={selectedStudent?._id === student._id ? "selected" : ""}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleStudentClick(student);
                    navigate(`/students/${student._id}`, { state: { student } });
                  }
                }}
              >
                <td>{index + 1}</td>
                <td>{student.name}</td>
                <td>{formatClassName(student.class)}</td>
                <td>{student.medium}</td>
                <td>{student.stream || "-"}</td>
                <td>{student.registrationNo || "-"}</td>
                <td>₹{student.dues?.monthlyDue?.amount || 0}</td>
                <td>₹{student.dues?.hostelDue?.amount || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentTable;
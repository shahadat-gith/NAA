import React from "react";

const studentsPerPage = 5;

const formatClassName = (cls) => {
  if (/^\d+$/.test(cls)) return `Class ${cls}`;
  return cls.charAt(0).toUpperCase() + cls.slice(1);
};

const StudentTable = ({ filteredStudents, currentPage, setCurrentPage, selectedStudent, setSelectedStudent }) => {
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(selectedStudent && selectedStudent._id === student._id ? null : student);
  };

  return (
    <div className="student-table">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Class</th>
            <th>Medium</th>
            <th>Stream</th>
            <th>Roll No</th>
            <th>Due Amount</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.map((student) => (
            <tr
              key={student._id}
              onClick={() => handleStudentClick(student)}
              className={selectedStudent?._id === student._id ? "selected" : ""}
            >
              <td>
                {student.firstName} {student.lastName}
              </td>
              <td>{formatClassName(student.class)}</td>
              <td>{student.medium}</td>
              <td>{student.stream || "-"}</td>
              <td>{student.rollNo || "-"}</td>
              <td>₹{student.dueAmount || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default StudentTable;
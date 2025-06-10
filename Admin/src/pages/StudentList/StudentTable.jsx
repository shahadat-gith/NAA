import React from "react";

const studentsPerPage = 5;

const formatClassName = (cls) => {
  if (/^\d+$/.test(cls)) return `Class ${cls}`;
  return cls.charAt(0).toUpperCase() + cls.slice(1);
};

const StudentTable = ({ filteredStudents = [], currentPage, setCurrentPage, selectedStudent, setSelectedStudent }) => {
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage) || 1;
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(selectedStudent?._id === student._id ? null : student);
  };

  return (
    <div className="student-table">
      {filteredStudents.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
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
              {currentStudents.map((student) => (
                <tr
                  key={student._id}
                  onClick={() => handleStudentClick(student)}
                  className={selectedStudent?._id === student._id ? "selected" : ""}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleStudentClick(student);
                    }
                  }}
                >
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

          <div className="pagination">
            <button onClick={handlePrevPage} disabled={currentPage === 1} aria-label="Previous page">
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages} aria-label="Next page">
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentTable;
import React from "react";

const StudentList = ({ students, onStudentSelect, selectedStudent }) => {
  const formatClassName = (cls) => {
    if (/^\d+$/.test(cls)) return `Class ${cls}`;
    return cls.charAt(0).toUpperCase() + cls.slice(1);
  };

  if (students.length === 0) return null;

  return (
    <div className="student-list">
      <h4>Search Results</h4>
      <ul>
        {students.map((student) => (
          <li key={student._id} className={selectedStudent?._id === student._id ? "selected" : ""}>
            <div className="student-info-row">
              <span>{`${student.firstName} ${student.lastName}`}</span>
              <span>Class: {formatClassName(student.class)}</span>
              <span>Medium: {student.medium}</span>
              {student.stream && <span>Stream: {student.stream}</span>}
            </div>
            <button onClick={() => onStudentSelect(student)} className="view-details-btn">
              View Details
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentList;
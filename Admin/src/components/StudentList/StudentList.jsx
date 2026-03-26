import React from "react";
import "./StudentList.css";

const StudentList = ({
  students = [],
  selectable = false,
  selectedKey = "",
  onSelect,
}) => {
  if (students.length === 0) {
    return (
      <div className="student-list-container">
        <div className="student-list-empty">
          <svg
            className="student-list-empty-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <p className="student-list-empty-text">No students to show</p>
          <p className="student-list-empty-subtext">
            {selectable
              ? "Search for a student by name or registration number"
              : "Select medium and class to view students"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="student-list-container">
      <div className="student-list-header">
        <span className="student-list-count">
          {students.length} {students.length === 1 ? "Student" : "Students"}
        </span>
        {selectable && (
          <span className="student-list-hint">Click to select</span>
        )}
      </div>

      <div className="student-list-scroll">
        <table className="student-list-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Reg No</th>
              <th>Class</th>
              <th>Medium</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => {
              const key = s._id || s.registrationNo;
              const isSelected = selectable && selectedKey === key;
              const rowClass = [
                "student-list-row",
                selectable && "student-list-row--selectable",
                isSelected && "student-list-row--selected",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <tr
                  key={key}
                  className={rowClass}
                  onClick={
                    selectable ? () => onSelect?.(key) : undefined
                  }
                  onKeyDown={
                    selectable ? (event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            onSelect?.(key);
                          }
                        }
                      : undefined
                  }
                  role={selectable ? "button" : undefined}
                  tabIndex={selectable ? 0 : undefined}
                  aria-pressed={selectable ? isSelected : undefined}
                >
                  <td>
                    <div className="student-list-name-cell">
                      <span className="student-list-name-text">
                        {s.name || "Unknown"}
                      </span>
                      {isSelected && (
                        <span className="student-list-selected-badge">
                          <i className="fa-solid fa-check" />
                        </span>
                      )}
                    </div>
                  </td>
                  <td>{s.registrationNo || "N/A"}</td>
                  <td>{s.class.toUpperCase()}</td>
                  <td>{s.medium.toUpperCase()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;
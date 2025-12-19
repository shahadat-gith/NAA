import React from "react";
import { Link } from "react-router-dom";
import "./SearchResults.css";

const SearchResults = ({students = [],type,loading,isSearched = false,}) => {


  return (
    <div className="search-results-container">
      {loading ? (
        <div className="sr-spinner-container">
          <div className="sr-spinner"></div>
          <span className="sr-spinner-text">
            Searching your details...
          </span>
        </div>
      ) : !Array.isArray(students) ? (
        <p className="search-results-message error">
          Invalid student data.
        </p>
      ) : !isSearched ? (
        <p className="search-results-message">
          Please search your name.
        </p>
      ) : students.length === 0 ? (
        <p className="search-results-message">
          No students found.
        </p>
      ) : (
        <table
          className="search-results-table"
          aria-label="Student search results"
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Class</th>
              <th>Medium</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.name || "N/A"}</td>
                <td>{student.class || "N/A"}</td>
                <td>{student.medium || "N/A"}</td>
                <td>
                  <Link
                    to={`/portal/student/${student._id}`}
                    state={{ type }}
                    className="search-results-action-button"
                    aria-label={`View details of ${student.name || "student"}`}
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SearchResults;

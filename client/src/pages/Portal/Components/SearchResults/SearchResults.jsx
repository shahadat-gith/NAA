import React from "react";
import { Link } from "react-router-dom";
import "./SearchResults.css";

const SearchResults = ({ students = [], type, loading, isSearched = false }) => {
  const filteredStudents = type === "hostel" ? students.filter(student => student.hostel === "Yes") : students;

  const getDueAmount = (student, feeType) => {
    if (!student) return 0;
    if (feeType === "monthly") return Number(student.dues?.monthlyDue?.amount || 0);
    if (feeType === "hostel") return Number(student.dues?.hostelDue?.amount || 0);
    if (feeType === "admission") {
      return (
        Number(student.admissionfees?.admissionFee || 0) +
        Number(student.admissionfees?.hostelAdmissionFee || 0)
      );
    }
    return 0;
  };

  return (
    <div className="search-results-container">
      {loading ? (
        <div className="sr-spinner-container">
          <div className="sr-spinner"></div>
          <span className="sr-spinner-text">Searching your details...</span>
        </div>
      ) : !Array.isArray(students) ? (
        <p className="search-results-message error">Invalid student data.</p>
      ) : !isSearched ? (
        <p className="search-results-message">Please perform a search to view results.</p>
      ) : filteredStudents.length === 0 ? (
        <p className="search-results-message">No students found.</p>
      ) : (
        <table className="search-results-table" aria-label="Student search results">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Class</th>
              <th scope="col">Medium</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => {
              const monthlyDue = getDueAmount(student, "monthly");
              const canDownloadAdmitCard = type === "admit-card" && monthlyDue === 0;

              return (
                <tr key={student._id}>
                  <td>{student.name || "N/A"}</td>
                  <td>{student.class || "N/A"}</td>
                  <td>{student.medium || "N/A"}</td>
                  <td>
                    {type === "admit-card" ? (
                      <Link
                        to={`/portal/services/${type}/${student._id}`}
                        className="search-results-action-button"
                        aria-label={
                          canDownloadAdmitCard
                            ? `View admit card details for ${student.name || "student"}`
                            : `Clear monthly dues to view admit card details for ${student.name || "student"}`
                        }
                      >
                        {canDownloadAdmitCard ? "View Details" : "Clear Monthly Dues"}
                      </Link>
                    ) : type === "id-card" ? (
                      <Link
                        to={`/portal/services/${type}/${student._id}`}
                        className="search-results-action-button"
                        aria-label={`View ID card details for ${student.name || "student"}`}
                      >
                        View Details
                      </Link>
                    ) : (
                      <Link
                        to={`/portal/fee/${type}/${student._id}`}
                        className="search-results-action-button"
                        aria-label={`View fee details for ${student.name || "student"}`}
                      >
                        View Details
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SearchResults;
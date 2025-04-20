import React from "react";
import Loader from "../../../components/Loader/Loader"; // Import updated Loader
import { searchStudents } from "./api";

const SearchSection = ({
  searchTerm,
  setSearchTerm,
  students,
  setStudents,
  setSelectedStudent,
  setPaymentAmount,
  setError,
  loading,
  setLoading,
  error,
  currentConfig,
  backendUrl,
}) => {
  const handleSearch = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await searchStudents(backendUrl, searchTerm, currentConfig.searchUrl);
      if (data.length === 0) {
        setError("Student not found");
        setStudents([]);
      } else {
        setStudents(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setPaymentAmount(student[currentConfig.dueField] > 0 ? student[currentConfig.dueField] : "");
  };

  const formatClassName = (cls) => {
    if (/^\d+$/.test(cls)) return `Class ${cls}`;
    return cls.charAt(0).toUpperCase() + cls.slice(1);
  };

  return (
    <>
      <div className="search-container">
        <div className="search-input-group">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by your name, Aadhar No or Phone No"
            disabled={loading}
            className="search-input"
          />
          <button onClick={handleSearch} disabled={loading} className="search-button">
            Search
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>

      {loading && <Loader text={`Searching ${searchTerm.charAt(0).toUpperCase() + (searchTerm.slice(1) )} ...`} />}

      {students.length > 0 && (
        <div className="search-results">
          <h2>Search Results</h2>
          <ul className="student-list">
            {students.map((student) => (
              <li
                key={student._id}
                className={student._id === students[0]._id ? "student-item selected" : "student-item"}
              >
                <div className="student-item-content">
                  {currentConfig.searchResultFields.map((field) => (
                    <span key={field} className="student-field">
                      {field === currentConfig.dueField ? (
                        <span className="due-amount">Due: ₹{student[field]}</span>
                      ) : field === "firstName" ? (
                        <span>{`${student.firstName} ${student.lastName}`}</span>
                      ) : field === "lastName" ? null : field === "class" ? (
                        <span>Class: {formatClassName(student[field])}</span>
                      ) : (
                        <span>{field.charAt(0).toUpperCase() + field.slice(1)}: {student[field]}</span>
                      )}
                    </span>
                  ))}
                </div>
                <button onClick={() => handleStudentSelect(student)} className="view-details-btn">
                  View Details
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default SearchSection;
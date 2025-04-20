import React from "react";
import { toast } from "react-toastify";
import StudentList from "./StudentList";
import StudentDetails from "./StudentDetails";
import { searchStudents } from "./api"; // Assuming same API as FeePayment
import Loader from "../../../components/Loader/Loader"; // Import Loader

const AdmitCardTab = ({
  searchTerm,
  setSearchTerm,
  students,
  setStudents,
  selectedStudent,
  setSelectedStudent,
  admitCardConfig,
  loading,
  setLoading,
  error,
  setError,
  backendUrl,
}) => {
  const handleSearch = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await searchStudents(backendUrl, searchTerm, "/api/students/search");
      if (data.length === 0) {
        setError("Student not found");
        setStudents([]);
      } else {
        setStudents(data);
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
  };

  return (
    <div className="admit-card-section">
      <h3>Download Admit Card</h3>
      <div className="search-container">
        <div className="search-input-group">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, Aadhar No, or Phone No"
            disabled={loading}
            className="search-input"
          />
          <button onClick={handleSearch} disabled={loading} className="search-button">
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>

      {loading && <Loader text ={`Searching ${searchTerm.charAt(0).toUpperCase() + (searchTerm.slice(1) )}...`} />}
      
      <StudentList 
        students={students} 
        onStudentSelect={handleStudentSelect} 
        selectedStudent={selectedStudent} 
      />
      {selectedStudent && (
        <StudentDetails 
          student={selectedStudent} 
          admitCardConfig={admitCardConfig} 
        />
      )}
    </div>
  );
};

export default AdmitCardTab;
import React from "react";
import { toast } from "react-toastify";
import axios from "axios";
import ResultCard from "../ResultCard/ResultCard";
import { generateResultPDF } from "../utils/generateResultPDF";
import Loader from "../../../components/Loader/Loader"; // Import Loader

const examOptions = ["Half Yearly Examination", "Annual Examination", "Unit Test 1", "Unit Test 2", "Unit Test 3", "Unit Test 4"];
const sessionOptions = ["2023-2024", "2024-2025", "2025-2026", "2026-2027", "2027-2028"];

const ResultCheckTab = ({
  registrationNo,
  setRegistrationNo,
  examName,
  setExamName,
  academicSession,
  setAcademicSession,
  resultData,
  setResultData,
  loading,
  setLoading,
  error,
  setError,
  backendUrl,
}) => {
  const handleResultCheck = async (e) => {
    e.preventDefault();
    if (!registrationNo || !examName || !academicSession) {
      toast.error("Registration number, exam name, and academic session are required.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${backendUrl}/api/result/get-single-result`, {
        registrationNo,
        examName,
        academicSession,
      });
      if (response.data.success) {
        setResultData(response.data.data);
        setRegistrationNo("");
        setExamName("");
        setAcademicSession("");
        setError(null);
      } else {
        toast.error(response.data.message);
        setError(response.data.message);
        setResultData(null);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred while fetching the result.";
      toast.error(errorMessage);
      setError(errorMessage);
      setResultData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (resultData) {
      generateResultPDF(resultData);
    } else {
      toast.error("No result data available to download.");
    }
  };

  return (
    <div className="result-check-section">
      <h3>Check Your Results</h3>
      <form className="result-check-form" onSubmit={handleResultCheck}>
        <div className="form-group">
          <label>Registration Number:</label>
          <input
            type="text"
            value={registrationNo}
            onChange={(e) => setRegistrationNo(e.target.value)}
            placeholder="Enter Registration No (e.g., NAA-2512001A)"
            className="result-input"
            disabled={loading}
            required
          />
        </div>
        <select
          value={examName}
          onChange={(e) => setExamName(e.target.value)}
          className="result-input"
          disabled={loading}
          required
        >
          <option value="">Select Exam</option>
          {examOptions.map((exam) => (
            <option key={exam} value={exam}>{exam}</option>
          ))}
        </select>
        <select
          value={academicSession}
          onChange={(e) => setAcademicSession(e.target.value)}
          className="result-input"
          disabled={loading}
          required
        >
          <option value="">Select Session</option>
          {sessionOptions.map((session) => (
            <option key={session} value={session}>{session}</option>
          ))}
        </select>
        <button type="submit" className="premium-button" disabled={loading}>
          {loading ? "Checking..." : "Check Result"}
        </button>
      </form>

      {loading && <Loader text ="Checking your result..." />}
      {error && <div className="error-message">{error}</div>}
      {!loading && !error && resultData === null && (
        <p className="no-result">{registrationNo === "" ? "Please enter registration number to check your result." : ""}</p>
      )}
      {resultData && <ResultCard resultData={resultData} handleDownloadPDF={handleDownloadPDF} />}
    </div>
  );
};

export default ResultCheckTab;
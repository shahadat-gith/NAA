import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResultDownload.css';
import { generateResultPDF } from '../Utils/generateResultPDF'; 

const ResultDownload = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const resultData = state?.resultData;


  // Handle download (PDF format)
  const handleDownload = () => {
    generateResultPDF(resultData);
  };

  return (
    <div className="report-card-page">
      <div className="report-header">
        <h2>Student Report Card</h2>
        <h3>Nashib Ali Academy</h3>
        <p>{resultData.result.examName} - {resultData.result.academicSession}</p>
      </div>

      <div className="student-info">
        <div className="info-item">
          <span className="info-label">Student Name</span>
          <span className="info-value">{resultData.name}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Registration No</span>
          <span className="info-value">{resultData.registrationNo}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Father's Name</span>
          <span className="info-value">{resultData.father}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Mother's Name</span>
          <span className="info-value">{resultData.mother}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Class</span>
          <span className="info-value">{resultData.class}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Medium</span>
          <span className="info-value">{resultData.medium}</span>
        </div>
        {resultData.stream && (
          <div className="info-item">
            <span className="info-label">Stream</span>
            <span className="info-value">{resultData.stream}</span>
          </div>
        )}
        <div className="info-item">
          <span className="info-label">Roll No</span>
          <span className="info-value">{resultData.result.rollNo || "N/A"}</span>
        </div>
      </div>

      <div className="marks-section">
        <div className="marks-header">
          <h3 className="marks-title">Performance Summary</h3>
          <div className='performance-res'>
            <span className="total-marks">
              Total: {resultData.result.totalMarks}/{resultData.result.maxTotalMarks}
            </span>
            <span className="percentage-badge">
              {resultData.result.percentage}%
            </span>
          </div>
        </div>

        <table className="subjects-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Marks Obtained</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(resultData.result.marks).map(([subject, mark]) => (
              <tr key={subject}>
                <td>{subject}</td>
                <td>
                  <span className="mark-value">{mark}</span>
                  <span className="mark-total">/{resultData.result.maxMarksPerSubject}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="actions-container">
        <button className="res-download-btn" onClick={handleDownload}>
          Download Result
        </button>
      </div>
    </div>
  );
};

export default ResultDownload;
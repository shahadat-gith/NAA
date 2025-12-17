import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResultDownload.css';
import { generateResultPDF } from '../Utils/generateResultPDF'; 

const ResultDownload = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  // Based on your backend: response.data.data is passed as state.resultData
  const resultData = state?.resultData;

  // Safety check: if someone navigates here directly without data
  if (!resultData) {
    return (
      <div className="report-card-page">
        <p>No result data found. Please go back and try again.</p>
        <button onClick={() => navigate('/result')}>Back to Portal</button>
      </div>
    );
  }

  // Extracting student details from the nested object we added in the controller
  const student = resultData.studentDetails || {};

  // Helper to calculate total marks from the marks array
  const totalMarksObtained = resultData.marks.reduce((acc, curr) => acc + curr.marksObtained, 0);
  const maxPossibleMarks = resultData.marks.length * resultData.maxMarksPerSubject;
  const percentage = ((totalMarksObtained / maxPossibleMarks) * 100).toFixed(2);

  const handleDownload = () => {
    generateResultPDF(resultData);
  };

  return (
    <div className="report-card-page">
      <div className="report-header">
        <h2>Student Report Card</h2>
        <h3>Nashib Ali Academy</h3>
        {/* resultData now contains academicSession and examName directly */}
        <p>{resultData.examName} - {resultData.academicSession}</p>
      </div>

      <div className="student-info">
        <div className="info-item">
          <span className="info-label">Student Name</span>
          <span className="info-value">{student.name || "N/A"}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Registration No</span>
          <span className="info-value">{resultData.registrationNo}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Father's Name</span>
          <span className="info-value">{student.fatherName || "N/A"}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Mother's Name</span>
          <span className="info-value">{student.motherName || "N/A"}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Class</span>
          <span className="info-value">{resultData.class}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Medium</span>
          <span className="info-value" style={{textTransform: 'capitalize'}}>{student.medium || "N/A"}</span>
        </div>
        {resultData.stream && (
          <div className="info-item">
            <span className="info-label">Stream</span>
            <span className="info-value" style={{textTransform: 'capitalize'}}>{resultData.stream}</span>
          </div>
        )}
        <div className="info-item">
          <span className="info-label">Rank in Class</span>
          <span className="info-value">{resultData.rank || "N/A"}</span>
        </div>
      </div>

      <div className="marks-section">
        <div className="marks-header">
          <h3 className="marks-title">Performance Summary</h3>
          <div className='performance-res'>
            <span className="total-marks">
              Total: {totalMarksObtained}/{maxPossibleMarks}
            </span>
            <span className="percentage-badge">
              {percentage}%
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
            {/* marks is now an array: [{subject: 'Math', marksObtained: 90}, ...] */}
            {resultData.marks.map((m, index) => (
              <tr key={index}>
                <td>{m.subject.toUpperCase()}</td>
                <td>
                  <span className="mark-value">{m.marksObtained}</span>
                  <span className="mark-total">/{resultData.maxMarksPerSubject}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="actions-container">
        <button className="res-download-btn" onClick={handleDownload} style={{cursor:"pointer"}}>
          Download PDF Report
        </button>
      </div>
    </div>
  );
};

export default ResultDownload;
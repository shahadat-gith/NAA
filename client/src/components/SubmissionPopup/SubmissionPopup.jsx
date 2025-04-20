import React from "react";
import { useNavigate } from "react-router-dom";
import "./SubmissionPopup.css";

const SubmissionPopup = ({ isOpen, onClose, message, isSuccess }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className={`popup-icon ${isSuccess ? "success" : "error"}`}>
          {isSuccess ? (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="80" 
              height="80" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#00a86b" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          ) : (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="80" 
              height="80" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#d63031" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          )}
        </div>
        <h2 className={isSuccess ? "success-text" : "error-text"}>
          {isSuccess ? "Success" : "Error"}
        </h2>
        <p className="popup-message">{message}</p>
        <div className="popup-actions">
          {isSuccess && (
            <button
              className="popup-login-btn"
              onClick={() => navigate("/login/student")}
            >
              Go to Login
            </button>
          )}
          <button 
            className={`popup-close-btn ${isSuccess ? "success" : "error"}`} 
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionPopup;
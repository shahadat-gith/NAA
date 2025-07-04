import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ progress, onCancel }) => {
  return (
    <div className="progress-modal-overlay">
      <div className="progress-modal">
        <div className="progress-bar-container" role="progressbar" aria-label={`Upload progress: ${progress}%`} aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
          <div className="progress-bar" style={{ width: `${progress}%` }}>
            <span className="progress-text">{Math.round(progress)}%</span>
          </div>
        </div>
        <div className="progress-message">Uploading image...</div>
        <button className="progress-cancel-btn" onClick={onCancel}>
          Cancel Upload
        </button>
      </div>
    </div>
  );
};

export default ProgressBar;
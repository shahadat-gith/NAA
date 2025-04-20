// Loader.jsx
import React from 'react';
import './Loader.css';

const Loader = ({ 
  message = "Loading...", 
  size = "medium", // small, medium, large
  color = "#007bff" // Default blue color
}) => {
  return (
    <div className="loader-overlay">
      <div className={`loader-container ${size}`}>
        <div 
          className="loader-spinner"
          style={{
            borderTopColor: color,
            borderRightColor: 'transparent',
            borderBottomColor: 'transparent',
            borderLeftColor: 'transparent'
          }}
        ></div>
        {message && (
          <p className="loader-message">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Loader;
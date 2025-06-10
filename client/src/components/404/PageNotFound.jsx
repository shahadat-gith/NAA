import React from 'react';
import './PageNotFound.css';

const PageNotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="error-code">404</div>
        <div className="clock-icon">
          <i className="fas fa-clock"></i>
        </div>
        
        <h1 className="not-found-title">Page Not Found</h1>
        
        <p className="not-found-message">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
        
        <a href="/" className="back-home-button">
          <i className="fas fa-arrow-left"></i> Back to Home
        </a>
      </div>
    </div>
  );
}

export default PageNotFound;
import React from 'react';
import './IdCard.css';

const IdCard = () => {
  return (
    <div className="notice-container">
      <div className="notice-icon">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      
      <h2 className="notice-title">Service Temporarily Unavailable</h2>
      
      <p className="notice-message" aria-live="polite">
        The ID generation service is currently unavailable.
      </p>
      
      <p className="notice-instruction">
        Please check back later. We apologize for any inconvenience.
      </p>
      
      <div className="notice-support">
        <span>Need immediate assistance?</span>
        <a href="/contact" className="notice-link">Contact Support</a>
      </div>
    </div>
  );
};

export default IdCard;
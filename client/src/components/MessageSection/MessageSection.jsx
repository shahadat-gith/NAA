// MessageSection.jsx
import React from 'react';
import './MessageSection.css';
import principalPhoto from '/principal_NAA.jpg'; // Replace with actual photo path
import directorPhoto from '/director_NAA.jpg'; // Replace with actual photo path

const MessageSection = () => {
  return (
    <section className="message-section">
      <div className="message-container">
        {/* Principal's Message */}
        <div className="message-item principal-message">
          <div className="message-photo">
            <img src={principalPhoto} alt="Principal" />
          </div>
          <div className="message-content">
            <h2 className="message-title">Message from Our Principal</h2>
            <h3 className="message-subtitle">Abdul Mozid Mondal</h3>
            <p className="message-text">
              Welcome to Nashib Ali Academy, where we are dedicated to fostering a nurturing environment that encourages academic excellence and personal growth. Our goal is to empower each student to reach their full potential through innovative teaching methods and a supportive community.
            </p>
          </div>
        </div>

        {/* Director's Message */}
        <div className="message-item director-message">
          <div className="message-photo">
            <img src={directorPhoto} alt="Director" />
          </div>
          <div className="message-content">
            <h2 className="message-title">Message from Our Director</h2>
            <h3 className="message-subtitle">Sultan Mahmud</h3>
            <p className="message-text">
              At Nashib Ali Academy, we believe in shaping future leaders by providing a well-rounded education that emphasizes critical thinking, creativity, and ethical values. We are committed to supporting our students in their journey to success.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MessageSection;
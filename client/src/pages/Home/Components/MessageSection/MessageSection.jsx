// MessageSection.jsx
import React, { useContext } from "react";
import "./MessageSection.css";
import { AppContext } from "../../../../context/AppContext";

const MessageSection = () => {
  const { authorities } = useContext(AppContext);

  const principal = authorities.find(
    (a) => a.role?.toLowerCase() === "principal"
  );

  const director = authorities.find(
    (a) =>
      a.role?.toLowerCase() === "managing director" ||
      a.role?.toLowerCase() === "director"
  );

  return (
    <section className="message-section">
      <div className="message-container">
        {/* Principal's Message */}
        {principal && (
          <div className="message-item principal-message">
            <div className="message-photo">
              <img src={principal.image?.url} alt="Principal" />
            </div>
            <div className="message-content">
              <h2 className="message-title">Message from Our Principal</h2>
              <h3 className="message-subtitle">{principal.name}</h3>
              <p className="message-text">
                Welcome to Nashib Ali Academy, where we are dedicated to fostering
                a nurturing environment that encourages academic excellence and
                personal growth. Our goal is to empower each student to reach
                their full potential through innovative teaching methods and a
                supportive community.
              </p>
            </div>
          </div>
        )}

        {/* Director's Message */}
        {director && (
          <div className="message-item director-message">
            <div className="message-photo">
              <img src={director.image?.url} alt="Director"/>
            </div>
            <div className="message-content">
              <h2 className="message-title">Message from Our Director</h2>
              <h3 className="message-subtitle">{director.name}</h3>
              <p className="message-text">
                At Nashib Ali Academy, we believe in shaping future leaders by
                providing a well-rounded education that emphasizes critical
                thinking, creativity, and ethical values. We are committed to
                supporting our students in their journey to success.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MessageSection;

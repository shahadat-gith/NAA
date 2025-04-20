// WhyChooseUs.jsx
import React from 'react';
import './WhyChooseUs.css';
import { Link } from 'react-router-dom';

const WhyChooseUs = () => {
  const reasonsData = [
    {
      title: 'Quality Education',
      icon: 'fas fa-book-open', // Font Awesome class for Quality Education
      description: 'Our curriculum is designed to provide top-tier education with modern teaching methods.',
    },
    {
      title: 'Experienced Staff',
      icon: 'fas fa-chalkboard-teacher', // Font Awesome class for Experienced Staff
      description: 'Highly qualified and dedicated teachers committed to your child’s success.',
    },
    {
      title: 'Safe Environment',
      icon: 'fas fa-shield-alt', // Font Awesome class for Safe Environment
      description: 'A secure and nurturing campus ensuring your child’s well-being.',
    },
    {
      title: 'Holistic Development',
      icon: 'fas fa-child', // Font Awesome class for Holistic Development
      description: 'Focus on academic, emotional, and social growth for well-rounded individuals.',
    },
  ];

  return (
    <section className="why-choose-us-section">
      <div className="why-choose-us-container">
        <h2 className="why-choose-us-title">
          Why Our Schools are the Right Fit for Your Child?
          <span className="title-underline"></span>
        </h2>
        <div className="reasons-list">
          {reasonsData.map((item, index) => (
            <div
              key={index}
              className={`reason-item ${index % 2 === 0 ? 'left-align' : 'right-align'}`}
              style={{ '--index': index }} // For animation delay
            >
              <div className="reason-icon">
                <i className={item.icon}></i>
              </div>
              <div className="reason-content">
                <h3 className="reason-title">{item.title}</h3>
                <p className="reason-description">{item.description}</p>
              </div>
              {index < reasonsData.length - 1 && <div className="connecting-line"></div>}
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default WhyChooseUs;
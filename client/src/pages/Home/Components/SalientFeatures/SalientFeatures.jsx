import React from 'react';
import { Link } from 'react-router-dom';
import './SalientFeatures.css';

const SalientFeatures = () => {
  const features = [
    {
      title: 'English Medium Education',
      icon: 'book',
      description: 'Comprehensive curriculum from Nursery to Class 10, fostering proficiency in English, Mathematics, General Science, and more through interactive and play-based learning.',
    },
    {
      title: 'Assamese Medium Education',
      icon: 'language',
      description: 'Culturally rich education from Ankur to Class 10, emphasizing Assamese language and literature alongside core subjects like Mathematics and Social Studies.',
    },
    {
      title: 'Higher Secondary Streams',
      icon: 'graduation-cap',
      description: 'Specialized Arts and Science streams for Classes 11–12, offering subjects like Physics, Chemistry, Biology, Political Science, and Advance Assamese, preparing students for university and beyond.',
    },
    {
      title: 'Separate Hostels for Girls and Boys',
      icon: 'building',
      description: 'Safe, comfortable, and supportive residential facilities with separate hostels for girls and boys, ensuring a conducive environment for learning and personal growth.',
    },
  ];

  return (
    <section className="salient-features-section">
      <div className="salient-features-container">
        <h2 className="salient-features-title">
          Salient Features
          <span className="naa-title-underline"></span>
        </h2>
        <div className="features-list">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`feature-item ${index % 2 === 0 ? 'left-align' : 'right-align'}`}
              style={{ '--index': index }}
            >
              <div className="feature-icon">
                <i className={`fas fa-${feature.icon}`}></i>
              </div>
              <div className="feature-content">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
              {index < features.length - 1 && <div className="connecting-line"></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SalientFeatures;
// Curriculum.jsx
import React from 'react';
import './Curriculum.css';
import { Link } from 'react-router-dom';
import kinderIcon from '/kinder.jpg'; 
import elementaryIcon from '/elementary.jpg';
import middleIcon from '/middle-school.webp';
import higherSecondaryIcon from '/higher-secondary.jpg';

const Curriculum = () => {
  const curriculumData = [
    {
      title: 'Kinder (3-5 Years)',
      icon: kinderIcon,
      description: 'Early learning foundation focusing on creativity, social skills, and basic literacy.',
      link: '/curriculum/kinder',
      background: 'rgba(173, 216, 230, 0.2)', // Light blue
    },
    {
      title: 'Elementary (Grades 1-5)',
      icon: elementaryIcon,
      description: 'Core subjects with interactive learning to build a strong academic foundation.',
      link: '/curriculum/elementary',
      background: 'rgba(255, 228, 196, 0.2)', // Light beige
    },
    {
      title: 'Middle School (Grades 6-10)',
      icon: middleIcon,
      description: 'Advanced studies with a focus on critical thinking and project-based learning.',
      link: '/curriculum/middle',
      background: 'rgba(221, 160, 221, 0.2)', // Light purple
    },
    {
      title: 'Higher Secondary (Grades 11-12)',
      icon: higherSecondaryIcon,
      description: 'Specialized subjects and career guidance for higher education preparation.',
      link: '/curriculum/higher-secondary',
      background: 'rgba(144, 238, 144, 0.2)', // Light green
    },
  ];

  return (
    <section className="curriculum-section">
      <h2 className="curriculum-title">
        Standard Curriculum
        <span className="title-underline"></span>
      </h2>
      <div className="curriculum-cards">
        {curriculumData.map((item, index) => (
          <div
            key={index}
            className="curriculum-card"
            style={{ background: item.background }}
          >
            <div className="card-icon">
              <img src={item.icon} alt={`${item.title} Icon`} />
            </div>
            <h3 className="curriculum-card-title">{item.title}</h3>
            <p className="card-description">{item.description}</p>
            <Link to={item.link} className="card-link">
              Read More
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Curriculum;
import React, { useState, useEffect } from 'react';
import './TestimonialsSection.css';
import { Link } from 'react-router-dom';
import testimonial1Photo from '/teacher1.jpg'; 
import testimonial2Photo from '/teacher2.jpg';
import testimonial3Photo from '/teacher3.jpg';

const TestimonialsSection = () => {
  const testimonialsData = [
    {
      name: 'Sarah Johnson',
      role: 'Parent',
      photo: testimonial1Photo,
      quote: 'Nashib Ali Academy has been a transformative experience for my child. The teachers are exceptional, and the environment fosters both academic and personal growth.',
    },
    {
      name: 'Michael Chen',
      role: 'Student',
      photo: testimonial2Photo,
      quote: 'I love the hands-on learning at Nashib Ali Academy! The science projects and extracurricular activities have helped me discover my passion for innovation.',
    },
    {
      name: 'Emily Davis',
      role: 'Alumni',
      photo: testimonial3Photo,
      quote: 'The foundation I received at Nashib Ali Academy prepared me for success in university. The support and guidance from the staff were unparalleled.',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatic testimonial switching
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonialsData.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <h2 className="testimonials-title">
          What Our Community Says
          <span className="title-underline"></span>
        </h2>
        <div className="testimonial-carousel">
          <div className="testimonial-item" key={currentIndex}>
            <div className="testimonial-photo">
              <img src={testimonialsData[currentIndex].photo} alt={testimonialsData[currentIndex].name} />
              <div className="quote-icon">
                <i className="fas fa-quote-left"></i>
              </div>
            </div>
            <div className="testimonial-content">
              <p className="testimonial-quote">"{testimonialsData[currentIndex].quote}"</p>
              <h3 className="testimonial-name">{testimonialsData[currentIndex].name}</h3>
              <p className="testimonial-role">{testimonialsData[currentIndex].role}</p>
            </div>
          </div>
        </div>
        <div className="cta-container">
          <Link to="/add-testimonial" className="cta-link">
            Add Your Testimonial
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

import React, { useContext, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { curriculumDetailsData } from './curriculumData';
import './CurriculumDetails.css';
import Banner from '../Banner/Banner';
import { curriculumImages } from '../../assets/images';

const CurriculumDetails = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'kinder'; 
 
  const details = curriculumDetailsData[type];

  // Map type to image; use 'higher' for 'higher-secondary'
  const imageKey = type === 'higher-secondary' ? 'higher' : type;
  const bannerImage = curriculumImages[imageKey];

  // Get all curriculum types for tabs
  const curriculumTypes = Object.keys(curriculumDetailsData);

  return (
    <>
      <Banner image={bannerImage} />
      <section className="curriculum-details-section">
        {details ? (
          <>
            <div className="curriculum-tabs">
              {curriculumTypes.map((curriculumType) => (
                <Link
                  key={curriculumType}
                  to={`/curriculum?type=${curriculumType}`}
                  className={`tab-item ${type === curriculumType ? 'active' : ''}`}
                >
                  {curriculumDetailsData[curriculumType].title.split(' ')[0]}
                </Link>
              ))}
            </div>
            <div className="curriculum-breadcrumb">
              <Link to="/curriculum" className="breadcrumb-link">
                <i className="fas fa-arrow-left"></i> Back to Curriculum
              </Link>
            </div>

            <div className="curriculum-details-container">
              <div className="curriculum-details-card overview-card" style={{ background: details.background }}>
                <h3><i className="fas fa-book"></i> Overview</h3>
                <p>{details.overview}</p>

                <div className="curriculum-schedule">
                  <h4><i className="fas fa-calendar-alt"></i> Schedule Information</h4>
                  <div className="schedule-details">
                    <div className="schedule-item">
                      <i className="fas fa-clock"></i>
                      <span>Hours: {details.schedule.dailyHours}</span>
                    </div>
                    <div className="schedule-item">
                      <i className="fas fa-calendar-alt"></i>
                      <span>Days: {details.schedule.daysPerWeek}</span>
                    </div>
                    <div className="schedule-item">
                      <i className="fas fa-book"></i>
                      <span>Terms: {details.schedule.termsPerYear} per year</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="curriculum-details-card" style={{ background: details.background }}>
                <h3><i className="fas fa-book"></i> Subjects</h3>
                <div className="curriculum-subjects">
                  {details.subjects.map((subject, index) => (
                    <div key={index} className="subject-item">
                      <div className="subject-icon">
                        <i className={`fas fa-${subject.icon}`}></i>
                      </div>
                      <div className="subject-content">
                        <h4>{subject.name}</h4>
                        <p>{subject.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="curriculum-details-card" style={{ background: details.background }}>
                <h3><i className="fas fa-chalkboard-teacher"></i> Teaching Methods</h3>
                <div className="teaching-methods">
                  {details.methods.map((method, index) => (
                    <div key={index} className="method-item">
                      <div className="method-icon">
                        <i className={`fas fa-${method.icon}`}></i>
                      </div>
                      <div className="method-content">
                        <h4>{method.name}</h4>
                        <p>{method.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="curriculum-details-card" style={{ background: details.background }}>
                <h3><i className="fas fa-star"></i> Program Features</h3>
                <div className="features-grid">
                  {details.features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <i className={`fas fa-${feature.icon}`}></i>
                      <span>{feature.name}</span>
                    </div>
                  ))}
                </div>

                <div className="testimonial-box">
                  <div className="testimonial-quote">
                    <i className="fas fa-star quote-icon"></i>
                    <p>"{details.testimonial.quote}"</p>
                    <p className="testimonial-author">— {details.testimonial.parent}</p>
                  </div>
                </div>
              </div>

              <div className="call-to-action">
                <h3>Ready to enroll your child?</h3>
                <p>Contact our admissions office to schedule a visit or learn more about our programs.</p>
                <Link to="/contact" className="cta-button">Contact Admissions</Link>
              </div>
            </div>
          </>
        ) : (
          <div className="curriculum-details-error">
            <div className="error-icon">
              <i className="fas fa-book"></i>
            </div>
            <h2>Curriculum Not Found</h2>
            <p className="error-message" aria-live="polite">
              We couldn't find the requested curriculum. Please select a valid program from our offerings.
            </p>
            <Link to="/curriculum" className="back-link">
              <i className="fas fa-arrow-left"></i> Return to Curriculum Page
            </Link>
          </div>
        )}
      </section>
    </>
  );
};

export default CurriculumDetails;
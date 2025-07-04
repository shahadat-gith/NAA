import React, { useContext, useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';
import Loader from '../../../components/Loader/Loader';
import './TeacherDetails.css';

const TeacherDetails = () => {
  const { teachers, backendUrl } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const teacherId = searchParams.get('id');
  const [isLoading, setIsLoading] = useState(true);
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    const foundTeacher = teachers.find((t) => t._id === teacherId);
    setTeacher(foundTeacher);
    setIsLoading(false);
  }, [teachers, teacherId]);

  if (isLoading) {
    return (
      <div className="teacher-details-page">
        <div className="container">
          <Loader text="Loading teacher..." />
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="teacher-details-page">
        <div className="container">
          <h2>Teacher Not Found</h2>
          <p>No teacher found with the provided ID.</p>
          <button className="back-btn" onClick={() => navigate('/staffs')}>
            Back to Staff Directory
          </button>
        </div>
      </div>
    );
  }

  // Format subjects for display
  const formatSubjects = (mappings) => {
    if (!mappings || mappings.length === 0) return 'N/A';
    return mappings.map((m) => m.subject).join(', ');
  };

  return (
    <div className="teacher-details-page">
      <div className="container">
        <div className="teacher-details">
          <button className="back-btn" onClick={() => navigate('/staffs')}>
            <i className="fas fa-arrow-left"></i> Back to Staff
          </button>

          <div className="details-header">
            <div className="details-header-content">
              <h2 className="details-name">{teacher.name}</h2>
              <p className="details-position">{formatSubjects(teacher.subjectClassMappings)}</p>
            </div>
          </div>

          <div className="details-body">
            <div className="details-image-container">
              <img
                src={teacher.image}
                alt={teacher.name}
                className="details-image"
              />
            </div>

            <div className="details-info">
              <div className="details-info-section">
                <h3 className="details-section-title">Professional Information</h3>
                <div className="details-info-grid">
                  <div className="details-info-item">
                    <i className="fas fa-graduation-cap"></i>
                    <div className="details-info-content">
                      <span className="details-info-label">Degree</span>
                      <span className="details-info-value">{teacher.degree}</span>
                    </div>
                  </div>
                  <div className="details-info-item">
                    <i className="fas fa-briefcase"></i>
                    <div className="details-info-content">
                      <span className="details-info-label">Experience</span>
                      <span className="details-info-value">{teacher.experience ? `${teacher.experience} years` : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="details-info-section">
                <h3 className="details-section-title">Contact Information</h3>
                <div className="details-contact-info">
                  <a href={`mailto:${teacher.email}`} className="details-contact-item">
                    <i className="fas fa-envelope"></i>
                    <span>{teacher.email}</span>
                  </a>
                  <a href={`tel:${teacher.contact}`} className="details-contact-item">
                    <i className="fas fa-phone"></i>
                    <span>{teacher.contact}</span>
                  </a>
                </div>
              </div>

              <div className="details-actions">
                <a href={`tel:${teacher.contact}`} className="details-action-btn call">
                  <i className="fas fa-phone"></i> Call Me
                </a>
                <a href={`https://wa.me/${teacher.contact}`} className="details-action-btn whatsapp">
                  <i className="fab fa-whatsapp"></i> WhatsApp Me
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetails;
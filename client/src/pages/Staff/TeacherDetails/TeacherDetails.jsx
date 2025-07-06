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
                <h3 className="details-section-title">Subjects & Classes</h3>
                <div className="details-contact-info">
                  {teacher.subjectClassMappings && teacher.subjectClassMappings.length > 0 && (
                    <p className="details-contact-item">
                      Teaches{" "}
                      {teacher.subjectClassMappings.map((item, index) => {
                        const formattedClasses = (() => {
                          const cls = item.classes;
                          if (cls.length === 1) return <strong>{cls[0]}</strong>;
                          if (cls.length === 2)
                            return (
                              <>
                                <strong>{cls[0]}</strong> and <strong>{cls[1]}</strong>
                              </>
                            );
                          return (
                            <>
                              {cls.slice(0, -1).map((c, i) => (
                                <span key={i}>
                                  <strong>{c}</strong>,{" "}
                                </span>
                              ))}
                              and <strong>{cls[cls.length - 1]}</strong>
                            </>
                          );
                        })();

                        const subjectText = (
                          <>
                            <strong>{item.subject}</strong> in {formattedClasses}
                          </>
                        );

                        const isLast = index === teacher.subjectClassMappings.length - 1;
                        const isSecondLast = index === teacher.subjectClassMappings.length - 2;

                        return (
                          <span key={index}>
                            {isLast && index !== 0
                              ? "and "
                              : ""}
                            {subjectText}
                            {isLast ? "." : ", "}
                          </span>
                        );
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetails;
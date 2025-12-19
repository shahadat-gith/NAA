import React, { useContext } from 'react';
import './TeachersSection.css';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

const TeachersSection = () => {
  const { teachers } = useContext(AppContext);

  // Sort teachers by experience (descending) and take top 4
  const topTeachers = [...teachers]
    .sort((a, b) => {
      const expA = parseInt(a.experience) || 0;
      const expB = parseInt(b.experience) || 0;
      return expB - expA;
    })
    .slice(0, 4);

  // Helper function to get primary subject from subjectClassMappings
  const getPrimarySubject = (subjectClassMappings) => {
    if (subjectClassMappings && subjectClassMappings.length > 0) {
      return subjectClassMappings[0].subject || 'Unknown Subject';
    }
    return 'Unknown Subject';
  };

  // Helper function to get a concise list of subjects
  const getSubjectsList = (subjectClassMappings) => {
    if (!subjectClassMappings || subjectClassMappings.length === 0) {
      return 'various subjects';
    }
    const subjects = subjectClassMappings.map(mapping => mapping.subject);
    return subjects.length > 2
      ? `${subjects.slice(0, 2).join(', ')} and more`
      : subjects.join(', ');
  };

  return (
    <section className="educators-section">
      <div className="educators-container">
        <h2 className="educators-title">
          Our Top Educators
          <span className="naa-title-underline"></span>
        </h2>

        <div className="server-error-message">
          {teachers.length === 0 && (
           <div className="no-results">
              <div className="no-results-icon">
                <i className="fas fa-frown fa-3x"></i>
              </div>
              <h3>No teachers found</h3>
              <p>We couldn't find any teachers</p>
            </div>
          )}
        </div>
        <div className="educators-list">
          {topTeachers.map((teacher, index) => (
            <Link
              key={index}
              to={`/staffs/teacher?id=${teacher._id}`}
              className="educator-card"
              style={{ '--index': index }}
            >
              <div className="educator-image">
                <img
                  src={teacher.image}
                  alt={teacher.name}
                />
              </div>
              <h3 className="educator-name">{teacher.name}</h3>
              <p className="educator-role">{getPrimarySubject(teacher.subjectClassMappings)}</p>
              <p className="educator-description">
                Experienced educator with a {teacher.degree} and {teacher.experience} years teaching {getSubjectsList(teacher.subjectClassMappings)}.
              </p>
            </Link>
          ))}
        </div>
        <div className="cta-container">
          <Link to="/staffs" className="cta-link">
            Explore More Educators
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TeachersSection;

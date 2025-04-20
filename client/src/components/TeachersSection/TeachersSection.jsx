import React, { useContext } from 'react';
import './TeachersSection.css';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

const TeachersSection = () => {
  const { teachers, backendUrl } = useContext(AppContext);

  // Sort teachers by experience (descending) and take top 4
  const topTeachers = [...teachers].sort((a, b) => {
      const expA = parseInt(a.experience) || 0;
      const expB = parseInt(b.experience) || 0;
      return expB - expA;
    }).slice(0, 4);

  return (
    <section className="educators-section">
      <div className="educators-container">
        <h2 className="educators-title">
          Our Top Educators
          <span className="title-underline"></span>
        </h2>
        <div className="educators-list">
          {topTeachers.map((teacher, index) => (
            <Link
              key={index}
              to={`/staffs/teacher?id=${teacher._id}`}
              className="educator-card"
              style={{ '--index': index }} // For animation delay
            >
              <div className="educator-image">
                <img
                  src={`${backendUrl}/${teacher.image.replace('\\', '/')}`}
                  alt={teacher.name}
                />
              </div>
              <h3 className="educator-name">{teacher.name}</h3>
              <p className="educator-role">{teacher.subject}</p>
              <p className="educator-description">
                Experienced educator with {teacher.experience} in {teacher.subject}.
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
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';

const TeacherCard = ({ teacher }) => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  // Format subjects for display
  const formatSubjects = (mappings) => {
    if (!mappings || mappings.length === 0) return 'N/A';
    return mappings.map((m) => m.subject).join(', ');
  };

  const handleClick = () => {
    navigate(`/staffs/teacher?id=${teacher._id}`);
  };

  return (
    <div className="teacher-card" onClick={handleClick}>
      <div className="teacher-card-image-container">
        <img
          src={teacher.image}
          alt={teacher.name}
          className="teacher-card-image"
          loading="lazy"
        />
      </div>
      <div className="teacher-card-content">
        <h3 className="teacher-card-name">{teacher.name}</h3>
        <p className="teacher-card-subject">{formatSubjects(teacher.subjectClassMappings)}</p>
        <div className="teacher-card-footer">
          <span className="teacher-card-experience">
            <i className="fas fa-briefcase"></i> {teacher.experience ? `${teacher.experience} years` : 'N/A'}
          </span>
          <button className="teacher-card-btn">View Profile</button>
        </div>
      </div>
    </div>
  );
};

export default TeacherCard;
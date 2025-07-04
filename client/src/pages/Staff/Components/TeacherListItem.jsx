import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';

const TeacherListItem = ({ teacher, index }) => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const formatSubjects = (mappings) => {
    if (!mappings || mappings.length === 0) return 'N/A';
    return mappings.map((m) => m.subject).join(', ');
  };

  const handleClick = () => {
    navigate(`/staffs/teacher?id=${teacher._id}`);
  };

  return (
    <div className="teacher-list-item" onClick={handleClick}>
      <div className="teacher-list-image">
        <img
          src={teacher.image}
          alt={teacher.name}
          loading="lazy"
        />
      </div>
      <div className="teacher-list-details">
        <h3>{teacher.name}</h3>
        <div className="teacher-list-info">
          <span className="teacher-list-subject">{formatSubjects(teacher.subjectClassMappings)}</span>
        </div>
      </div>
      <div className="teacher-list-experience">
        <i className="fas fa-briefcase"></i>
        <span>{teacher.experience ? `${teacher.experience} years` : 'N/A'}</span>
      </div>
      <button className="view-profile-btn">View Profile</button>
    </div>
  );
};

export default TeacherListItem;
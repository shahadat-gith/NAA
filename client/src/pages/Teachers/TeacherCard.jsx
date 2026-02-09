export const TeacherCard = ({ teacher }) => {
  const formatSubjects = (mappings) => {
    if (!mappings || mappings.length === 0) return 'N/A';
    return mappings.map((m) => m.subject).join(', ');
  };

  const experience = teacher.experience ? `${teacher.experience} years` : 'N/A';

  return (
    <div className="te-teacher-card">
      <div className="te-teacher-card-media">
        <img
          src={teacher.image}
          alt={teacher.name}
          className="te-teacher-card-image"
          loading="lazy"
        />
      </div>
      <div className="te-teacher-card-body">
        <div className="te-teacher-card-top">
          <h3 className="te-teacher-card-name">{teacher.name}</h3>
          <p className="te-teacher-card-degree">{teacher.degree || 'N/A'}</p>
        </div>
        <p className="te-teacher-card-subjects">
          <span
            style={{
              color: "#5c6f7b", 
              fontWeight: "700",
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              display: "block", 
              marginBottom: "2px"
            }}
          >
            Subjects taught
          </span>
          <span style={{ color: "var(--te-accent-dark)", fontWeight: "600" }}>
            {formatSubjects(teacher.subjectClassMappings)}
          </span>
        </p>
        <div className="te-teacher-card-meta">
          <span className="te-teacher-chip">Experience: {experience}</span>
        </div>
      </div>
    </div>
  );
};

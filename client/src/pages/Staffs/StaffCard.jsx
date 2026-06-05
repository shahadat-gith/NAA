import "./StaffCard.css"

const getInitials = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("");

export const StaffCard = ({ teacher, avatarClass }) => (
  <li className="scard">
    <div className={`scard__avatar ${avatarClass}`}>
      {teacher.image.url
        ? <img src={teacher.image.url} alt={teacher.name} className="scard__avatar-img" />
        : getInitials(teacher.name)}
    </div>
    <div className="scard__info">
      <p className="scard__name">{teacher.name}</p>
      <p className="scard__role">{teacher.designation}</p>
      {teacher.subjectTaught && (
        <span className="scard__subject">{teacher.subjectTaught}</span>
      )}
    </div>
    <span className="scard__id">{teacher.staffId}</span>
  </li>
);
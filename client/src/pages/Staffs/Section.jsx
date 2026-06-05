import { StaffCard } from "./StaffCard";

import "./Section.css"

export const Section = ({ title, staff, emptyMsg, avatarClass }) => (
  <div className="staff-col">
    <div className="staff-col__header">
      <h2 className="staff-col__title">{title}</h2>
      <span className="staff-col__badge">{staff.length}</span>
    </div>
    {staff.length > 0 ? (
      <ul className="staff-grid" role="list">
        {staff.map(member => (
          <StaffCard key={member._id} teacher={member} avatarClass={avatarClass} />
        ))}
      </ul>
    ) : (
      <p className="staff-col__empty">{emptyMsg}</p>
    )}
  </div>
);
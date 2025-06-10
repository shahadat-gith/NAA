import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import { AdminContext } from "../../context/AdminContext";

const Sidebar = () => {
  const { pendingContactQueries, pendingAdmissionQueries } = useContext(AdminContext);

  const sidebarSections = [
    {
      header: "General",
      links: [
        { to: "/", icon: "fas fa-home", label: "Home" },
        { to: "/settings", icon: "fas fa-cog", label: "Settings" },
      ],
    },
    {
      header: "Academic Management",
      links: [
        { to: "/hostel", icon: "fas fa-building", label: "Hostel Management" },
        { to: "/results", icon: "fas fa-file-upload", label: "Upload Results" },
        { to: "/gallery", icon: "fa-solid fa-image", label: "Gallery" },
        { to: "/add-teachers", icon: "fas fa-chalkboard-teacher", label: "Add Teacher" },
        { to: "/all-teachers", icon: "fas fa-user-tie", label: "All Teachers" },
        { to: "/task-manager", icon: "fas fa-bars-progress", label: "Task Manager" },
      ],
    },
    {
      header: "Student Management",
      links: [
        { to: "/add-students", icon: "fas fa-user-plus", label: "Add Students" },
        { to: "/achievers", icon: "fa-solid fa-star", label: "Achievers" },
        { to: "/student-list", icon: "fas fa-list-ul", label: "Student Lists" },
        { to: "/admission", icon: "fas fa-user-graduate", label: "Admission Lists" },
      ],
    },
    {
      header: "Communication",
      links: [
        { to: "/notices", icon: "fas fa-bell", label: "Add Notice" },
        { to: "/add-events", icon: "fa-solid fa-calendar-days", label: "Add Events" },
        {
          to: "/contact-queries",
          icon: "fas fa-envelope badge-icon",
          label: "Contact Queries",
          badge: pendingContactQueries,
        },
        {
          to: "/admission-queries",
          icon: "fas fa-question-circle badge-icon",
          label: "Admission Queries",
          badge: pendingAdmissionQueries,
        },
        { to: "/newsletters", icon: "fas fa-newspaper", label: "Newsletters" },
      ],
    },
  ];

  return (
    <div className="admin-sidebar">
      <ul className="sidebar-menu">
        {sidebarSections.map((section, index) => (
          <React.Fragment key={index}>
            <li className="sidebar-section-header">{section.header}</li>
            {section.links.map((link, idx) => (
              <li key={idx}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}
                >
                  <i className={link.icon}></i> {link.label}
                  {link.badge > 0 && <span className="badge">{link.badge}</span>}
                </NavLink>
              </li>
            ))}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;

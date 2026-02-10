import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";


const Sidebar = ({closeSidebar}) => {

const sidebarLinks = [
  { to: "/", icon: "fas fa-home", label: "Home" },

  // Student & Academic
  { to: "/students", icon: "fas fa-user-graduate", label: "Students" },
  { to: "/student/images", icon: "fas fa-images", label: "Student Images" },

  { to: "/admissions", icon: "fas fa-user-plus", label: "Admissions" },
  { to: "/result", icon: "fas fa-chart-line", label: "Result" },

  // Staff
  { to: "/teachers", icon: "fas fa-chalkboard-teacher", label: "Teachers" },

  // Achievements & Media
  { to: "/achievers", icon: "fas fa-trophy", label: "Achievers" },
  { to: "/gallery", icon: "fas fa-images", label: "Gallery" },

  // System
  { to: "/settings", icon: "fas fa-cogs", label: "Settings" },
];

  return (
    <div className="admin-sidebar">
      <ul className="sidebar-menu">
        {sidebarLinks.map((link, index) => (
          <li key={index}>
            <NavLink
              to={link.to}
              className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}
              onClick={closeSidebar}
            >
              <i className={link.icon}></i> {link.label}
              {link.badge > 0 && <span className="badge">{link.badge}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
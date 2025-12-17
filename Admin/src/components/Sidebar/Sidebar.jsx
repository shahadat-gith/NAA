import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";


const Sidebar = () => {

  const sidebarLinks = [
    { to: "/", icon: "fas fa-home", label: "Home" },
    { to: "/students", icon: "fas fa-list-ul", label: "Students" },
    { to: "/teachers", icon: "fas fa-user-tie", label: "Teachers" },
    // { to: "/hostel", icon: "fas fa-building", label: "Hostel Management" },
    { to: "/achievers", icon: "fa-solid fa-star", label: "Achievers" },
    { to: "/gallery", icon: "fa-solid fa-image", label: "Gallery" },
    { to: "/settings", icon: "fas fa-cog", label: "Settings" },
  ];

  return (
    <div className="admin-sidebar">
      <ul className="sidebar-menu">
        {sidebarLinks.map((link, index) => (
          <li key={index}>
            <NavLink
              to={link.to}
              className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}
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
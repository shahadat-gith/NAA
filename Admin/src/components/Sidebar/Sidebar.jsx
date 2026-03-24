import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import { navLinks } from "../../utils/utility";

const Sidebar = ({ closeSidebar }) => {
  return (
    <div className="admin-sidebar">

      {/* MENU */}
      <ul className="sidebar-menu">
        {navLinks.map((link, index) => (
          <li key={index}>
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? "active" : ""}`
              }
              onClick={closeSidebar}
            >
              <i className={link.icon}></i>
              <span>{link.label}</span>
              {link.badge > 0 && (
                <span className="badge">{link.badge}</span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>

    </div>
  );
};

export default Sidebar;

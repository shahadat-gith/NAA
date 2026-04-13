import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import { navSections } from "./navlinks";


const Sidebar = ({ closeSidebar }) => {
  return (
    <div className="admin-sidebar">
      {navSections.map((section, idx) => (
        <div key={idx} className="sidebar-section">
          <p className="sidebar-section-title">{section.title}</p>

          <ul className="sidebar-menu">
            {section.links.map((link, index) => (
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
      ))}
    </div>
  );
};

export default Sidebar;
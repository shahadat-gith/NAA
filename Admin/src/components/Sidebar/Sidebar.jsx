import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { AdminContext } from "../../context/AdminContext";

const Sidebar = ({ closeSidebar }) => {
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
    { to: "/utility", icon: "fas fa-toolbox", label: "Utility" },
    { to: "/settings", icon: "fas fa-cogs", label: "Settings" },
  ];

  const { adminToken, setAdminToken } = useContext(AdminContext);
  const navigate = useNavigate();

  const logoutHandler = () => {
    navigate("/login");
    if (adminToken) {
      setAdminToken("");
      localStorage.removeItem("adminToken");
    }
  };

  return (
    <div className="admin-sidebar">

      {/* MENU */}
      <ul className="sidebar-menu">
        {sidebarLinks.map((link, index) => (
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

      {/* LOGOUT AT BOTTOM */}
      <div className="logout-container">
        <button className="logout-btn" onClick={logoutHandler}>
          <i className="fas fa-sign-out-alt"></i>
          Logout
        </button>
      </div>

    </div>
  );
};

export default Sidebar;

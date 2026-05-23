import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "/logo.png";
import "../styles/Navbar.css";

const Navbar = ({teacher}) => {
  const token = localStorage.getItem("teacher-token");
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("teacher-token");
    navigate("/", { replace: true });
  };

  return (
    <header className="teacher-nav">
      {/* Brand Section */}
      <div className="teacher-nav-brand">
        <img src={logo} alt="School Logo" className="teacher-nav-logo" />
        <div className="teacher-nav-brand-text">
          <div className="teacher-nav-title">{teacher.name || "Teacher Portal"}</div>
          <div className="teacher-nav-subtitle">Nashib Ali Academy</div>
        </div>
      </div>


      {/* Navigation Links & Conditional Actions */}
      {token && (
        <nav className="teacher-nav-links">
          <NavLink
            to="/teacher"
            end
            className={({ isActive }) =>
              `teacher-nav-link${isActive ? " active" : ""}`
            }
          >
            <i className="fa-solid fa-chart-pie nav-link-icon"></i>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/teacher/profile"
            className={({ isActive }) =>
              `teacher-nav-link${isActive ? " active" : ""}`
            }
          >
            <i className="fa-solid fa-user nav-link-icon"></i>
            <span>Profile</span>
          </NavLink>

          {/* Dynamic Action Button based on Token Presence */}

          <button
            type="button"
            className="teacher-nav-logout-btn"
            onClick={handleLogout}
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Logout</span>
          </button>
        </nav>
      )}
    </header>
  );
};

export default Navbar;

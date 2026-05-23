import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "/logo.png";
import "../styles/Navbar.css";

const Navbar = ({ teacher }) => {
  const token = localStorage.getItem("teacher-token");
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Dropdown options array
  const menuOptions = [
    { label: "Profile", to: "/teacher/profile" },
    { label: "Attendance", to: "/teacher/attendance" },
    { label: "Payments", to: "/teacher/payments" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    localStorage.removeItem("teacher-token");
    navigate("/", { replace: true });
  };

  return (
    <header className={`teacher-nav${scrolled ? " teacher-nav--scrolled" : ""}`}>
      <div className="teacher-nav__inner">
        
        {/* Left Side: Brand, Academy, and Teacher Name */}
        <div className="teacher-nav__brand">
          <div className="teacher-nav__logo-container">
            <img src={logo} alt="Nashib Ali Academy" className="teacher-nav__logo-img" />
          </div>
          <div className="teacher-nav__brand-text">
            <span className="teacher-nav__academy">Nashib Ali Academy</span>
            {token && (
              <span className="teacher-nav__left-teacher-name">
                {teacher?.name || "Teacher Portal"}
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Profile trigger with Avatar and Arrow indicator */}
        {token && (
          <div className="teacher-nav__right" ref={dropdownRef}>
            <button
              type="button"
              className="teacher-nav__profile-trigger"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <div className="teacher-nav__avatar">
                <img
                  src={teacher?.image || logo}
                  alt={teacher?.name || "Profile"}
                  className="teacher-nav__avatar-img"
                />
              </div>
              {/* Chevron Arrow Indicator */}
              <span className={`teacher-nav__arrow${dropdownOpen ? " teacher-nav__arrow--open" : ""}`}>
                <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" width="16" height="16">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </span>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="teacher-nav__dropdown">
                {/* Teacher Name Displayed at the Top of Menu */}
                <div className="teacher-nav__dropdown-header">
                  <span className="teacher-nav__dropdown-user-title">Logged in as</span>
                  <span className="teacher-nav__dropdown-user-name">{teacher?.name || "Teacher"}</span>
                </div>
                
                <div className="teacher-nav__dropdown-divider" />

                {menuOptions.map((option, index) => (
                  <NavLink
                    key={index}
                    to={option.to}
                    className={({ isActive }) =>
                      `teacher-nav__dropdown-item${isActive ? " teacher-nav__dropdown-item--active" : ""}`
                    }
                    onClick={() => setDropdownOpen(false)}
                  >
                    {option.label}
                  </NavLink>
                ))}
                
                <div className="teacher-nav__dropdown-divider" />
                
                <button
                  type="button"
                  className="teacher-nav__dropdown-item teacher-nav__dropdown-logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </header>
  );
};

export default Navbar;
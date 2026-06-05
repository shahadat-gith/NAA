import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../styles/ProfileDropdown.css";

const ProfileDropdown = ({ teacher, handleLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const menuOptions = [
    { label: "Profile", to: "/staff/profile", icon: "far fa-user" },
    { label: "Attendance", to: "/staff/attendance", icon: "far fa-calendar-check" },
    { label: "Timetable", to: "/staff/timetable", icon: "far fa-clock" },
    { label: "Settings", to: "/staff/settings", icon: "fas fa-cog" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      {/* Trigger Area */}
      <button
        type="button"
        className="profile-dropdown__trigger"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-haspopup="true"
        aria-expanded={dropdownOpen}
      >
        <div className="profile-dropdown__avatar">
          <img
            src={teacher?.image?.url || "/user.png"}
            alt={teacher?.name || "Profile"}
            className="profile-dropdown__avatar-img"
          />
        </div>
        <span className={`profile-dropdown__arrow${dropdownOpen ? " profile-dropdown__arrow--open" : ""}`}>
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" width="16" height="16">
            <path 
              fillRule="evenodd" 
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" 
              clipRule="evenodd" 
            />
          </svg>
        </span>
      </button>

      {/* Dropdown Floating Card Overlay */}
      {dropdownOpen && (
        <div className="profile-dropdown__card">
          
          {/* Identity Header */}
          <div className="profile-dropdown__user-section">
            <div className="profile-dropdown__card-avatar">
              <img 
                src={teacher?.image?.url || "/user.png"} 
                alt={teacher?.name} 
                className="profile-dropdown__card-avatar-img"
              />
            </div>
            <div className="profile-dropdown__meta">
              <h4 className="profile-dropdown__name">{teacher?.name || "Staff Profile"}</h4>
              <p className="profile-dropdown__email">{teacher?.email || "no-email@academy.com"}</p>
            </div>
          </div>

          <div className="profile-dropdown__divider" />

          {/* Navigation Items */}
          <nav className="profile-dropdown__nav">
            {menuOptions.map((option, index) => (
              <NavLink
                key={index}
                to={option.to}
                className={({ isActive }) =>
                  `profile-dropdown__item${isActive ? " profile-dropdown__item--active" : ""}`
                }
                onClick={() => setDropdownOpen(false)}
              >
                <i className={`${option.icon} profile-dropdown__icon`}></i>
                <span className="profile-dropdown__label">{option.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="profile-dropdown__divider" />

          {/* Destructive Logout Action */}
          <div className="profile-dropdown__footer">
            <button
              type="button"
              className="profile-dropdown__item profile-dropdown__logout-btn"
              onClick={() => {
                setDropdownOpen(false);
                handleLogout();
              }}
            >
              <i className="fas fa-sign-out-alt profile-dropdown__icon logout-icon-color"></i>
              <span className="profile-dropdown__label">Log Out</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
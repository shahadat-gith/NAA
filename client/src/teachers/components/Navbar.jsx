import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "/logo.png";
import "../styles/Navbar.css";
import ProfileDropdown from "./ProfileDropdown";

const Navbar = ({ teacher }) => {
  const token = localStorage.getItem("teacher-token");
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
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

        {/* Right Side: Profile trigger via abstract Dropdown Component */}
        {token && (
          <ProfileDropdown teacher={teacher} handleLogout={handleLogout} />
        )}

      </div>
    </header>
  );
};

export default Navbar;
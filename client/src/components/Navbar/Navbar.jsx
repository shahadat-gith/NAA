import React, { useState, useEffect, useRef, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "/NAA_LOGO.png";
import "./Navbar.css";
import { useUserContext } from "../../context/UserContext";
import { AppContext } from "../../context/AppContext";

const Navbar = () => {
  const { studentToken, teacherToken, studentData, teacherData, clearUserData } = useUserContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();

  const isLoggedIn = studentToken || teacherToken;
  const userData = studentToken ? studentData : teacherToken ? teacherData : null;
  const userRole = studentToken ? "student" : teacherToken ? "teacher" : null;
  const { backendUrl } = useContext(AppContext);
  const profilePicUrl = userData?.image ? `${backendUrl}/${userData.image}` : null;
  const initialLetter = userData?.name?.charAt(0)?.toUpperCase() || "";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest(".hamburger-button")
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/portal", label: "Online Portal" },
    { to: "/academics", label: "Academics" },
    { to: "/curriculum?type=kinder", label: "Curriculum" }, // Updated to use query parameter
    { to: "/staffs", label: "Staffs" },
    { to: "/gallery", label: "Gallery" },
    { to: "/contact", label: "Contact" },
  ];

  const userOptions = [
    { to: `/${userRole}/profile`, icon: "fas fa-user", label: "Profile" },
    { to: "/", icon: "fas fa-sign-out-alt", label: "Logout", onClick: handleLogout },
  ];

  function handleLogout() {
    clearUserData(userRole);
    navigate(`/login`);
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="logo-container">
            <div className="logo-wrapper" onClick={() => navigate("/")}>
              <img src={logo} alt="Nashib Ali Academy" className="logo-image" />
              <div className="school-info">
                <h2 className="school-title">Nashib Ali</h2>
                <p className="school-subtitle">Academy</p>
              </div>
            </div>
          </div>

          <div className="desktop-nav">
            {!teacherToken && (
              <div className="nav-links">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "nav-link-active" : ""}`
                    }
                  >
                    {typeof link.label === "string" ? link.label : link.label}
                    {link.isNew && <span className="new-badge">NEW</span>}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          <div className="desktop-login">
            {isLoggedIn ? (
              <div className="profile-container">
                <button className="profile-toggle" onClick={() => navigate(`/${userRole}/profile`)}>
                  <span className="user-role-label">
                    {userRole === "student" ? "Student" : "Teacher"}
                  </span>
                  {profilePicUrl ? (
                    <img src={profilePicUrl} alt="Profile" className="profile-pic" />
                  ) : (
                    <span className="profile-initial">{initialLetter}</span>
                  )}
                  <i className="fas fa-chevron-down profile-chevron"></i>
                </button>
              </div>
            ) : (
              <NavLink to="/login" className="login-button">
                Login
              </NavLink>
            )}
          </div>

          <div className="mobile-menu-button">
            <button
              className="hamburger-button"
              aria-expanded={isMobileMenuOpen}
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <i className="fas fa-times"></i> : <i className="fas fa-bars"></i>}
            </button>
          </div>
        </div>
      </div>

      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? "open" : ""}`} aria-hidden={!isMobileMenuOpen}>
        <div ref={mobileMenuRef} className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
          <div className="mobile-menu-header">
            <div className="mobile-profile-container">
              {isLoggedIn && (
                <>
                  {profilePicUrl ? (
                    <img src={profilePicUrl} alt="Profile" className="mobile-profile-pic" />
                  ) : (
                    <span className="mobile-profile-initial">{initialLetter}</span>
                  )}
                  <span className="mobile-user-role-label">
                    {userRole === "student" ? "Student" : "Teacher"}
                  </span>
                </>
              )}
            </div>
            <button className="mobile-close-button" onClick={() => setIsMobileMenuOpen(false)}>
              <i className="fas fa-times"></i>
              <span className="sr-only">Close menu</span>
            </button>
          </div>
          <div className="mobile-login-section">
            {isLoggedIn ? (
              <div className="mobile-login-options">
                {userOptions.map((option) => (
                  <NavLink
                    key={option.to}
                    to={option.to}
                    className="mobile-login-item"
                    onClick={(e) => {
                      if (option.onClick) {
                        e.preventDefault();
                        option.onClick();
                      }
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <i className={`${option.icon} mobile-login-icon`}></i> {option.label}
                  </NavLink>
                ))}
              </div>
            ) : (
              <div className="mobile-login-options">
                <NavLink
                  to="/login"
                  className="mobile-login-item"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fas fa-sign-in-alt mobile-login-icon"></i> Login
                </NavLink>
              </div>
            )}
          </div>
          {!teacherToken && (
            <div className="mobile-nav-links">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `mobile-nav-link ${isActive ? "mobile-nav-link-active" : ""}`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {typeof link.label === "string" ? link.label : link.label}
                  {link.isNew && <span className="mobile-new-badge">NEW</span>}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
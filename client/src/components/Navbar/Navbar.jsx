import React, { useState, useEffect, useRef, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "/logo.png";
import "./Navbar.css";
import { AppContext } from "../../context/AppContext";
import SearchBar from "./SearchBar";
import { navGroups } from "./utils";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null); // tracks which dropdown is open
  const { serviceSettings } = useContext(AppContext);
  const mobileMenuRef = useRef(null);
  const navRef = useRef(null);
  const navigate = useNavigate();

  const teacherToken = localStorage.getItem("teacher-token");

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenGroup(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target) &&
        !e.target.closest(".hamburger-button")
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpenGroup(null);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const handleGroupClick = (title) => {
    setOpenGroup((prev) => (prev === title ? null : title));
  };

  const handleDropdownLinkClick = () => {
    setOpenGroup(null);
  };

  return (
    <>
      <nav className="navbar" ref={navRef}>
        <div className="navbar-container">
          <div className="navbar-content">
            {/* ── LOGO ── */}
            <div className="logo-container">
              <div className="logo-wrapper" onClick={() => navigate("/")}>
                <img
                  src={logo}
                  alt="Nashib Ali Academy"
                  className="logo-image"
                />
                <div className="school-info">
                  <h2 className="school-title">Nashib Ali</h2>
                  <span className="school-subtitle">Academy</span>
                </div>
              </div>
            </div>

            {/* ── SEARCH ── */}
            <div className="navbar-search-inline">
              <SearchBar />
            </div>

            {/* ── DESKTOP NAV GROUPS ── */}
            <div className="desktop-nav">
              <div className="nav-groups">
                {navGroups.map((group) => (
                  <div
                    key={group.title}
                    className={`nav-group ${openGroup === group.title ? "open" : ""}`}
                  >
                    <div
                      className="nav-group-title"
                      onClick={() => handleGroupClick(group.title)}
                    >
                      {group.title}
                      <i className="fas fa-chevron-down" aria-hidden="true" />
                    </div>

                    <div className="nav-dropdown">
                      {group.items.map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          className={({ isActive }) =>
                            "nav-dropdown-link" + (isActive ? " active" : "")
                          }
                          onClick={handleDropdownLinkClick}
                        >
                          {item.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT ── */}
            <div className="navbar-right">
              {teacherToken ? (
                <NavLink to="/teacher" className="nav-teacher-btn">
                  Dashborad
                </NavLink>
              ) : (
                <NavLink to="/teacher/login" className="nav-teacher-btn">
                  Login as Teacher
                </NavLink>
              )}

              <div className="mobile-menu-button">
                <button
                  className="hamburger-button"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label="Toggle menu"
                  aria-expanded={isMobileMenuOpen}
                >
                  <i
                    className={`fas ${isMobileMenuOpen ? "fa-times" : "fa-bars"}`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ── MOBILE MENU ── */}
      <div
        className={`mobile-menu-overlay ${isMobileMenuOpen ? "open" : ""}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div
          ref={mobileMenuRef}
          className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}
          role="dialog"
          aria-label="Navigation menu"
        >
          {/* Header */}
          <div className="mobile-menu-header">
            <div className="mobile-brand">
              <img
                src={logo}
                alt="logo"
                className="logo-image"
                style={{ width: 32, height: 32 }}
              />
              <div>
                <div className="mobile-brand-title">Nashib Ali</div>
                <span className="mobile-brand-sub">Academy</span>
              </div>
            </div>
            <button
              className="mobile-close-button"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <i className="fas fa-times" />
            </button>
          </div>

          {/* Search */}
          <div className="mobile-search-wrap">
            <SearchBar onClose={() => setIsMobileMenuOpen(false)} />
          </div>

          {/* Links */}
          <div className="mobile-nav-links">
            {navGroups.map((group) => (
              <div key={group.title} className="mobile-group">
                <div className="mobile-group-title">{group.title}</div>

                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      "mobile-nav-link" + (isActive ? " active" : "")
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                    <i className="fas fa-chevron-right" aria-hidden="true" />
                  </NavLink>
                ))}
              </div>
            ))}
          </div>

          {/* Footer CTA */}
          <div className="mobile-footer">
            <NavLink
              to="/teacher/login"
              className="mobile-teacher-btn"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login as Teacher
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

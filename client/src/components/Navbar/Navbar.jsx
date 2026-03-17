import React, { useState, useEffect, useRef, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "/logo.png";
import "./Navbar.css";
import { AppContext } from "../../context/AppContext";
import SearchBar from "../SearchBar/SearchBar";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { serviceSettings } = useContext(AppContext);
  const mobileMenuRef = useRef(null);
  const searchBarRef = useRef(null);
  const navigate = useNavigate();

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
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/student", label: "Student Portal" },
    { to: "/academics", label: "Academics" },
    { to: "/curriculum?type=kinder", label: "Curriculum" },
    { to: "/teachers", label: "Teachers" },
    { to: "/gallery", label: "Gallery" },
    { to: "/contact", label: "Contact" },
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-content">

            {/* ================= LOGO ================= */}
            <div className="logo-container">
              <div className="logo-wrapper" onClick={() => navigate("/")}>
                <img src={logo} alt="Nashib Ali Academy" className="logo-image" />
                <div className="school-info">
                  <h2 className="school-title">Nashib Ali</h2>
                  <p className="school-subtitle">Academy</p>
                </div>
              </div>
            </div>

            {/* ================= DESKTOP NAV ================= */}
            <div className="desktop-nav">
              <div className="nav-links">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "nav-link-active" : ""}`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* ================= RIGHT ACTIONS ================= */}
            <div className="navbar-right">
              <button
                className={`search-toggle-btn ${isSearchOpen ? "active" : ""}`}
                onClick={toggleSearch}
                aria-label="Toggle search"
                title="Search pages"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {serviceSettings?.admission && (
                <NavLink to="/admission" className="nav-admission-btn">Admission</NavLink>
              )}

              {/* ================= MOBILE MENU BUTTON ================= */}
              <div className="mobile-menu-button">
                <button
                  className="hamburger-button"
                  aria-expanded={isMobileMenuOpen}
                  onClick={toggleMobileMenu}
                >
                  <span className="sr-only">Open main menu</span>
                  {isMobileMenuOpen ? (
                    <i className="fas fa-times"></i>
                  ) : (
                    <i className="fas fa-bars"></i>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ================= SEARCH MODAL (outside nav) ================= */}
      {isSearchOpen && (
        <div
          className="navbar-search-modal-overlay"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="navbar-search-modal"
            ref={searchBarRef}
            onClick={(e) => e.stopPropagation()}
          >
            <SearchBar onClose={() => setIsSearchOpen(false)} />
          </div>
        </div>
      )}

      {/* ================= MOBILE MENU ================= */}
      <div
        className={`mobile-menu-overlay ${isMobileMenuOpen ? "open" : ""}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div
          ref={mobileMenuRef}
          className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}
        >
          <div className="mobile-menu-header">
            {serviceSettings?.admission && (
              <NavLink
                onClick={() => setIsMobileMenuOpen(false)}
                to="/admission"
                className="nav-admission-btn"
              >
                Admission
              </NavLink>
            )}
            <button
              className="mobile-close-button"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fas fa-times"></i>
              <span className="sr-only">Close menu</span>
            </button>
          </div>

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
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
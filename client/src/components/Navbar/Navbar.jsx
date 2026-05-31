import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronRight, GraduationCap } from "lucide-react";
import logo from "/logo.png";
import "./Navbar.css";
import SearchBar from "./SearchBar";
import { navGroups } from "./utils";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);
  const mobileMenuRef = useRef(null);
  const navRef = useRef(null);
  const navigate = useNavigate();

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

  return (
    <>
      <nav className="navbar" ref={navRef}>
        <div className="navbar-container">
          <div className="navbar-content">
            
            {/* ── COLUMN 1: BRAND LOGO (LEFT) ── */}
            <div className="logo-column">
              <div className="logo-wrapper" onClick={() => { navigate("/"); setOpenGroup(null); }}>
                <img src={logo} alt="Nashib Ali Academy" className="logo-image" />
                <div className="school-info">
                  <h2 className="school-title">Nashib Ali</h2>
                  <span className="school-subtitle">Academy</span>
                </div>
              </div>
            </div>

            {/* ── COLUMN 2: SEARCH BAR (DEAD CENTER) ── */}
            <div className="search-column">
              <div className="navbar-search-inline">
                <SearchBar />
              </div>
            </div>

            {/* ── COLUMN 3: NAVIGATION & ACTION BUTTONS (RIGHT) ── */}
            <div className="navigation-column">
              <div className="desktop-nav">
                <div className="nav-groups">
                  {navGroups.map((group) => (
                    <div
                      key={group.title}
                      className={`nav-group ${openGroup === group.title ? "open" : ""}`}
                    >
                      <button
                        className="nav-group-title-btn"
                        onClick={() => handleGroupClick(group.title)}
                        aria-expanded={openGroup === group.title}
                      >
                        <span>{group.title}</span>
                        <ChevronDown className="chevron-icon" size={14} strokeWidth={2.5} />
                      </button>

                      <div className="nav-dropdown">
                        {group.items.map((item) => (
                          <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                              "nav-dropdown-link" + (isActive ? " active" : "")
                            }
                            onClick={() => setOpenGroup(null)}
                          >
                            {item.label}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Menu Icon Trigger */}
              <div className="mobile-menu-button">
                <button
                  className="hamburger-button"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label="Toggle menu"
                  aria-expanded={isMobileMenuOpen}
                >
                  {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>

          </div>
        </div>
      </nav>

      {/* ── MOBILE DRAWER OVERLAY ── */}
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
          {/* Mobile Header */}
          <div className="mobile-menu-header">
            <div className="mobile-brand">
              <img src={logo} alt="logo" className="logo-image-mobile" />
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
              <X size={18} />
            </button>
          </div>

          {/* Mobile Search Input Wrapper */}
          <div className="mobile-search-wrap">
            <SearchBar onClose={() => setIsMobileMenuOpen(false)} />
          </div>

          {/* Mobile Dropdown Groups List */}
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
                    <span>{item.label}</span>
                    <ChevronRight size={14} className="mobile-arrow-icon" />
                  </NavLink>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
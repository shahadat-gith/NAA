import React, { useContext } from "react";
import "./Navbar.css";
import logo from "/NAA_LOGO.png";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";

const Navbar = ({ toggleSidebar }) => {
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
    <nav className="admin-navbar">
      <div className="navbar-container">
        {/* Left Section */}
        <div className="nav-left-admin">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            ☰
          </button>
          <div className="nav-logo-admin" onClick={() => navigate("/")}>
            <img src={logo} alt="Nashib Ali Academy" className="logo-img" />
            <div className="school-name">
              <h2 className="school-title">Nashib Ali</h2>
              <h4 className="school-subtitle">
                Academy <span className="admin-badge">Admin</span>
              </h4>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="nav-right">
          <button className="login-btn" onClick={logoutHandler}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

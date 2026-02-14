import React, { useContext } from "react";
import "./Navbar.css";
import logo from "/logo.png";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { adminToken, setAdminToken } = useContext(AdminContext);

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
        <div className="nav-right-admin">
          <button className="nav-logout-btn" onClick={logoutHandler}>
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import { AdminContext } from "../../context/AdminContext";

const Sidebar = () => {
  const { pendingContactQueries, pendingAdmissionQueries } = useContext(AdminContext);

  return (
    <div className="admin-sidebar">
      <ul className="sidebar-menu">
        {/* General Section */}
        <li className="sidebar-section-header">General</li>
        <li>
          <NavLink to="/" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>
            <i className="fas fa-home"></i> Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>
            <i className="fas fa-cog"></i> Settings
          </NavLink>
        </li>

        {/* Academic Management Section */}
        <li className="sidebar-section-header">Academic Management</li>
        <li>
          <NavLink to="/hostel" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>
            <i className="fas fa-building"></i> Hostel Management
          </NavLink>
        </li>
        <li>
          <NavLink to="/results" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>
            <i className="fas fa-file-upload"></i> Upload Results
          </NavLink>
        </li>
        <li>
          <NavLink to="/add-teachers" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>
            <i className="fas fa-chalkboard-teacher"></i> Add Teacher
          </NavLink>
        </li>
        <li>
          <NavLink to="/all-teachers" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>
            <i className="fas fa-user-tie"></i> All Teachers
          </NavLink>
        </li>

        {/* Student Management Section */}
        <li className="sidebar-section-header">Student Management</li>
        <li>
          <NavLink to="/add-students" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>
            <i className="fas fa-user-plus"></i> Add Students
          </NavLink>
        </li>
        <li>
          <NavLink to="/student-list" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>
            <i className="fas fa-list-ul"></i> Student Lists
          </NavLink>
        </li>
        <li>
          <NavLink to="/admission" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>
            <i className="fas fa-user-graduate"></i> Admission Lists
          </NavLink>
        </li>

        {/* Communication Section */}
        <li className="sidebar-section-header">Communication</li>
        <li>
          <NavLink to="/notices" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>
            <i className="fas fa-bell"></i> Add Notice
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact-queries" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>
            <i className="fas fa-envelope badge-icon"></i> Contact Queries
            {pendingContactQueries > 0 && <span className="badge">{pendingContactQueries}</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/admission-queries" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>
            <i className="fas fa-question-circle badge-icon"></i> Admission Queries
            {pendingAdmissionQueries > 0 && <span className="badge">{pendingAdmissionQueries}</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/newsletters" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>
            <i className="fas fa-newspaper"></i> Newsletters
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
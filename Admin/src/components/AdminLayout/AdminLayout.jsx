import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import "./AdminLayout.css";

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  const closeSidebar = () =>{
    setIsSidebarOpen(false)
  }

  return (
    <div className="admin-layout">
      {/* Navbar */}
      <Navbar toggleSidebar={toggleSidebar} />

      {/* Sidebar */}
      <div className={`sidebar-wrapper ${isSidebarOpen ? "open" : ""}`}>
        <Sidebar closeSidebar = {closeSidebar}/>
      </div>

      {/* Overlay for mobile */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "open" : ""}`}
        onClick={closeSidebar}
        role="button"
        tabIndex={-1}
        aria-label="Close sidebar"
      />

      {/* Main Content */}
      <main className="main-content">
        {children} {/* Page-specific content goes here */}
      </main>
    </div>
  );
};

export default AdminLayout;
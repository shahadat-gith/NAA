import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="h-screen overflow-hidden bg-[var(--bg-base)] text-[var(--text-primary)]">
      <Navbar toggleSidebar={toggleSidebar} />

      <div className="flex h-[calc(100vh-72px)] overflow-hidden">
        <aside
          className={`fixed lg:static top-[72px] left-0 z-50 h-[calc(100vh-72px)] w-72 transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          <Sidebar closeSidebar={closeSidebar} />
        </aside>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[var(--bg-base)]">
          {children}
        </main>
      </div>

      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 top-[72px] z-40 bg-black/60 lg:hidden"
        />
      )}
    </div>
  );
};

export default Layout;
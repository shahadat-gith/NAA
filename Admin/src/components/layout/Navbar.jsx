import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { AdminContext } from "../../context/AdminContext";
import { Button } from "../common/Button";

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { setAdminToken } = useContext(AdminContext);

  const logoutHandler = () => {
    setAdminToken("");
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  return (
    <nav className="h-[72px] bg-[var(--bg-surface)] border-b border-[var(--border-default)] px-4 md:px-6 flex items-center justify-between sticky top-0 z-[60]">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={toggleSidebar}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-3)] transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>

        <div className="flex items-center gap-3 min-w-0">
          <img
            src="/logo.png"
            alt="Nashib Ali Academy"
            className="w-11 h-11 rounded-xl object-contain bg-white p-1"
          />

          <div className="min-w-0">
            <h1 className="text-base md:text-lg font-semibold leading-tight truncate">
              Nashib Ali Academy
            </h1>
            <p className="text-xs text-[var(--text-secondary)] truncate">
              Admin Portal
            </p>
          </div>
        </div>
      </div>

      <Button onClick={logoutHandler} variant="danger">
        <span className="hidden sm:inline">Logout</span>
        <LogOut size={18} className="sm:hidden" />
      </Button>
    </nav>
  );
};

export default Navbar;
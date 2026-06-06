import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import { LogOut, Menu } from "lucide-react";

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { setAdminToken } = useContext(AdminContext);

  const logoutHandler = () => {
    setAdminToken("");
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  return (
    <nav className="h-20 bg-[var(--bg-surface)] border-b border-[var(--border-default)] px-4 md:px-6 flex items-center justify-between z-30">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-xl hover:bg-[var(--bg-surface-2)] transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <button
          onClick={logoutHandler}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
        >
          <LogOut size={18} />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
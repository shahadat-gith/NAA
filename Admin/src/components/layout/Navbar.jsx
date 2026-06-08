import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import { LogOut, Menu } from "lucide-react";
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
        <Button
          onClick={logoutHandler}
         variant="danger"
        >
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { User, CalendarCheck, Clock, Settings, LogOut } from "lucide-react";
import { useAppContext } from "../../context/Context";

const ProfileDropdown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { staff, logout } = useAppContext();

  const menuOptions = [
    { label: "Profile", to: "/profile", icon: User },
    { label: "Attendance", to: "/attendance", icon: CalendarCheck },
    { label: "Timetable", to: "/timetable", icon: Clock },
    { label: "Settings", to: "/settings", icon: Settings },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        className={`flex items-center space-x-2 p-1.5 rounded-2xl border transition-all duration-200 focus:outline-none cursor-pointer bg-background ${
          dropdownOpen ? "border-primary" : "border-border"
        }`}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-haspopup="true"
        aria-expanded={dropdownOpen}
      >
        <div className="w-8 h-8 rounded-xl overflow-hidden border flex-shrink-0 border-border">
          <img
            src={staff?.image?.url || "/user.png"}
            alt={staff?.name || "Profile"}
            className="w-full h-full object-cover"
          />
        </div>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 text-text-secondary ${
            dropdownOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20" 
          fill="currentColor" 
        >
          <path 
            fillRule="evenodd" 
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" 
            clipRule="evenodd" 
          />
        </svg>
      </button>

      {/* Floating Menu Overlay */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2.5 w-64 rounded-2xl border shadow-xl overflow-hidden z-50 animate-fade-in bg-card border-border">
          {/* Metadata Section */}
          <div className="p-4 flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden border flex-shrink-0 border-border">
              <img 
                src={staff?.image?.url || "/user.png"} 
                alt={staff?.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold truncate text-text-primary">
                {staff?.name || "Staff Profile"}
              </h4>
              <p className="text-xs truncate font-medium text-text-secondary">
                {staff?.email || "no-email@academy.com"}
              </p>
            </div>
          </div>

          <div className="border-t border-border" />

          {/* Navigation Items */}
          <nav className="p-2 space-y-1">
            {menuOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <NavLink
                  key={index}
                  to={option.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 relative overflow-hidden group border-none outline-none ${
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-text-secondary hover:bg-text-primary/5 hover:text-text-primary"
                    }`
                  }
                  onClick={() => setDropdownOpen(false)}
                >
                  {({ isActive }) => (
                    <>
                      {/* Left side edge accent line for the active tab */}
                      {isActive && (
                        <div className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-md bg-primary" />
                      )}
                      <IconComponent size={16} className="flex-shrink-0" />
                      <span className="truncate">{option.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="border-t border-border" />

          {/* Destructive Action Trigger */}
          <div className="p-2">
            <button
              type="button"
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 border-none outline-none text-left cursor-pointer text-danger hover:bg-danger/10"
              onClick={() => {
                setDropdownOpen(false);
                logout();
              }}
            >
              <LogOut size={16} className="flex-shrink-0" />
              <span>Log Out</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
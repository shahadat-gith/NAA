import { Link, useLocation } from "react-router-dom";
import { Home, CalendarDays, User, Settings as SettingsIcon } from "lucide-react";

const BottomTabs = () => {
  const location = useLocation();

  // Define tab navigation properties mapping path endpoints
  const navigationTabs = [
    { label: "Home", path: "/", icon: Home },
    { label: "Timetable", path: "/timetable", icon: CalendarDays },
    { label: "Profile", path: "/profile", icon: User },
    { label: "Settings", path: "/settings", icon: SettingsIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-lg backdrop-blur-md px-2 py-2 block md:hidden animate-fade-in">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navigationTabs.map((tab) => {
          const Icon = tab.icon;
          // Determine path matches (exact match for home, startsWith for deep nested paths)
          const isActive = tab.path === "/" 
            ? location.pathname === "/" 
            : location.pathname.startsWith(tab.path);

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-xl transition-all duration-150 relative no-underline group outline-none select-none border-none bg-transparent ${
                isActive 
                  ? "text-primary" 
                  : "text-text-secondary/70 hover:text-text-primary"
              }`}
            >
              {/* Dynamic Scaling Active Tab Highlighter Indicator */}
              <div 
                className={`w-5 h-5 flex items-center justify-center transition-transform ${
                  isActive ? "scale-110" : "group-active:scale-95"
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>

              {/* Text label underneath */}
              <span className={`text-[10px] font-bold mt-1 tracking-tight transition-colors ${
                isActive ? "text-primary font-black" : "text-text-secondary/80"
              }`}>
                {tab.label}
              </span>
              
              {/* Discrete little active indicator dot */}
              {isActive && (
                <span className="absolute bottom-0 w-1 h-1 rounded-full bg-primary animate-pulse" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomTabs;
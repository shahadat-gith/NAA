import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useAppContext } from "../../context/Context";
import ProfileDropdown from "./ProfileDropdown";

const Navbar = () => {
  const { staff } = useAppContext();
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <header 
      className={`sticky top-0 z-40 w-full border-b transition-all duration-200 bg-card border-border ${
        scrolled ? "backdrop-blur-md shadow-sm bg-card/90" : ""
      }`}
    >
      <div className="mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Left Side: Brand, Academy, and Staff Name */}
        <div className="flex items-center space-x-3 min-w-0 md:w-64 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0 bg-background border-border">
            <img 
              src="/logo.png" 
              alt="Nashib Ali Academy" 
              className="w-7 h-7 object-contain" 
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm sm:text-base font-bold tracking-tight truncate text-text-primary">
              Nashib Ali Academy
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider truncate text-primary">
              {staff?.name || "Staff Portal"}
            </span>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative flex items-center border rounded-xl transition-all duration-200 border-border bg-background group focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
            <div className="absolute left-3 flex items-center pointer-events-none text-text-secondary group-focus-within:text-primary transition-colors">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search profile, attendance, timetable..."
              className="w-full pl-10 pr-9 py-2 text-sm bg-transparent border-none outline-none text-text-primary font-medium placeholder:text-text-secondary/50"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 p-0.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-text-primary/5 border-none bg-transparent cursor-pointer outline-none transition-all"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Profile Dropdown */}
        <div className="flex items-center flex-shrink-0 md:w-64 justify-end">
          {/* Mobile search icon button if you choose to build a mobile dropdown/modal toggle layer later */}
          <button 
            type="button" 
            className="p-2 mr-1 rounded-xl text-text-secondary hover:text-text-primary hover:bg-text-primary/5 sm:hidden border-none bg-transparent cursor-pointer transition-colors"
          >
            <Search size={20} />
          </button>
          
          <ProfileDropdown />
        </div>

      </div>
    </header>
  );
};

export default Navbar;
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, CornerDownLeft, Command, FileText, Settings, CalendarCheck, Clock, ShieldAlert } from "lucide-react";
import { useAppContext } from "../../context/Context";
import ProfileDropdown from "./ProfileDropdown";


const Navbar = () => {
  const { staff } = useAppContext();
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);
  const mobileSearchContainerRef = useRef(null);

  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearchRow, setShowMobileSearchRow] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // STRICTLY STAFF-ONLY REGISTRY (Completely removed all student references)
  const searchableRegistry = [
    { label: "Dashboard Overview", keywords: ["home", "main", "index", "dashboard", "overview"], category: "Navigation Shortcuts", icon: Command, action: () => navigate("/") },
    { label: "My Profile Details", keywords: ["profile", "me", "avatar", "bio", "identity", "staff id"], category: "Navigation Shortcuts", icon: FileText, action: () => navigate("/profile") },
    { label: "Edit Profile Credentials", keywords: ["edit profile", "change name", "update info", "modify profile"], category: "Navigation Shortcuts", icon: FileText, action: () => navigate("/profile/edit") },
    { label: "Staff Attendance Roster", keywords: ["attendance", "present", "absent", "roster", "scan qr", "stamped log", "mark attendance"], category: "Navigation Shortcuts", icon: CalendarCheck, action: () => navigate("/attendance") },
    { label: "My Teaching Timetable", keywords: ["timetable", "schedule", "routine", "classes", "periods", "lectures"], category: "Navigation Shortcuts", icon: Clock, action: () => navigate("/timetable") },
    { label: "Modify Lecture Routine", keywords: ["update timetable", "add period", "edit routine", "assign subject", "change hours"], category: "Navigation Shortcuts", icon: Clock, action: () => navigate("/timetable/update") },
    { label: "Portal Configuration Settings", keywords: ["settings", "preferences", "config", "mode", "theme", "security"], category: "Navigation Shortcuts", icon: Settings, action: () => navigate("/settings") },
    { label: "System Developer Dossier", keywords: ["developer", "architect", "author", "shahadat ali", "credentials"], category: "Navigation Shortcuts", icon: Command, action: () => navigate("/developer") },
  ];

  // Filter entries matching criteria
  const filteredResults = searchableRegistry.filter(item => 
    searchQuery.trim() !== "" && 
    (item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
     item.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dismiss overlay when clicking completely clear of either search context box
  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedInDesktop = searchContainerRef.current?.contains(e.target);
      const clickedInMobile = mobileSearchContainerRef.current?.contains(e.target);
      
      if (!clickedInDesktop && !clickedInMobile) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (action) => {
    action();
    setSearchQuery("");
    setShowResults(false);
    setShowMobileSearchRow(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-200">
      {/* Primary Top Bar Container */}
      <div 
        className={`w-full border-b bg-card border-border transition-all duration-200 ${
          scrolled ? "backdrop-blur-md shadow-sm bg-card/90" : ""
        }`}
      >
        <div className="mx-auto h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Left Side Branding */}
          <div className="flex items-center space-x-3 min-w-0 md:w-64 shrink-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 bg-background border-border">
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
                Staff Portal
              </span>
            </div>
          </div>

          {/* LAPTOP/DESKTOP CENTER SEARCH BAR (Hidden on Mobile screens) */}
          <div 
            ref={searchContainerRef}
            className="flex-1 max-w-md relative hidden sm:block"
          >
            <div className="relative flex items-center border rounded-xl transition-all duration-200 border-border bg-background group focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
              <div className="absolute left-3 flex items-center pointer-events-none text-text-secondary group-focus-within:text-primary transition-colors">
                <Search size={18} />
              </div>
              
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowResults(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
                placeholder="Search shortcuts, configurations, settings..."
                className="w-full pl-10 pr-9 py-2 text-sm bg-transparent border-none outline-none text-text-primary font-medium placeholder:text-text-secondary/50"
              />
              
              <div className="absolute right-2.5 flex items-center">
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="p-0.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-text-primary/5 border-none bg-transparent cursor-pointer outline-none transition-all"
                  >
                    <X size={14} />
                  </button>
                ) : (
                  <span className="hidden md:inline-flex items-center text-[10px] font-bold text-text-secondary/40 bg-card border border-border/60 px-1.5 py-0.5 rounded-md select-none">
                    CMD K
                  </span>
                )}
              </div>
            </div>

            {/* Desktop Overlay Results Floating Dropdown */}
            {showResults && !showMobileSearchRow && searchQuery.trim() !== "" && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-50 animate-fade-in max-h-80 overflow-y-auto">
                <SearchResultsList filteredResults={filteredResults} handleResultClick={handleResultClick} />
              </div>
            )}
          </div>

          {/* Right Side Controls Block */}
          <div className="flex items-center shrink-0 md:w-64 justify-end space-x-2">
            {/* Mobile search toggle trigger lens button */}
            <button 
              type="button" 
              onClick={() => {
                setShowMobileSearchRow(!showMobileSearchRow);
                setSearchQuery("");
                setShowResults(true);
              }}
              className={`p-2 rounded-xl border transition-colors sm:hidden cursor-pointer outline-none ${
                showMobileSearchRow 
                  ? "bg-primary/10 text-primary border-primary/20" 
                  : "text-text-secondary hover:text-text-primary hover:bg-text-primary/5 border-transparent bg-transparent"
              }`}
            >
              <Search size={20} />
            </button>
            
            <ProfileDropdown />
          </div>

        </div>
      </div>

      {/* ================= MOBILE BOTTOM EXTENSION SEARCH FIELD ================= */}
      {showMobileSearchRow && (
        <div 
          ref={mobileSearchContainerRef}
          className="w-full border-b bg-card border-border px-4 py-3 sm:hidden animate-slide-down shadow-md relative"
        >
          <div className="relative flex items-center border rounded-xl border-border bg-background group focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
            <div className="absolute left-3 flex items-center pointer-events-none text-text-secondary group-focus-within:text-primary">
              <Search size={16} />
            </div>
            
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onFocus={() => setShowResults(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              placeholder="Search staff shortcuts, timetable, config..."
              className="w-full pl-9 pr-9 py-2 text-xs bg-transparent border-none outline-none text-text-primary font-medium placeholder:text-text-secondary/50"
            />
            
            <div className="absolute right-2.5 flex items-center">
              <button
                type="button"
                onClick={() => {
                  if (searchQuery) {
                    setSearchQuery("");
                  } else {
                    setShowMobileSearchRow(false);
                  }
                }}
                className="p-0.5 rounded-md text-text-secondary hover:text-text-primary border-none bg-transparent cursor-pointer outline-none"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Mobile Overlay Dropdown (Appears directly below the inline mobile expansion bar) */}
          {showResults && searchQuery.trim() !== "" && (
            <div className="absolute top-full left-0 right-0 border-b border-x border-border bg-card shadow-xl overflow-hidden z-50 max-h-72 overflow-y-auto">
              <SearchResultsList filteredResults={filteredResults} handleResultClick={handleResultClick} />
            </div>
          )}
        </div>
      )}
    </header>
  );
};

// Extracted stateless list presentation wrapper to clean up rendering blocks
const SearchResultsList = ({ filteredResults, handleResultClick }) => {
  if (filteredResults.length === 0) {
    return (
      <div className="p-6 text-center text-text-secondary flex flex-col items-center justify-center space-y-1 bg-card">
        <ShieldAlert size={18} className="text-text-secondary/40" />
        <p className="text-xs font-semibold">No matching index paths found</p>
      </div>
    );
  }

  return (
    <div className="p-2 space-y-3 bg-card">
      <div>
        <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary/60 px-3 block mb-1">
          Staff Portal Matches
        </span>
        <div className="space-y-0.5">
          {filteredResults.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                type="button"
                onClick={() => handleResultClick(item.action)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-transparent hover:bg-text-primary/5 text-left text-text-primary transition-colors cursor-pointer border-none outline-none group"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-background border border-border/50 flex items-center justify-center text-text-secondary group-hover:text-primary transition-colors">
                    <Icon size={14} />
                  </div>
                  <span className="text-sm font-bold truncate group-hover:text-primary transition-colors">
                    {item.label}
                  </span>
                </div>
                <CornerDownLeft size={12} className="text-text-secondary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
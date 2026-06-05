import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, ShieldAlert, CornerDownLeft } from "lucide-react";
import { getSearchableRegistry } from "../../services/utils";

const SearchBottomDrawer = ({ visible, onClose }) => {
  const navigate = useNavigate();
  const drawerRef = useRef(null);
  
  // 1. Internalized Search and Query States
  const [query, setQuery] = useState("");

  // 2. Fetch the generalized staff registry utility using the internal router hook
  const searchableRegistry = getSearchableRegistry(navigate);

  // 3. Inline computation of matched entries
  const filteredResults = searchableRegistry.filter(item => 
    query.trim() !== "" && 
    (item.label.toLowerCase().includes(query.toLowerCase()) ||
     item.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase())))
  );

  // 4. Reset input query buffer automatically when drawer explicitly dismisses
  useEffect(() => {
    if (!visible) {
      setQuery("");
    }
  }, [visible]);

  // 5. Click outside boundaries tracker & layout background scroll locks
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (visible) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.body.style.overflow = "";
    };
  }, [visible, onClose]);

  const handleResultClick = (action) => {
    action();    // Fires router redirection behavior
    onClose();   // Drops drawer presentation layer safely
  };

  if (!visible) return null;

  return (
    // Backdrop Dim Mask Layer
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end transition-opacity duration-300 ease-out animate-fade-in">
      
      {/* 60% Height Responsive Slide Card Wrapper */}
      <div 
        ref={drawerRef}
        className="w-full h-[60vh] bg-card border-t border-border rounded-t-4xl flex flex-col shadow-2xl transition-transform duration-300 transform ease-[cubic-bezier(0.32,0.94,0.6,1)] animate-slide-up"
      >
        {/* Pull Accent Bar Handle */}
        <div className="w-10 h-1 bg-border/80 rounded-full mx-auto my-3.5 shrink-0" />

        {/* Input Text Header Field Slot Container */}
        <div className="px-4 pb-3 flex items-center space-x-3 shrink-0">
          <div className="flex-1 relative flex items-center border rounded-xl border-border bg-background focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-200">
            <div className="absolute left-3 text-text-secondary pointer-events-none">
              <Search size={16} />
            </div>
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search shortcuts, profile config..."
              className="w-full pl-9 pr-9 py-2.5 text-sm bg-transparent border-none outline-none text-text-primary font-medium placeholder:text-text-secondary/40"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2.5 p-0.5 rounded-md text-text-secondary border-none bg-transparent cursor-pointer active:scale-95 transition-transform"
              >
                <X size={14} />
              </button>
            )}
          </div>
          
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-text-secondary hover:text-text-primary active:text-primary px-1 border-none bg-transparent cursor-pointer outline-none shrink-0 transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Dynamic List Render Track Window Area */}
        <div className="flex-1 overflow-y-auto p-4 pb-6 custom-scrollbar">
          {query.trim() === "" ? (
            <div className="h-full flex items-center justify-center text-center text-text-secondary/40 px-4">
              <p className="text-xs font-semibold max-w-xs leading-relaxed">
                Type search parameters above to discover operational staff system shortcut paths instantly.
              </p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-text-secondary space-y-2">
              <ShieldAlert size={22} className="text-text-secondary/30" />
              <p className="text-xs font-bold">No matching records mapped</p>
            </div>
          ) : (
            <div className="space-y-1 bg-background/50 border border-border/60 rounded-2xl p-1.5 shadow-3xs">
              <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary/50 px-3 py-2 block">
                Matching Actions
              </span>
              {filteredResults.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleResultClick(item.action)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-transparent active:bg-text-primary/5 text-left text-text-primary border-none outline-none group transition-colors duration-150"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-card border border-border/40 flex items-center justify-center text-text-secondary">
                        <Icon size={14} />
                      </div>
                      <span className="text-sm font-bold truncate">
                        {item.label}
                      </span>
                    </div>
                    <CornerDownLeft size={12} className="text-text-secondary/30" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default SearchBottomDrawer;
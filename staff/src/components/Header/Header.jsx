import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { getHeaderTitle, ROOT_PATHS } from "../../services/utils";
import { useAppContext } from "../../context/Context";

import LeftLogo from "./LeftLogo";
import CenterTitle from "./CenterTitle";
import SearchBottomDrawer from "./SearchBottomDrawer";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { staff } = useAppContext();
  const [showSearchModal, setShowSearchModal] = useState(false);

  const currentTitle = getHeaderTitle(location.pathname);
  const isRootPath = ROOT_PATHS.includes(location.pathname);

  // Dynamic profile picture fallback evaluation
  const profileImage = staff?.image?.url || staff?.image || "/user.png";

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-card border-border select-none">
        <div className="mx-auto h-16 px-4 flex items-center justify-between gap-2">
          
          {/* Sub-Component: Left Branding Slot */}
          <LeftLogo isRootPath={isRootPath} onBackAction={() => navigate(-1)} />
          
          {/* Sub-Component: Center Title Slot */}
          <CenterTitle title={currentTitle} />

          {/* RIGHT SLOT: Action Suite (Search Lens + Direct Profile Nav Avatar) */}
          <div className="w-20 flex items-center justify-end space-x-2">
            <button 
              type="button" 
              onClick={() => setShowSearchModal(true)}
              className="p-2 rounded-xl text-text-secondary hover:text-text-primary active:bg-text-primary/5 cursor-pointer border-none bg-transparent outline-none transition-colors"
            >
              <Search size={20} />
            </button>
            
            {/* Isolated Direct Profile Redirection Button Trigger */}
            <button
              type="button"
              onClick={() => {
                if (location.pathname !== "/profile") {
                  navigate("/profile");
                }
              }}
              className="w-9 h-9 rounded-full overflow-hidden border border-border bg-background focus:outline-none active:scale-95 transition-transform cursor-pointer shrink-0"
            >
              <img
                src={profileImage}
                alt={staff?.name || "Profile"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/user.png";
                }}
              />
            </button>
          </div>

        </div>
      </header>

      {/* Self-contained Context Command Drawer */}
      <SearchBottomDrawer 
        visible={showSearchModal} 
        onClose={() => setShowSearchModal(false)} 
      />
    </>
  );
};

export default Header;
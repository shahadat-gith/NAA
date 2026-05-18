import { 
  TbReceipt2, 
  TbIdBadge2, 
  TbChartBar, 
  TbFingerprint, 
  TbArrowUpRight 
} from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import "./Portal.css";
import bg_image from "/search.webp";
import logo from '/logo.png';

const Portal = () => {
  const navigate = useNavigate();

  // Added distinct path strings matching your routing structure
  const portalOptions = [
    { 
      id: "fees_payment", 
      label: "Fees Payment", 
      path: "/student/portal/fees",
      icon: <TbReceipt2 />, 
      iconBg: "#fef1f3", 
      iconColor: "#e94560" 
    },
    { 
      id: "admit_card", 
      label: "Admit Card", 
      path: "/student/portal/admit-card",
      icon: <TbIdBadge2 />, 
      iconBg: "#eeedfe", 
      iconColor: "#534AB7" 
    },
    { 
      id: "result_check", 
      label: "Result Check", 
      path: "/student/portal/result",
      icon: <TbChartBar />, 
      iconBg: "#e1f5ee", 
      iconColor: "#0F6E56" 
    },
    { 
      id: "id_card", 
      label: "ID Card", 
      path: "/student/portal/id-card",
      icon: <TbFingerprint />, 
      iconBg: "#faeeda", 
      iconColor: "#BA7517" 
    },
  ];

  return (
    <div 
      className="portal-bg-wrapper" 
      style={{ backgroundImage: `url(${bg_image})` }}
    >
      <div className="portal-blur-overlay">
        <div className="p-root">
          <div className="p-inner">
            
            {/* Top Header Section */}
            <div className="p-top">
              <div className="p-logo">
                <img src={logo} alt="Logo" />
              </div>
              <div>
                <p className="p-eyebrow">Academic Hub</p>
                <h1 className="p-heading">Online Portal</h1>
              </div>
              <div className="p-status" title="All systems online"></div>
            </div>

            <div className="p-divider"></div>

            {/* Grid Options */}
            <div className="p-grid">
              {portalOptions.map((option) => (
                <div
                  key={option.id}
                  className="p-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(option.path)}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(option.path)}
                  aria-label={option.label}
                >
                  <div className="p-card-left">
                    <div 
                      className="p-icon" 
                      style={{ background: option.iconBg, color: option.iconColor }}
                    >
                      {option.icon}
                    </div>
                    <p className="p-label">{option.label}</p>
                  </div>
                  <span className="p-arrow">
                    <TbArrowUpRight />
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Portal;
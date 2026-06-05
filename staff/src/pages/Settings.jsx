import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Key,
  BookOpen,
  FileText,
  Shield,
  Code2,
  RefreshCw,
  Layers,
  LogOut,
  Camera,
  Loader2,
} from "lucide-react";

import { apis } from "../services/api";
import { useAppContext } from "../context/Context";
import Button from "../components/common/Button";
import Alert from "../components/common/Alert";

// Web layout modular drop-ins
import ChangePasswordModal from "../components/modals/ChangePasswordModal";

const Settings = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { staff, lastUpdated, setStaff, logout } = useAppContext();

  const [uploadingImage, setUploadingImage] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    variant: "info",
    action: null,
  });

  const profileImage = staff?.image?.url || staff?.image || "/user.png";

  const triggerAlert = (title, message, variant, action = null) => {
    setAlertConfig({ visible: true, title, message, variant, action });
  };

  const handleLogoutConfirmation = () => {
    triggerAlert(
      "Confirm Logout",
      "Are you sure you want to end your secure workspace administrative session?",
      "warning",
      async () => {
        if (logout) await logout();
        localStorage.removeItem("staff-token");
        navigate("/login", { replace: true });
      },
    );
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return triggerAlert(
        "Format Error",
        "Please select a valid image file configuration.",
        "warning",
      );
    }
    if (file.size > 3 * 1024 * 1024) {
      return triggerAlert(
        "File Too Large",
        "Profile picture asset profile size must not exceed 3MB.",
        "warning",
      );
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const data = await apis.updateProfile(formData);
      if (data?.success) {
        setStaff(data.staff);
        triggerAlert(
          "Success",
          "Profile avatar updated successfully.",
          "success",
        );
      }
    } catch (error) {
      triggerAlert(
        "Upload Failed",
        error?.response?.data?.message ||
          error.message ||
          "Could not save profile image.",
        "danger",
      );
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      {/* One Unified Single Column Layout Stack */}
      <div className="space-y-6">
        {/* Section: Profile Avatar Information Row Card */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider px-1">
            Profile
          </h3>
          <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-4 min-w-0">
              {/* Avatar Wrapper without redundant overlay buttons */}
              <div className="relative w-14 h-14 shrink-0">
                <img
                  src={profileImage}
                  alt={staff?.name || "Avatar"}
                  className="w-full h-full rounded-full object-cover border border-border bg-background"
                  onError={(e) => {
                    e.target.src = "/user.png";
                  }}
                />

                {/* Hidden native file input connector */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="min-w-0">
                <h4 className="text-sm font-bold text-text-primary truncate">
                  {staff?.name || "Staff Member"}
                </h4>
                <p className="text-xs font-semibold text-primary mt-0.5 uppercase tracking-wider">
                  ID: {staff?.staffId || "NAA-STAFF"}
                </p>
              </div>
            </div>

            {/* Main Action Trigger resized to Medium size */}
            <Button
              type="button"
              variant="accent"
              size="sm"
              disabled={uploadingImage}
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-bold border-border px-5"
            >
              {uploadingImage ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  Updating...
                </span>
              ) : (
                profileImage ? "Change" : "Upload"
              )}
            </Button>
          </div>
        </div>

        {/* Section: Account Information */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider px-1">
            Account Details
          </h3>
          <div className="bg-card border border-border rounded-2xl divide-y divide-border/50 shadow-xs">
            <StaticRowItem label="Name" value={staff?.name} icon={User} />
            <StaticRowItem
              label="Email"
              value={staff?.email}
              icon={Mail}
            />
          </div>
        </div>

        {/* Section: Security Management */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider px-1">
            Security
          </h3>
          <div className="bg-card border border-border rounded-2xl shadow-xs">
            <InteractiveRowItem
              icon={Key}
              title="Change Password"
              description="Update your password to keep the account secure"
              onClick={() => setPasswordModalVisible(true)}
            />
          </div>
        </div>

        {/* Section: Institutional Compliance Regulations */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider px-1">
            Academy Documentation
          </h3>
          <div className="bg-card border border-border rounded-2xl divide-y divide-border/50 shadow-xs overflow-hidden">
            <InteractiveRowItem
              icon={BookOpen}
              title="Academic Rules"
              description="Guidelines and regulatory operational parameters."
              onClick={() => navigate("/academic-rules")}
            />
            <InteractiveRowItem
              icon={FileText}
              title="Terms & Conditions"
              description="System workspace licensing and policy terms."
              onClick={() => navigate("/terms-conditions")}
            />
            <InteractiveRowItem
              icon={Shield}
              title="Privacy Policy"
              description="Data infrastructure preservation protocols."
              onClick={() => navigate("/privacy-policy")}
            />
          </div>
        </div>

        {/* Section: Diagnostics and Technical Telemetry */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider px-1">
            System Architecture
          </h3>
          <div className="bg-card border border-border rounded-2xl divide-y divide-border/50 shadow-xs">
            <div className="flex items-center justify-between p-4 text-sm font-medium">
              <div className="flex items-center space-x-3 text-text-secondary">
                <Code2 size={16} className="text-primary" />
                <span>Developer</span>
              </div>
              <button
                onClick={() => navigate("/developer")}
                className="font-bold text-primary hover:underline bg-transparent border-none outline-none cursor-pointer"
              >
                Shahadat Ali
              </button>
            </div>

            <div className="flex items-center justify-between p-4 text-sm font-medium">
              <div className="flex items-center space-x-3 text-text-secondary">
                <RefreshCw size={16} className="text-primary" />
                <span>Last Updated on</span>
              </div>
              <span className="text-xs text-success font-semibold">
                {lastUpdated || "Just now"}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 text-sm font-medium">
              <div className="flex items-center space-x-3 text-text-secondary">
                <Layers size={16} className="text-primary" />
                <span>Curent Version</span>
              </div>
              <span className="text-text-primary font-bold">
                v1.0.0 
              </span>
            </div>
          </div>
        </div>

        {/* Section: Explicit Session Destroy Anchor */}
        <button
          type="button"
          onClick={handleLogoutConfirmation}
          className="md:hidden w-full rounded-2xl p-4 border border-danger/20 hover:border-danger bg-danger/5 text-danger font-bold text-sm flex items-center justify-center space-x-2 cursor-pointer transition-colors outline-none group"
        >
          <LogOut
            size={16}
            className="transition-transform group-hover:translate-x-0.5"
          />
          <span>Logout</span>
        </button>

        {/* Copyright Footnotes Label */}
        <p className="text-[10px] font-semibold text-text-secondary/50 text-center pt-2 tracking-wide">
          Nashib Ali Academy &bull; &copy; {new Date().getFullYear()} All Rights
          Reserved
        </p>
      </div>

      {/* Standalone Interactive Password Overhaul Modular Modal Dropdown Sheet */}
      <ChangePasswordModal
        visible={passwordModalVisible}
        onClose={() => setPasswordModalVisible(false)}
      />

      {/* Central Confirmation Alert Dialog */}
      <Alert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        variant={alertConfig.variant}
        onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
        buttons={[
          {
            text: "Cancel",
            variant: "outline",
            onClick: () =>
              setAlertConfig((prev) => ({ ...prev, visible: false })),
          },
          ...(alertConfig.action
            ? [
                {
                  text: "Confirm",
                  variant: "accent",
                  onClick: () => {
                    setAlertConfig((prev) => ({ ...prev, visible: false }));
                    alertConfig.action();
                  },
                },
              ]
            : []),
        ]}
      />
    </main>
  );
};

/* ================= COMPONENT: STATIC INFO ROW ================= */
const StaticRowItem = ({ label, value, icon: Icon }) => (
  <div className="flex items-center justify-between p-4 text-sm font-medium">
    <div className="flex items-center space-x-3 text-text-secondary shrink-0">
      <Icon size={16} className="text-primary" />
      <span>{label}</span>
    </div>
    <span className="text-text-primary font-bold truncate max-w-60 text-right">
      {value || "—"}
    </span>
  </div>
);

/* ================= COMPONENT: INTERACTIVE LINK ROW ================= */
const InteractiveRowItem = ({ icon: Icon, title, description, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full p-4 flex items-start text-left bg-transparent border-none outline-none cursor-pointer hover:bg-text-primary/5 transition-colors group first:rounded-t-2xl last:rounded-b-2xl"
  >
    <div className="mt-0.5 mr-3 text-primary shrink-0">
      <Icon size={16} />
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors tracking-tight">
        {title}
      </h4>
      <p className="text-xs font-medium text-text-secondary mt-0.5 leading-relaxed">
        {description}
      </p>
    </div>
  </button>
);

export default Settings;

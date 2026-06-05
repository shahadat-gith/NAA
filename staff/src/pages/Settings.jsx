import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Key,
  BookOpen,
  FileText,
  Shield,
  LogOut,
} from "lucide-react";

import { apis } from "../services/api";
import { useAppContext } from "../context/Context";
import Alert from "../components/common/Alert";
import ChangePasswordDrawer from "../components/settings/ChangePasswordDrawer";

// Sub-Component modular array layers
import AvatarSection from "../components/settings/AvatarSection";
import StaticRowItem from "../components/settings/StaticRowItem";
import InteractiveRowItem from "../components/settings/InteractiveRowItem";
import DeveloperSection from "../components/settings/DeveloperSection";
import ImageCropModal from "../components/settings/ImageCropModal";

import { getCroppedImg } from "../configs/cropper";

const Settings = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { staff, lastUpdated, setStaff, logout } = useAppContext();

  const [uploadingImage, setUploadingImage] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [cropModalVisible, setCropModalVisible] = useState(false);

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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return triggerAlert(
        "Format Error",
        "Please select a valid image file.",
        "warning",
      );
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImageToCrop(reader.result);
      setCropModalVisible(true);
    });
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = async (croppedAreaPixels) => {
    setCropModalVisible(false);
    setUploadingImage(true);

    try {
      const croppedBlob = await getCroppedImg(imageToCrop, croppedAreaPixels);

      const uniqueStringSignature = `${staff?.staffId || "STAFF"}_${Date.now()}`;
      const uniqueFileName = `profile_${uniqueStringSignature}.jpg`;

      const filePayload = new File([croppedBlob], uniqueFileName, {
        type: "image/jpeg",
      });

      const formData = new FormData();
      formData.append("image", filePayload);

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
      setImageToCrop(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <main className="w-full px-4 py-6 space-y-6 max-w-md mx-auto animate-fade-in">
      <div className="space-y-5">
        
        {/* Modular Profile Avatar Sub-Section */}
        <AvatarSection
          profileImage={profileImage}
          staff={staff}
          uploadingImage={uploadingImage}
          onUploadClick={() => fileInputRef.current?.click()}
          fileInputRef={fileInputRef}
          onFileChange={handleFileChange}
        />

        {/* Section: Account Information */}
        <div className="space-y-1.5">
          <h3 className="text-[10px] font-black text-text-secondary/60 uppercase tracking-widest px-1 select-none">
            Account Details
          </h3>
          <div className="bg-card border border-border rounded-2xl divide-y divide-border/40 shadow-xs overflow-hidden">
            <StaticRowItem label="Name" value={staff?.name} icon={User} />
            <StaticRowItem label="Email" value={staff?.email} icon={Mail} />
          </div>
        </div>

        {/* Section: Security Management */}
        <div className="space-y-1.5">
          <h3 className="text-[10px] font-black text-text-secondary/60 uppercase tracking-widest px-1 select-none">
            Security
          </h3>
          <div className="bg-card border border-border rounded-2xl shadow-xs overflow-hidden">
            <InteractiveRowItem
              icon={Key}
              title="Change Password"
              description="Update your password to keep the account secure"
              onClick={() => setPasswordModalVisible(true)}
            />
          </div>
        </div>

        {/* Section: Institutional Compliance Regulations */}
        <div className="space-y-1.5">
          <h3 className="text-[10px] font-black text-text-secondary/60 uppercase tracking-widest px-1 select-none">
            Academy Documentation
          </h3>
          <div className="bg-card border border-border rounded-2xl divide-y divide-border/40 shadow-xs overflow-hidden">
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

        {/* Section: Modular System Telemetry Metadata */}
        <DeveloperSection
          lastUpdated={lastUpdated}
          onDeveloperClick={() => navigate("/developer")}
        />

        {/* Mobile Explicit Session Sign Out Trigger Button */}
        <button
          type="button"
          onClick={handleLogoutConfirmation}
          className="w-full rounded-2xl p-3.5 border border-danger/20 bg-danger/5 text-danger font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-transform active:scale-98 cursor-pointer outline-none group"
        >
          <LogOut
            size={14}
            className="transition-transform group-hover:translate-x-0.5"
          />
          <span>Logout Session</span>
        </button>

        {/* Minimal Bottom Brand Copyright Stack */}
        <p className="text-[9px] font-black text-text-secondary/40 text-center pt-2 uppercase tracking-widest select-none">
          Nashib Ali Academy &bull; &copy; {new Date().getFullYear()} All Rights Reserved
        </p>
      </div>

      {/* Dynamic Image Easy-Crop Context Modal overlay */}
      <ImageCropModal
        src={imageToCrop}
        visible={cropModalVisible}
        onClose={() => {
          setCropModalVisible(false);
          setImageToCrop(null);
        }}
        onCropComplete={handleUpdateProfile}
      />

      {/* Secure Password Update Overhaul Context Overlay Drawer */}
      <ChangePasswordDrawer
        visible={passwordModalVisible}
        onClose={() => setPasswordModalVisible(false)}
      />

      {/* Shared Application Context Confirmation Interceptor Alert */}
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

export default Settings;
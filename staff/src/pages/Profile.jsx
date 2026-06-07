import { useState } from "react";
import { useAppContext } from "../context/Context";
import Alert from "../components/common/Alert";
import AccountEditDrawer from "../components/profile/AccountEditDrawer";
import AddressEditDrawer from "../components/profile/AddressEditDrawer";
import DetailRow from "../components/profile/DetailRow";
import {
  User,
  MapPin,
  ShieldCheck,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  SquarePen,
} from "lucide-react";
import AnimatedScreen from "../components/common/AnimatedScreen";

const Profile = () => {
  const { staff } = useAppContext();

  // Modal Drawer presentation triggers
  const [showAccountDrawer, setShowAccountDrawer] = useState(false);
  const [showAddressDrawer, setShowAddressDrawer] = useState(false);

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    variant: "info",
  });

  if (!staff) return null;

  const address = staff.address || {};

  const triggerAlert = (title, message, variant) => {
    setAlertConfig({ visible: true, title, message, variant });
  };

  return (
   <AnimatedScreen>
     <main className="w-full px-4 py-6 space-y-5 max-w-md mx-auto animate-fade-in">
      
      {/* ================= ACCOUNT DETAILS SECTION BLOCK ================= */}
      <div className="bg-card border relative border-border rounded-2xl p-4 shadow-xs">
        <div className="flex items-center space-x-2 mb-4 border-b border-border/40 pb-2.5 select-none">
          <GraduationCap className="text-primary shrink-0" size={16} />
          <h3 className="text-[10px] font-black uppercase tracking-widest text-text-primary">
            Account Info
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setShowAccountDrawer(true)}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-lg flex items-center justify-center border border-border bg-background text-text-secondary hover:text-primary active:scale-90 transition-transform cursor-pointer outline-none shadow-3xs"
          aria-label="Edit Account Info"
        >
          <SquarePen size={14} strokeWidth={2.2} />
        </button>

        <div className="space-y-3.5">
          <DetailRow label="Full Name" value={staff?.name} icon={User} />
          <DetailRow
            label="Email Address"
            value={staff?.email && staff.email !== "N/A" ? staff.email : "Not Provided"}
            icon={Mail}
          />
          <DetailRow label="Contact Number" value={staff?.contact} icon={Phone} />
          <DetailRow label="Subject Taught" value={staff?.subjectTaught || "N/A"} icon={GraduationCap} />
          <DetailRow label="Degree / Qualifications" value={staff?.qualification || "N/A"} icon={Briefcase} />
          <DetailRow
            label="Experience"
            value={staff?.experience !== undefined ? `${staff.experience} Years` : "N/A"}
            icon={Briefcase}
          />
          <DetailRow label="Account Status" value={staff?.status || "Pending"} icon={ShieldCheck} isStatus />
        </div>
      </div>

      {/* ================= RESIDENTIAL ADDRESS SECTION BLOCK ================= */}
      <div className="bg-card relative border border-border rounded-2xl p-4 shadow-xs">
        <div className="flex items-center space-x-2 mb-4 border-b border-border/40 pb-2.5 select-none">
          <MapPin className="text-primary shrink-0" size={16} />
          <h3 className="text-[10px] font-black uppercase tracking-widest text-text-primary">
            Address
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setShowAddressDrawer(true)}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-lg flex items-center justify-center border border-border bg-background text-text-secondary hover:text-primary active:scale-90 transition-transform cursor-pointer outline-none shadow-3xs"
          aria-label="Edit Address Info"
        >
          <SquarePen size={14} strokeWidth={2.2} />
        </button>

        <div className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3.5">
            <DetailRow label="Village" value={address.village || "N/A"} icon={MapPin} />
            <DetailRow label="Post Office" value={address.po || "N/A"} icon={MapPin} />
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            <DetailRow label="Police Station" value={address.ps || "N/A"} icon={MapPin} />
            <DetailRow label="District" value={address.district || "N/A"} icon={MapPin} />
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            <DetailRow label="PIN Code" value={address.pin || "N/A"} icon={MapPin} />
            <DetailRow label="State" value={address.state || "Assam"} icon={MapPin} />
          </div>
        </div>      </div>

      {/* ================= MODULAR SHEET CONTEXTS OVERLAYS ================= */}
      <AccountEditDrawer
        visible={showAccountDrawer}
        onClose={() => setShowAccountDrawer(false)}
        triggerAlert={triggerAlert}
      />
      <AddressEditDrawer
        visible={showAddressDrawer}
        onClose={() => setShowAddressDrawer(false)}
        triggerAlert={triggerAlert}
      />

      {/* Shared Application Alert Popups */}
      <Alert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        variant={alertConfig.variant}
        onClose={() => setAlertConfig((p) => ({ ...p, visible: false }))}
        buttons={[
          {
            text: "Okay",
            variant: "accent",
            onClick: () => setAlertConfig((p) => ({ ...p, visible: false })),
          },
        ]}
      />
    </main>
   </AnimatedScreen>
  );
};

export default Profile;
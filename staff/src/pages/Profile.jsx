import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/Context";
import Button from "../components/common/Button";
import { User, MapPin, ShieldCheck, Mail, Phone, GraduationCap, Briefcase } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { staff } = useAppContext();

  if (!staff) return null;

  const address = staff.address || {};
  const profileImage = staff?.image?.url || staff?.image || "/user.png";

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      
      {/* 1. Main Profile Top Header Section */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-5 min-w-0">
            <img
              src={profileImage}
              alt={staff?.name || "Staff Avatar"}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-border shrink-0"
              onError={(e) => { e.target.src = "/user.png"; }}
            />
            <div className="min-w-0">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                {staff?.designation || "Staff Member"}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-text-primary mt-0.5 truncate">
                {staff?.name}
              </h1>
              <div className="inline-flex items-center space-x-1.5 bg-background border border-border px-3 py-1 rounded-full mt-2">
                <span className="text-xs font-bold tracking-wider text-primary">
                  ID: {staff?.staffId || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <Button
            type="button"
            variant="accent"
            size="md"
            className="self-start sm:self-auto px-6"
            onClick={() => navigate("/profile/edit")}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* 2. Unified Master Details Grid */}
      <div className="space-y-8">
        
        {/* Account & Academic Block */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center space-x-2.5 mb-6 border-b border-border/60 pb-4">
            <GraduationCap className="text-primary shrink-0" size={20} />
            <h3 className="text-lg font-bold text-text-primary tracking-tight">
              Account & Academic Details
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
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
            <DetailRow 
              label="Account Status" 
              value={staff?.status || "Pending"} 
              icon={ShieldCheck}
              isStatus 
            />
          </div>
        </div>

        {/* Residential Address Block */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center space-x-2.5 mb-6 border-b border-border/60 pb-4">
            <MapPin className="text-primary shrink-0" size={20} />
            <h3 className="text-lg font-bold text-text-primary tracking-tight">
              Residential Address
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <DetailRow label="Village / Town" value={address.village} />
            <DetailRow label="Post Office (P.O.)" value={address.po} />
            <DetailRow label="Police Station (P.S.)" value={address.ps} />
            <DetailRow label="District" value={address.district} />
            <DetailRow label="PIN Code" value={address.pin} />
            <DetailRow label="State" value={address.state || "Assam"} />
          </div>
        </div>

      </div>
    </main>
  );
};

/* ================= REUSABLE CLEAN GRID ROW SUB-COMPONENT ================= */
const DetailRow = ({ label, value, icon: Icon, isStatus = false }) => {
  return (
    <div className="flex items-start py-1 min-w-0">
      {Icon && (
        <div className="mt-0.5 mr-3 text-text-secondary/40 shrink-0">
          <Icon size={16} />
        </div>
      )}
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
          {label}
        </span>
        {isStatus ? (
          <span className={`text-sm font-bold mt-0.5 ${value === "Active" || value === "Approved" ? "text-success" : "text-amber-500"}`}>
            {value}
          </span>
        ) : (
          <span className="text-sm font-bold text-text-primary mt-0.5 wrap-break-word">
            {value || "—"}
          </span>
        )}
      </div>
    </div>
  );
};

export default Profile;
import { Loader2 } from "lucide-react";
import Button from "../common/Button";

const AvatarSection = ({ profileImage, staff, uploadingImage, onUploadClick, fileInputRef, onFileChange }) => (
  <div className="space-y-3">
    <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider px-1">Profile</h3>
    <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between shadow-xs">
      <div className="flex items-center space-x-4 min-w-0">
        <div className="relative w-14 h-14 shrink-0">
          <img
            src={profileImage}
            alt={staff?.name || "Avatar"}
            className="w-full h-full rounded-full object-cover border border-border bg-background"
            onError={(e) => { e.target.src = "/user.png"; }}
          />
          <input type="file" ref={fileInputRef} onChange={onFileChange} accept="image/*" className="hidden" />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-text-primary truncate">{staff?.name || "Staff Member"}</h4>
          <p className="text-xs font-semibold text-primary mt-0.5 uppercase tracking-wider">ID: {staff?.staffId || "NAA-STAFF"}</p>
        </div>
      </div>
      <Button type="button" variant="accent" size="sm" disabled={uploadingImage} onClick={onUploadClick} className="text-xs font-bold border-border px-5">
        {uploadingImage ? (
          <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" />Updating...</span>
        ) : (
          profileImage !== "/user.png" ? "Change" : "Upload"
        )}
      </Button>
    </div>
  </div>
);

export default AvatarSection;
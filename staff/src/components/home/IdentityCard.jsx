import React from 'react';
import { ShieldCheck, Phone, MapPin, Award, GraduationCap, Globe, Mail } from 'lucide-react';
import QR from "/naa_qr.png";

const IdentityCard = ({ staff }) => {
  if (!staff) return null;

  return (
    <div className="w-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-md overflow-hidden relative select-none transition-all duration-300 hover:shadow-lg hover:border-[var(--color-primary)]/20 animate-fade-in">


      {/* ================= ROW 1: SCHOOL NAME & LOGO ================= */}
      <div className="bg-slate-50/80 px-4 pt-4 pb-3 border-b border-[var(--color-border)] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-md bg-[var(--color-card)] border border-[var(--color-border)] flex items-center justify-center shadow-xs">
            <img src="/logo.png" alt="Academy Logo" className="w-4 h-4 object-contain" />
          </div>
          <span className="text-[11px] font-black tracking-widest uppercase text-[var(--color-text-primary)] font-[var(--font-poppins)]">
            Nashib Ali Academy
          </span>
        </div>
        <div className="flex items-center space-x-1 bg-emerald-50 border border-[var(--color-success)]/20 px-2 py-0.5 rounded-md">
          <ShieldCheck size={10} className="text-[var(--color-success)] shrink-0" />
          <span className="text-[8px] font-black uppercase text-[var(--color-success)] tracking-wider font-[var(--font-poppins)]">
            Verified
          </span>
        </div>
      </div>

      {/* ================= ROW 2: PROFILE SUMMARY (IMAGE, NAME, DESIGNATION + QR) ================= */}
      <div className="p-4 flex items-center justify-between gap-4 border-b border-[var(--color-border)] bg-gradient-to-b from-white to-slate-50/30">
        <div className="flex items-center space-x-3.5 min-w-0">
          {/* Staff Avatar Frame */}
          <div className="w-16 h-16 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] p-0.5 overflow-hidden shadow-inner shrink-0">
            <img
              src={staff?.image?.url || staff?.image || "/user.png"}
              alt={staff?.name || "Staff Avatar"}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          
          {/* Identity Info Typography Stack */}
          <div className="min-w-0">
            <h2 className="text-[var(--text-sm)] font-black tracking-tight text-[var(--color-text-primary)] truncate font-[var(--font-poppins)]">
              {staff?.name || "Not Set"}
            </h2>
            <p className="text-[10px] font-black uppercase tracking-wider text-[var(--color-accent)] mt-0.5 font-[var(--font-poppins)] truncate">
              {staff?.designation || "Faculty Member"}
            </p>
           
          </div>
        </div>

        {/* Secure Institutional Staff QR Verification Token */}
        <div className="w-16 h-16 bg-white p-1 rounded-xl border border-[var(--color-border)] shadow-xs shrink-0 select-none hover:scale-105 transition-transform duration-200">
          <img 
            src={QR} 
            alt="NAA Verification Token Pass" 
            className="w-full h-full object-contain"
            draggable="false"
          />
        </div>
      </div>

      {/* ================= ROW 3: DETAIL TELEMETRY BLOCK ================= */}
      <div className="p-4 bg-white grid grid-cols-1 gap-2.5">
        
        {/* Detail Field: Staff ID */}
        <div className="flex items-center space-x-2.5 text-[var(--color-text-secondary)]">
          <div className="w-4 h-4 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
            <Award size={10} className="text-[var(--color-primary)]" />
          </div>
          <span className="text-[var(--text-xs)] font-bold text-[var(--color-text-primary)] font-[var(--font-poppins)]">
            ID Number: <span className="font-medium text-[var(--color-text-secondary)]">{staff?.staffId || "Not Alloted"}</span>
          </span>
        </div>

        {/* Detail Field: Qualification */}
        <div className="flex items-center space-x-2.5 text-[var(--color-text-secondary)]">
          <div className="w-4 h-4 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
            <GraduationCap size={10} className="text-[var(--color-primary)]" />
          </div>
          <span className="text-[var(--text-xs)] font-bold text-[var(--color-text-primary)] font-[var(--font-poppins)]">
            Qualification: <span className="font-medium text-[var(--color-text-secondary)]">{staff?.qualification || "Not Updated"}</span>
          </span>
        </div>

       

        {/* Detail Field: Residential Address */}
        {staff?.address?.district && (
          <div className="flex items-center space-x-2.5 text-[var(--color-text-secondary)]">
            <div className="w-4 h-4 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
              <MapPin size={10} className="text-[var(--color-primary)]" />
            </div>
            <span className="text-[var(--text-xs)] font-bold text-[var(--color-text-primary)] font-[var(--font-poppins)]">
              Address: <span className="font-medium text-[var(--color-text-secondary)] truncate">{staff.address.village}, {staff.address.district}</span>
            </span>
          </div>
        )}
      </div>


    </div>
  );
};

export default IdentityCard;
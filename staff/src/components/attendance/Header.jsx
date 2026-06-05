import React from 'react';
import { Loader2, CheckCircle2, QrCode } from "lucide-react";

export const Header = ({ isTodayAttendanceMarked, marking, onScanTrigger }) => {
  return (
    <div 
      className={`flex items-center justify-between gap-4 border p-4 rounded-2xl shadow-xs transition-all duration-300 ${
        isTodayAttendanceMarked 
          ? "bg-linear-to-br from-success/20 to-success/8 border-success/20" 
          : "bg-card border-border"
      }`}
    >
      
      {/* Inline Status Text / Instruction block */}
      <div className="min-w-0 flex-1">
        {isTodayAttendanceMarked ? (
          <div className="space-y-0.5 animate-fade-in">
            <div className="flex items-center space-x-2 text-success select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <h4 className="text-xs font-black uppercase tracking-wider">
                Marked For Today
              </h4>
            </div>
           
          </div>
        ) : (
          <div className="space-y-0.5">
            <h4 className="text-xs font-black text-text-primary uppercase tracking-wide">
              Your Monthly Attendance
            </h4>
            <p className="text-[11px] font-medium text-text-secondary leading-tight">
              Click on the Scanner to Mark your Attendance
            </p>
          </div>
        )}
      </div>

      {/* Dynamic Interactive Scanner Box Trigger */}
      <div className="shrink-0">
        {marking ? (
          <div className="w-10 h-10 flex items-center justify-center rounded-xl border border-border bg-background text-primary">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        ) : isTodayAttendanceMarked ? (
          /* Enhanced Active-Green Success Badge Container */
          <div className="w-10 h-10 flex items-center justify-center rounded-xl border border-success/30 bg-success text-white shadow-sm shadow-success/20 animate-scale-in">
            <CheckCircle2 size={18} strokeWidth={3} />
          </div>
        ) : (
          <button
            type="button"
            disabled={marking}
            onClick={onScanTrigger}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-border bg-background text-text-secondary hover:text-primary active:scale-95 transition-transform cursor-pointer outline-none shadow-3xs"
            aria-label="Scan QR Code"
          >
            <QrCode size={19} strokeWidth={2.2} />
          </button>
        )}
      </div>

    </div>
  );
};
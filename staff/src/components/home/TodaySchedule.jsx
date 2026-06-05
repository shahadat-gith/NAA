import { Link } from "react-router-dom";
import { ArrowUpRight, ClipboardX } from "lucide-react";

const RecentAttendance = ({ attendance = [] }) => {
  const formatDate = (isoString) => {
    if (!isoString) return "—";
    return new Date(isoString).toLocaleDateString("en-GB", { 
      day: "2-digit", 
      month: "short", 
      year: "numeric" 
    });
  };

  const formatCheckInTime = (isoString) => {
    if (!isoString) return "—";
    return new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const statusThemeMap = {
    present: { cardBg: "bg-success/10 border-success/20", text: "text-success" },
    absent: { cardBg: "bg-danger/10 border-danger/20", text: "text-danger" },
    leave: { cardBg: "bg-amber-500/10 border-amber-500/20", text: "text-amber-600" },
    "on leave": { cardBg: "bg-amber-500/10 border-amber-500/20", text: "text-amber-600" },
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
      
      {/* ================= MOBILE STREAMLINED HEADER ================= */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/40 select-none">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wide text-text-primary">
            Recent Attendance Logs
          </h3>
          <p className="mt-0.5 text-[11px] font-medium text-text-secondary leading-none">
            Showing last 5 check-ins
          </p>
        </div>

        {/* Small Tappable Action Trigger */}
        <Link
          to="/attendance"
          className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent text-white hover:bg-primary/90 transition-transform active:scale-90 cursor-pointer shrink-0"
          aria-label="View Attendance Dashboard"
        >
          <ArrowUpRight size={15} />
        </Link>
      </div>

      {/* ================= MOBILE SEQUENTIAL LOGS LIST ================= */}
      {attendance.length > 0 ? (
        <div className="space-y-2.5">
          {attendance.slice(0, 5).map((log) => {
            const rawStatus = log.status || "Present";
            const normalizedStatus = rawStatus.toLowerCase();
            
            const theme = statusThemeMap[normalizedStatus] || { 
              cardBg: "bg-text-secondary/10 border-text-secondary/20", 
              text: "text-text-secondary" 
            };

            return (
              <div
                key={log._id}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-background border border-border/80"
              >
                {/* Check-In Telemetry Track */}
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-black text-text-primary truncate leading-tight">
                    {formatDate(log.date)}
                  </h4>
                  <p className="text-[11px] mt-1 font-medium text-text-secondary truncate leading-none">
                    Check-In: {formatCheckInTime(log.createdAt)}
                  </p>
                </div>

                {/* Status Badge Capsule */}
                <div className={`px-2 py-0.5 rounded-md text-center text-[9px] font-black uppercase tracking-wider shrink-0 border select-none ${theme.cardBg} ${theme.text}`}>
                  {rawStatus}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Compact Empty Placeholder */
        <div className="flex flex-col items-center justify-center py-8 text-center select-none">
          <div className="w-10 h-10 rounded-xl bg-text-secondary/5 flex items-center justify-center text-text-secondary/30 mb-2">
            <ClipboardX size={20} />
          </div>
          <h4 className="text-xs font-black text-text-primary uppercase tracking-wide">
            No Logs Available
          </h4>
          <p className="max-w-60 mt-0.5 text-[11px] font-medium text-text-secondary leading-normal">
            There are no recent attendance records mapped to your profile sheet yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentAttendance;
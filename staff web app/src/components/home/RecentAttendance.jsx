import { Link } from "react-router-dom";
import { ArrowUpRight, ClipboardX } from "lucide-react";

const RecentAttendance = ({ attendance = [] }) => {
  const formatDate = (isoString) => {
    if (!isoString) return "—";
    return new Date(isoString).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };

  const formatCheckInTime = (isoString) => {
    if (!isoString) return "—";
    return new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const statusThemeMap = {
    Present: { cardBg: "bg-success/10 border-success/20", text: "text-success" },
    Absent: { cardBg: "bg-danger/10 border-danger/20", text: "text-danger" },
    "On-Leave": { cardBg: "bg-amber-500/10 border-amber-500/20", text: "text-amber-600" },
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-xs">
      {/* Header Block */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-text-primary tracking-tight">
          Recent Attendance Logs
        </h3>
        <Link
          to="/attendance"
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-accent text-white hover:bg-primary/90 transition-all group"
        >
          <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      {/* Logs Layout */}
      {attendance.length > 0 ? (
        <div className="space-y-3">
          {attendance.slice(0, 5).map((log) => {
            const status = log.status || "Present";
            const theme = statusThemeMap[status] || { cardBg: "bg-text-secondary/10 border-text-secondary/20", text: "text-text-secondary" };

            return (
              <div
                key={log._id}
                className="flex items-center justify-between gap-4 p-4 rounded-xl bg-background border border-border/60"
              >
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-text-primary truncate">
                    {formatDate(log.date)}
                  </h4>
                  <p className="text-xs mt-0.5 font-medium text-text-secondary truncate">
                    Check-In: {formatCheckInTime(log.createdAt)}
                  </p>
                </div>
                <div className={`px-2.5 py-1 rounded-md text-center text-[10px] font-bold uppercase tracking-wider flex-shrink-0 border ${theme.cardBg} ${theme.text}`}>
                  {status}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Flat Empty State */
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 rounded-full bg-text-secondary/5 flex items-center justify-center text-text-secondary/40 mb-3">
            <ClipboardX size={24} />
          </div>
          <h4 className="text-sm font-bold text-text-primary">No Logs Available</h4>
          <p className="max-w-xs mt-1 text-xs font-medium text-text-secondary leading-relaxed">
            There are no recent attendance records mapped to your profile sheet yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentAttendance;
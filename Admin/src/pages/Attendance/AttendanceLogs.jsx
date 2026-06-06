import React from "react";
import { RefreshCw, Clock, UserCheck, Users } from "lucide-react";

const AttendanceLogs = ({ attendanceList, onRefresh, actionLoading }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "Present":
        return "bg-emerald-500/10 border-emerald-500/30 text-emerald-500";
      case "Absent":
        return "bg-red-500/10 border-red-500/30 text-red-500";
      case "On-Leave":
        return "bg-amber-500/10 border-amber-500/30 text-amber-500";
      default:
        return "bg-gray-500/10 border-gray-500/30 text-gray-500";
    }
  };

  const getStatusText = (status) => {
    return status || "Present";
  };

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-6 shadow-sm h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">Today's Logs</h2>
             <span className="text-sm font-medium px-4 py-2 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl">
            {attendanceList.length} Staff Marked
          </span>

          </div>
        </div>

        <div className="flex items-center gap-4">
         
          <button
            onClick={onRefresh}
            disabled={actionLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--bg-base)] hover:bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-2xl text-sm font-semibold transition-all disabled:opacity-60"
          >
            <RefreshCw size={18} className={actionLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Logs List */}
      {attendanceList.length > 0 ? (
        <div className="space-y-3 overflow-auto flex-1 pr-2 custom-scroll">
          {attendanceList.map((record) => {
            const checkInTime = record.createdAt
              ? new Date(record.createdAt).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : "--:--";

            return (
              <div
                key={record._id}
                className="flex items-center gap-4 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl p-4 hover:border-[var(--border-strong)] transition-all"
              >
                {/* Time */}
                <div className="w-20 flex-shrink-0">
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text-primary)]">
                    <Clock size={16} />
                    {checkInTime}
                  </div>
                </div>

                {/* Staff Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <img
                    src={record.staff?.image?.url || record.staff?.image || "/user.png"}
                    alt={record.staff?.name}
                    className="w-10 h-10 rounded-2xl object-cover border border-[var(--border-default)]"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[var(--text-primary)] truncate">
                      {record.staff?.name || "Unknown Staff"}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] truncate">
                      {record.staff?.staffId || record.staff?.contact || "—"}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="flex-shrink-0">
                  <span
                    className={`inline-block px-4 py-1.5 text-sm font-semibold rounded-2xl border ${getStatusStyle(
                      record.status
                    )}`}
                  >
                    {getStatusText(record.status)}
                  </span>
                </div>

                {/* Marked By */}
                <div className="flex-shrink-0 text-right w-28">
                  <p className="text-xs text-[var(--text-secondary)]">Marked by</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                    {record.markedBy || "System"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center py-16 text-center border border-dashed border-[var(--border-default)] rounded-3xl">
          <div className="w-16 h-16 rounded-2xl bg-[var(--bg-base)] flex items-center justify-center mb-4 border border-[var(--border-default)]">
            <UserCheck size={32} className="text-[var(--text-muted)]" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Attendance Yet</h3>
          <p className="text-[var(--text-secondary)] max-w-xs">
            No staff members have marked their attendance for today.
          </p>
        </div>
      )}
    </div>
  );
};

export default AttendanceLogs;
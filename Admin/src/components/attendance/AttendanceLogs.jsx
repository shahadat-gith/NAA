import React from "react";
import { Button } from "../common/Button";

const AttendanceLogs = ({ attendanceList = [], onRefresh, actionLoading }) => {
  const formatTime = (date) => {
    if (!date) return "--:--";

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Today's Logs
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            {attendanceList.length} staff marked today
          </p>
        </div>

        <Button
          onClick={onRefresh}
          disabled={actionLoading}
          loading={actionLoading}
          variant="warning"
        >
          {actionLoading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Logs */}
      <div className="h-[450px] overflow-y-auto">
        {attendanceList.length > 0 ? (
          <div className="divide-y divide-[var(--border-default)]">
            {attendanceList.map((record) => (
              <div
                key={record._id}
                className="px-4 py-3 text-sm text-[var(--text-primary)]"
              >
                <span className="font-medium">
                  {formatTime(record.checkInTime || record.createdAt)}
                </span>{" "}
                —{" "}
                <span className="font-semibold">
                  {record.staff?.name || "Unknown Staff"}
                </span>{" "}
                marked{" "}
                <span className="font-medium">
                  {record.status || "Present"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-[var(--text-secondary)]">
            No attendance marked yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceLogs;
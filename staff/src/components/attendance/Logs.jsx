import React from "react";

export const Logs = ({ logs = [] }) => {
  const formatDate = (isoString) => {
    if (!isoString) return "—";
    return new Date(isoString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (isoString) => {
    if (!isoString) return "—";
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Maps variant badges beautifully
  const statusThemeMap = {
    Present: "text-success font-black",
    Absent: "text-danger font-black",
    "On-Leave": "text-amber-600 font-black",
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-xs max-h-[600px] flex flex-col">
      <h3 className="text-xl font-bold text-text-primary tracking-tight mb-4 flex-shrink-0">
        Attendance Logs
      </h3>

      {logs.length > 0 ? (
        <div className="space-y-3 overflow-y-auto pr-1 custom-scrollbar flex-1">
          {logs.map((log) => {
            const status = log.status || "Present";
            const statusLower = status.toLowerCase();
            const colorClass = statusThemeMap[status] || "text-text-secondary";

            return (
              <div
                key={log._id}
                className="rounded-2xl p-4 bg-background border border-border/60 transition-colors duration-150"
              >
                <h4 className="font-bold text-sm sm:text-base text-text-primary">
                  {formatDate(log.date)}
                </h4>

                <p className="text-xs sm:text-sm font-medium text-text-secondary mt-1 leading-relaxed">
                  {log.markedBy === "Admin" ? (
                    <span>
                      Admin marked you{" "}
                      <span className={colorClass}>{statusLower}</span>
                    </span>
                  ) : (
                    <span>
                      You marked <span className={colorClass}>{statusLower}</span>
                      {status !== "On-Leave" && status !== "Absent" && (
                        <span>
                          {" "}at <span className="font-bold text-text-primary">{formatTime(log.createdAt)}</span>
                        </span>
                      )}
                    </span>
                  )}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-border rounded-2xl bg-background/50 flex-1">
          <p className="text-xs sm:text-sm font-medium text-text-secondary px-4">
            No logged attendance entries found for this lifecycle.
          </p>
        </div>
      )}
    </div>
  );
};
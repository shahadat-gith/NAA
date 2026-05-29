import React from "react";
import "../styles/AttendanceHistory.css";

const AttendanceHistory = ({ history = [] }) => {
  
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

  return (
    <div className="ath-history-container">
      <div className="ath-history-header">
        <h2 className="ath-history-title">Attendance Logs</h2>
      </div>

      <div className="ath-timeline-container">
        {history.length > 0 ? (
          history.map((log) => {
            const statusClass = log.status?.toLowerCase() || "present";
            const timeStr = formatTime(log.createdAt);
            const dateStr = formatDate(log.date);
            const statusStr = log.status?.toLowerCase() || "present";

            return (
              <div key={log._id} className="ath-simple-log-line">
                <span className="ath-log-date">{dateStr}</span>
                <span className="ath-log-separator">—</span>
                <p className="ath-log-text">
                  {log.markedBy === "Admin" ? (
                    <>
                      <span className="ath-marker-admin">Admin</span> marked you{" "}
                      <span className={`ath-status-text ${statusClass}`}>{statusStr}</span>
                    </>
                  ) : (
                    <>
                      You marked <span className={`ath-status-text ${statusClass}`}>{statusStr}</span> at{" "}
                      <strong className="ath-log-time">{timeStr}</strong>
                    </>
                  )}
                </p>
              </div>
            );
          })
        ) : (
          <div className="ath-empty-history-state">
            <p>No logged attendance entries found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceHistory;
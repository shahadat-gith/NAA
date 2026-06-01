import React from "react";
import "../styles/AttendanceLogCard.css";
import { useNavigate } from "react-router-dom";

const AttendanceLogCard = ({ attendance = [] }) => {
  const navigate = useNavigate();

  // Helper to format the pure ISO Date into a clean reader string
  const formatDate = (isoString) => {
    if (!isoString) return "—";
    return new Date(isoString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // UPDATED: Now falls back on native log.createdAt timestamp parameters
  const formatCheckInTime = (isoString) => {
    if (!isoString) return "—";

    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className="alc-card">
      <div className="alc-header">
        <h2 className="alc-title">Recent Attendance Logs</h2>

        <button
          className="alc-navigate-btn"
          onClick={() => navigate("/teacher/attendance")}
          aria-label="Navigate to full history"
        >
          {/* Fixed syntax error from class to className */}
          <i className="fa-solid fa-square-up-right"></i>
        </button>
      </div>

      <div className="alc-table-container">
        {attendance.length > 0 ? (
          <table className="alc-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Check-In Time</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {attendance.map((log) => (
                <tr key={log._id}>
                  {/* UPDATED: Formatted native date wrapper nicely */}
                  <td className="alc-date-cell">{formatDate(log.date)}</td>

                  {/* UPDATED: Points directly to automated log.createdAt fallback timestamp hook */}
                  <td className="alc-time-cell">
                    {formatCheckInTime(log.createdAt)}
                  </td>

                  <td>
                    <span
                      className={`alc-status-badge ${log.status?.toLowerCase() || "present"}`}
                    >
                      {log.status || "Present"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="alc-no-data">No recent attendance entries recorded.</p>
        )}
      </div>
    </section>
  );
};

export default AttendanceLogCard;
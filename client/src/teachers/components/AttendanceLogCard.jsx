import React from "react";
import "../styles/AttendanceLogCard.css";

const AttendanceLogCard = ({ attendance = [] }) => {

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
        <h2 className="alc-title">
          Recent Attendance Logs
        </h2>
      </div>

      <div className="alc-table-container">
        {attendance.length > 0 ? (
          <table className="alc-table">

            <thead>
              <tr>
                <th>Date</th>
                <th>Check-In Time</th>
                <th>Marked By</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {attendance.map((log) => (
                <tr key={log._id}>

                  <td className="alc-date-cell">
                    {log.date}
                  </td>

                  <td className="alc-time-cell">
                    {formatCheckInTime(log.checkInTime)}
                  </td>

                  <td className="alc-markedby-cell">
                    {log.markedBy}
                  </td>

                  <td>
                    <span
                      className={`alc-status-badge ${log.status?.toLowerCase()}`}
                    >
                      {log.status}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        ) : (
          <p className="alc-no-data">
            No recent attendance entries recorded.
          </p>
        )}
      </div>

    </section>
  );
};

export default AttendanceLogCard;
import React from 'react';
import './AttendanceLogs.css';

const AttendanceLogs = ({ attendanceList, onRefresh, actionLoading }) => {
  
  const getStatusStyle = (status) => {
    switch(status) {
      case 'Present': return 'status-present';
      case 'Absent': return 'status-late'; // Matches your backend Enum ["Present", "Absent", "On-Leave"]
      case 'On-Leave': return 'status-onleave';
      default: return 'status-default';
    }
  };

  return (
    <section className="atd-panel-card">
      <div className="atd-panel-header">
        <div>
          <h2>Today's Attendance Logs</h2>
        </div>
        <div className="atd-panel-actions">
          <span className="atd-total-count">
            <i className="fa-solid fa-users" style={{ marginRight: '8px' }}></i>
            Total Attendance: {attendanceList.length}
          </span>
          <button
            type="button"
            className="atd-refresh-btn"
            onClick={onRefresh}
            disabled={actionLoading}
          >
            <i className="fa-solid fa-arrows-rotate" style={{ marginRight: '6px' }}></i>
            Refresh
          </button>
        </div>
      </div>

      <div className="atd-table-wrapper">
        {attendanceList.length > 0 ? (
          <table className="atd-table">
            <thead>
              <tr>
                <th><i className="fa-solid fa-user-tie" style={{ marginRight: '6px' }}></i> Faculty</th>
                <th><i className="fa-regular fa-calendar" style={{ marginRight: '6px' }}></i> Date</th>
                <th><i className="fa-regular fa-clock" style={{ marginRight: '6px' }}></i> Time</th>
                <th><i className="fa-solid fa-shield-halved" style={{ marginRight: '6px' }}></i> Status</th>
                <th><i className="fa-solid fa-fingerprint" style={{ marginRight: '6px' }}></i> Marked By</th>
              </tr>
            </thead>
            <tbody>
              {attendanceList.map((record) => {
                // Formatting the Midnight-Normalized Date safe for presentation
                const attendanceDate = new Date(record.date).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                });

                // UPDATED: Falling back cleanly on MongoDB's native 'createdAt' timestamp token
                const checkInTimestamp = record.createdAt || null;

                const attendanceTime = checkInTimestamp
                  ? new Date(checkInTimestamp).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: true
                    })
                  : '-- : -- : --';

                return (
                  <tr key={record._id}>
                    <td className="atd-td">
                      <div className="atd-faculty-profile-cell">
                        {record.teacher?.image ? (
                          <img 
                            src={record.teacher.image} 
                            alt={record.teacher?.name || "Profile"} 
                            className="atd-faculty-avatar"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/user.png";
                            }}
                          />
                        ) : (
                          <div className="atd-faculty-avatar-placeholder">
                            {record.teacher?.name ? record.teacher.name.charAt(0) : "F"}
                          </div>
                        )}
                        <div className="atd-faculty-meta-info">
                          <div className="faculty-name">{record.teacher?.name || "N/A"}</div>
                          <div className="faculty-dept">{record.teacher?.contact || "No Contact Ext."}</div>
                        </div>
                      </div>
                    </td>
                    <td className="atd-td">{attendanceDate}</td>
                    <td className="atd-td time-cell">
                      <span className={checkInTimestamp ? "" : "no-time"}>{attendanceTime}</span>
                    </td>
                    <td className="atd-td">
                      <span className={`status-badge ${getStatusStyle(record.status)}`}>
                        {record.status || "Present"}
                      </span>
                    </td>
                    <td className="atd-td time-cell">
                      <span style={{ marginLeft: "15px" }}>{record.markedBy || "Teacher"}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="atd-empty-table-state">
            <i className="fa-solid fa-folder-open fa-2x" style={{ display: 'block', marginBottom: '10px' }}></i>
            <p>No faculty members have checked in using today's credentials registry.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AttendanceLogs;
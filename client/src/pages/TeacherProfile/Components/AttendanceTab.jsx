import React from "react";

const AttendanceTab = ({
  filteredAttendance,
  attendanceStats,
  selectedMonth,
  selectedYear,
  setSelectedMonth,
  setSelectedYear,
  currentPage,
  attendancePerPage,
  handleMarkAttendance,
  handlePageChange,
  error,
  isLoading,
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const getMonthName = (month) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[month];
  };

  const years = Array.from({ length: 3 }, (_, i) => new Date().getFullYear() - i);

  const indexOfLastAttendance = currentPage * attendancePerPage;
  const indexOfFirstAttendance = indexOfLastAttendance - attendancePerPage;
  const currentAttendance = filteredAttendance.slice(indexOfFirstAttendance, indexOfLastAttendance);
  const totalAttendancePages = Math.ceil(filteredAttendance.length / attendancePerPage);

  return (
    <div className="teacher-tab-content">
      <div className="teacher-attendance-section">
        <h3>Attendance Dashboard</h3>

        <div className="attendance-action-container">
          <button
            onClick={handleMarkAttendance}
            className="teacher-action-button mark-attendance-button"
            disabled={isLoading}
          >
            <i className="fas fa-check-circle"></i> {isLoading ? "Marking..." : "Mark Today's Attendance"}
          </button>
        </div>

        <div className="attendance-filter-container">
          <div className="attendance-filter">
            <label>Month:</label>
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="attendance-select"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {getMonthName(i)}
                </option>
              ))}
            </select>
          </div>
          <div className="attendance-filter">
            <label>Year:</label>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="attendance-select"
            >
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="attendance-stats-container">
          <div className="attendance-stat-card">
            <div className="stat-icon">
              <i className="fas fa-percentage"></i>
            </div>
            <div className="stat-content">
              <h4>Attendance Rate</h4>
              <p className="stat-value">{attendanceStats.percentage}%</p>
            </div>
          </div>
          <div className="attendance-stat-card">
            <div className="stat-icon">
              <i className="fas fa-check"></i>
            </div>
            <div className="stat-content">
              <h4>Present Days</h4>
              <p className="stat-value">{attendanceStats.present}</p>
            </div>
          </div>
          <div className="attendance-stat-card">
            <div className="stat-icon">
              <i className="fas fa-times"></i>
            </div>
            <div className="stat-content">
              <h4>Absent Days</h4>
              <p className="stat-value">{attendanceStats.absent}</p>
            </div>
          </div>
          <div className="attendance-stat-card">
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-content">
              <h4>Late Days</h4>
              <p className="stat-value">{attendanceStats.late}</p>
            </div>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="attendance-table-container">
          <h4>Attendance Records - {getMonthName(selectedMonth)} {selectedYear}</h4>
          {currentAttendance.length > 0 ? (
            <>
              <table className="teacher-attendance-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Day</th>
                    <th>Status</th>
                    <th>Marked At</th>
                    <th>Marked By</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAttendance.map((record) => {
                    const recordDate = new Date(record.date);
                    const dayOfWeek = recordDate.toLocaleDateString('en-US', { weekday: 'long' });
                    const isAlreadyMarked = record.status.toLowerCase() === "already marked";
                    return (
                      <tr key={record._id} className={`status-${record.status.toLowerCase().replace(" ", "-")}`}>
                        <td>{formatDate(record.date)}</td>
                        <td>{dayOfWeek}</td>
                        <td>
                          <span className={`status-badge ${isAlreadyMarked ? "already-marked" : record.status.toLowerCase()}`}>
                            {record.status}
                          </span>
                        </td>
                        <td>{new Date(record.markedAt).toLocaleTimeString()}</td>
                        <td>{record.markedBy || "Teacher"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-button"
                >
                  Previous
                </button>
                <span className="pagination-info">
                  Page {currentPage} of {totalAttendancePages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalAttendancePages || totalAttendancePages === 0}
                  className="pagination-button"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <p className="no-records-message">No attendance records for {getMonthName(selectedMonth)} {selectedYear}.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceTab;

import React, { useState } from "react";
import toast from 'react-hot-toast';
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";

const AttendanceTab = ({ teacher, backendUrl, adminToken, attendance, setAttendance, setError, setTeacher }) => {
  const [value, onChange] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const formatLocalDate = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const markAttendance = async (status, dateStr) => {
    try {
      const localDate = new Date(dateStr);
      localDate.setHours(0, 0, 0, 0);
      const utcDate = new Date(
        Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate())
      );

      const response = await axios.post(
        `${backendUrl}/api/teacher/mark-attendance`,
        { teacherId: teacher._id, status, date: utcDate.toISOString() },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      if (response.data.success) {
        // Refresh teacher data to sync attendance
        const teacherResponse = await axios.get(`${backendUrl}/api/teacher/teacher/${teacher._id}`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        if (teacherResponse.data.success) {
          setTeacher(teacherResponse.data.teacher);
          setAttendance(teacherResponse.data.teacher.attendance || []);
        }
        toast.success(`Marked as ${status}`);
      } else {
        setError(response.data.message || "Failed to mark attendance.");
        toast.error(response.data.message || "Failed to mark attendance.");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Error marking attendance.";
      setError(message);
      toast.error(message);
      throw new Error(message);
    }
  };

  const unmarkAttendance = async (attendanceId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/teacher/unmark-attendance`,
        { teacherId: teacher._id, attendanceId },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      if (response.data.success) {
        // Refresh teacher data to sync attendance
        const teacherResponse = await axios.get(`${backendUrl}/api/teacher/teacher/${teacher._id}`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        if (teacherResponse.data.success) {
          setTeacher(teacherResponse.data.teacher);
          setAttendance(teacherResponse.data.teacher.attendance || []);
        }
        toast.success("Attendance unmarked successfully");
      } else {
        setError(response.data.message || "Failed to unmark attendance.");
        toast.error(response.data.message || "Failed to unmark attendance.");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Error unmarking attendance.";
      setError(message);
      throw new Error(message);
    }
  };

  const handleMarkAttendance = async (status, dateStr) => {
    const targetDate = dateStr || formatLocalDate(value);
    try {
      await markAttendance(status, targetDate);
    } catch (error) {
      toast.error(error.message || "Error marking attendance.");
    }
  };

  const handleUnmarkAttendance = async (attendanceId) => {
    try {
      await unmarkAttendance(attendanceId);
    } catch (error) {
      toast.error(error.message || "Error unmarking attendance.");
    }
  };

  const handleActionChange = async (e, record) => {
    const action = e.target.value;
    if (!action) return;
    const formattedDate = formatLocalDate(new Date(record.date));
    if (action === "unmark") {
      await handleUnmarkAttendance(record._id);
    } else {
      await handleMarkAttendance(action, formattedDate);
    }
    e.target.value = "";
  };

  const monthlyAttendance = attendance.filter(
    (att) =>
      new Date(att.date).getMonth() === selectedMonth &&
      new Date(att.date).getFullYear() === selectedYear
  );

  const overallPresent = attendance.filter((att) => att.status === "Present" || att.status === "Late").length;
  const overallAbsent = attendance.filter((att) => att.status === "Absent").length;
  const overallLate = attendance.filter((att) => att.status === "Late").length;
  const overallTotal = overallPresent + overallAbsent;
  const overallPercentage = overallTotal > 0 ? (overallPresent / overallTotal) * 100 : 0;

  const presentCount = monthlyAttendance.filter((att) => att.status === "Present" || att.status === "Late").length;
  const absentCount = monthlyAttendance.filter((att) => att.status === "Absent").length;
  const lateCount = monthlyAttendance.filter((att) => att.status === "Late").length;
  const totalDays = presentCount + absentCount;
  const attendancePercentage = totalDays > 0 ? (presentCount / totalDays) * 100 : 0;

  const tileContent = ({ date }) => {
    const dateStr = formatLocalDate(date);
    const att = monthlyAttendance.find((att) => {
      return formatLocalDate(new Date(att.date)) === dateStr;
    });
    return att ? (
      <div className={`attendance-marker ${att.status.toLowerCase()}`}>
        {att.markedBy === "Admin" ? <span className="admin-marker">A</span> : null}
      </div>
    ) : null;
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

  const sortedAttendance = [...attendance].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="attendance-tab">
      <div className="container">
        <div className="grid">
          <div className="calendar-section">
            <h2>Attendance Calendar</h2>
            <div className="calendar-wrapper">
              <Calendar
                onChange={onChange}
                value={value}
                tileContent={tileContent}
                className="professional-calendar"
              />
            </div>
            <div className="attendance-actions">
              <button className="btn btn-present" onClick={() => handleMarkAttendance("Present")}>
                Mark Present
              </button>
              <button className="btn btn-late" onClick={() => handleMarkAttendance("Late")}>
                Mark Late
              </button>
              <button className="btn btn-absent" onClick={() => handleMarkAttendance("Absent")}>
                Mark Absent
              </button>
            </div>
          </div>

          <div className="summary-section">
            <h2>Attendance Summary</h2>
            <div className="filter">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              >
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div className="summary-table">
              <div className="summary-row">
                <span className="summary-label">Present (Month):</span>
                <span className="summary-value present">{presentCount}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Absent (Month):</span>
                <span className="summary-value absent">{absentCount}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Late (Month):</span>
                <span className="summary-value late">{lateCount}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Attendance Rate (Month):</span>
                <span className="summary-value">{attendancePercentage.toFixed(2)}%</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Overall Present:</span>
                <span className="summary-value present">{overallPresent}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Overall Absent:</span>
                <span className="summary-value absent">{overallAbsent}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Overall Late:</span>
                <span className="summary-value late">{overallLate}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Overall Attendance Rate:</span>
                <span className="summary-value">{overallPercentage.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="history-section">
          <h2>Attendance History</h2>
          {sortedAttendance.length === 0 ? (
            <p className="no-records">No attendance records available.</p>
          ) : (
            <div className="history-table-wrapper">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Marked By</th>
                    <th>Marked At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAttendance.map((record) => (
                    <tr key={record._id}>
                      <td>{new Date(record.date).toLocaleDateString()}</td>
                      <td className={`status-${record.status.toLowerCase()}`}>{record.status}</td>
                      <td>{record.markedBy}</td>
                      <td>{new Date(record.markedAt).toLocaleString()}</td>
                      <td>
                        <select
                          onChange={(e) => handleActionChange(e, record)}
                          defaultValue=""
                        >
                          <option value="">Select Action</option>
                          <option value="Present">Mark Present</option>
                          <option value="Absent">Mark Absent</option>
                          <option value="Late">Mark Late</option>
                          <option value="unmark">Unmark</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceTab;
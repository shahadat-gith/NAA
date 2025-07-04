import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UserContext } from '../../../context/UserContext';
import { AppContext } from '../../../context/AppContext';
import Loader from '../../../components/Loader/Loader';
import './Attendance.css';

const TeacherAttendance = () => {
  const { teacherData: teacher, teacherToken } = useContext(UserContext);
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState({
    totalDays: 0,
    present: 0,
    absent: 0,
    late: 0,
    percentage: 0,
  });

  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMarking, setIsMarking] = useState(false);
  const attendancePerPage = 10;

  const formatDateKolkata = (isoDate) => {
    if (!isoDate) return 'N/A';
    return new Date(isoDate).toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
    });
  };

  const getTodayKolkataString = () =>
    new Date().toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
    });

  const getCurrentLocation = () =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });
    });

  const fetchAttendanceHistory = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/teacher/attendance-history`, {
        headers: {
          Authorization: `Bearer ${teacherToken}`,
        },
      });
      const data = await response.json();
      console.log('Attendance History Response:', data);
      if (data.success && Array.isArray(data.attendance)) {
        const validAttendance = data.attendance.filter(
          (record) => record && record.date && record.status && record._id
        );
        setAttendance(validAttendance);
      } else {
        setAttendance([]);
        toast.error(data.message || 'Failed to fetch attendance history');
      }
    } catch (error) {
      console.error('Error fetching attendance history:', error);
      setAttendance([]);
      toast.error('Error fetching attendance history');
    }
  };
const handleMarkAttendance = async () => {
  setIsMarking(true);
  try {
    if (!navigator.geolocation) {
      throw new Error('Geolocation not supported');
    }

    const position = await getCurrentLocation();
    const latitude = parseFloat(position.coords.latitude);
    const longitude = parseFloat(position.coords.longitude);

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new Error('Failed to retrieve valid location');
    }

    const now = new Date();
    const localDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    localDate.setHours(0, 0, 0, 0);
    const utcDate = new Date(Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate()));

    const response = await fetch(`${backendUrl}/api/teacher/mark-attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${teacherToken}`,
      },
      body: JSON.stringify({
        status: 'Present',
        latitude,
        longitude,
        date: utcDate.toISOString(),
      }),
    });

    const data = await response.json();
    console.log('Mark Attendance Response:', data);

    if (data.success) {
      toast.success('Attendance marked as Present!');
      setSelectedMonth('all');
      setSelectedYear('all');
      await fetchAttendanceHistory();
    } else {
      toast.error(data.message || 'Failed to mark attendance');
    }
  } catch (error) {
    console.error('Error marking attendance:', error);
    toast.error(error.message || 'Error marking attendance');
  } finally {
    setIsMarking(false);
  }
};


  useEffect(() => {
    if (!teacherToken) {
      navigate('/login/teacher');
    } else {
      fetchAttendanceHistory();
    }
  }, [teacherToken, navigate]);

  useEffect(() => {
    const filtered = filterAttendanceByMonth(attendance);
    setFilteredAttendance(filtered);
    calculateAttendanceStats(filtered);
    console.log('Filtered Attendance:', filtered);
  }, [attendance, selectedMonth, selectedYear]);

  const filterAttendanceByMonth = (attendanceHistory = []) => {
    return attendanceHistory.filter((record) => {
      if (!record || !record.date || !record.status || !record._id) return false;
      const localDate = new Date(
        new Date(record.date).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
      );
      return (
        (selectedMonth === 'all' || localDate.getMonth() === Number(selectedMonth)) &&
        (selectedYear === 'all' || localDate.getFullYear() === Number(selectedYear))
      );
    });
  };

  const calculateAttendanceStats = (records = []) => {
    const present = records.filter((record) => record.status === 'Present').length;
    const absent = records.filter((record) => record.status === 'Absent').length;
    const late = records.filter((record) => record.status === 'Late').length;
    const total = records.length;
    setAttendanceStats({
      totalDays: total,
      present,
      absent,
      late,
      percentage: total > 0 ? Math.round(((present + late) / total) * 100) : 0,
    });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const isMarkedToday = () => {
    const today = getTodayKolkataString();
    return attendance.some((record) => {
      if (!record || !record.date) return false;
      const recordDate = formatDateKolkata(record.date);
      return recordDate === today;
    });
  };

  const months = [
    { value: 'all', label: 'All Months' },
    { value: 0, label: 'January' },
    { value: 1, label: 'February' },
    { value: 2, label: 'March' },
    { value: 3, label: 'April' },
    { value: 4, label: 'May' },
    { value: 5, label: 'June' },
    { value: 6, label: 'July' },
    { value: 7, label: 'August' },
    { value: 8, label: 'September' },
    { value: 9, label: 'October' },
    { value: 10, label: 'November' },
    { value: 11, label: 'December' },
  ];

  const years = [
    { value: 'all', label: 'All Years' },
    ...Array.from({ length: 5 }, (_, i) => ({
      value: new Date().getFullYear() - i,
      label: new Date().getFullYear() - i,
    })),
  ];

  const indexOfLastAttendance = currentPage * attendancePerPage;
  const indexOfFirstAttendance = indexOfLastAttendance - attendancePerPage;
  const currentAttendance = filteredAttendance
    .slice(indexOfFirstAttendance, indexOfLastAttendance)
    .filter((record) => record && record.date && record.status && record._id)
    .map((record) => (
      <tr key={record._id}>
        <td>{formatDateKolkata(record.date)}</td>
        <td>
          <span className={`status-badge status-${record.status.toLowerCase()}`}>
            {record.status}
          </span>
        </td>
        <td>{record.markedBy === 'Admin' ? 'Admin' : 'You'}</td>
      </tr>
    ));

  const totalAttendancePages = Math.ceil(filteredAttendance.length / attendancePerPage);

  if (!teacherToken) return null;
  if (!teacher) return <Loader message="Loading teacher data..." />;
  if (!Array.isArray(filteredAttendance)) {
    return <div className="teacher-attendance-container">No attendance data available.</div>;
  }

  return (
    <div className="teacher-attendance-container">
      <div className="teacher-attendance-card">
        <h2 className="teacher-attendance-title">Attendance</h2>
        <div className="attendance-action-container">
          <button
            className="mark-attendance-button"
            onClick={handleMarkAttendance}
            disabled={isMarking || isMarkedToday()}
            aria-label="Mark today's attendance"
          >
            {isMarking ? 'Marking...' : "Mark Today's Attendance"}
          </button>
        </div>
        <div className="attendance-filter-container">
          <div className="attendance-filter">
            <label htmlFor="month-filter">Month</label>
            <select
              id="month-filter"
              className="attendance-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {months.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="attendance-filter">
            <label htmlFor="year-filter">Year</label>
            <select
              id="year-filter"
              className="attendance-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {years.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="attendance-stats-container">
          <div className="attendance-stat-card">
            <i className="fas fa-calendar stat-icon"></i>
            <div className="stat-content">
              <h4>Total Days</h4>
              <span className="stat-value">{attendanceStats.totalDays}</span>
            </div>
          </div>
          <div className="attendance-stat-card">
            <i className="fas fa-check-circle stat-icon"></i>
            <div className="stat-content">
              <h4>Present</h4>
              <span className="stat-value">{attendanceStats.present}</span>
            </div>
          </div>
          <div className="attendance-stat-card">
            <i className="fas fa-times-circle stat-icon"></i>
            <div className="stat-content">
              <h4>Absent</h4>
              <span className="stat-value">{attendanceStats.absent}</span>
            </div>
          </div>
          <div className="attendance-stat-card">
            <i className="fas fa-clock stat-icon"></i>
            <div className="stat-content">
              <h4>Late</h4>
              <span className="stat-value">{attendanceStats.late}</span>
            </div>
          </div>
          <div className="attendance-stat-card">
            <i className="fas fa-percentage stat-icon"></i>
            <div className="stat-content">
              <h4>Attendance %</h4>
              <span className="stat-value">{attendanceStats.percentage}%</span>
            </div>
          </div>
        </div>
        <div className="attendance-table-container">
          <h4>Attendance History</h4>
          {filteredAttendance.length === 0 ? (
            <p className="no-records-message">
              {attendance.length > 0
                ? 'No attendance records found for this period.'
                : 'No attendance records available.'}
            </p>
          ) : (
            <>
              <table className="teacher-attendance-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Marked By</th>
                  </tr>
                </thead>
                <tbody>{currentAttendance}</tbody>
              </table>
              {totalAttendancePages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span className="pagination-info">
                    Page {currentPage} of {totalAttendancePages}
                  </span>
                  <button
                    className="pagination-button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalAttendancePages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendance;
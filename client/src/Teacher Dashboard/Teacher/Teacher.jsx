import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UserContext } from '../../context/UserContext';
import { AppContext } from '../../context/AppContext';
import './Teacher.css';

const Teacher = () => {
  const { teacherData: teacher, teacherToken } = useContext(UserContext);
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  const [stats, setStats] = useState({
    attendanceRate: 0,
    totalSalary: 0,
    dueBalance: 0,
  });
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
  const [currentAttendancePage, setCurrentAttendancePage] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [currentTransactionPage, setCurrentTransactionPage] = useState(1);
  const [isMarking, setIsMarking] = useState(false);
  const attendancePerPage = 10;
  const transactionsPerPage = 5;

  // Greeting and time update
  useEffect(() => {
    const updateGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour < 12) setGreeting('Good Morning');
      else if (currentHour < 18) setGreeting('Good Afternoon');
      else setGreeting('Good Evening');
    };

    updateGreeting();
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      updateGreeting();
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Calculate basic stats
  useEffect(() => {
    if (teacher) {
      const totalClasses = teacher.attendance?.length || 0;
      const presentCount = teacher.attendance?.filter(
        (record) => record.status === 'Present'
      ).length || 0;
      const attendanceRate =
        totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0;

      setStats({
        attendanceRate: attendanceRate.toFixed(2),
        totalSalary: teacher.salary || 0,
        dueBalance: teacher.dueBalance || 0,
      });
    }
  }, [teacher]);

  // Fetch attendance history
  const fetchAttendanceHistory = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/teacher/attendance-history`, {
        headers: {
          Authorization: `Bearer ${teacherToken}`,
        },
      });
      const data = await response.json();
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

  // Mark attendance
  const handleMarkAttendance = async () => {
    setIsMarking(true);
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation not supported');
      }

      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

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

  // Acknowledge salary
  const handleAcknowledgeSalary = async (transactionId) => {
    try {
      const response = await fetch(`${backendUrl}/api/teacher/acknowledge-salary/${transactionId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${teacherToken}` },
      });
      const data = await response.json();
      if (data.success) {
        setTransactions((prev) =>
          prev.map((transaction) =>
            transaction._id === transactionId
              ? { ...transaction, acknowledged: true, acknowledgedOn: new Date().toISOString() }
              : transaction
          )
        );
        toast.success('Salary transaction acknowledged successfully!');
      } else {
        toast.error('Failed to acknowledge salary: ' + data.message);
      }
    } catch (error) {
      console.error('Error acknowledging salary:', error);
      toast.error('Error acknowledging salary.');
    }
  };

  // Authentication check and fetch data
  useEffect(() => {
    if (!teacherToken) {
      navigate('/login/teacher');
    } else {
      fetchAttendanceHistory();
      if (teacher && teacher.transactions) {
        setTransactions(teacher.transactions);
      }
    }
  }, [teacherToken, teacher, navigate]);

  // Filter attendance
  useEffect(() => {
    const filtered = filterAttendanceByMonth(attendance);
    setFilteredAttendance(filtered);
    calculateAttendanceStats(filtered);
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

  // Date formatting
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

  const formatMonth = (yearMonth) => {
    if (!yearMonth || !/^\d{4}-\d{2}$/.test(yearMonth)) {
      return 'N/A';
    }
    const [year, month] = yearMonth.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  };

  const formatFullDate = (isoDate) => {
    if (!isoDate) return 'N/A';
    return new Date(isoDate).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  const formattedDate = `${currentTime.toLocaleString('default', {
    weekday: 'long',
  })}, ${currentTime.getDate()}${getDaySuffix(
    currentTime.getDate()
  )} ${currentTime.toLocaleString('default', {
    month: 'long',
  })} ${currentTime.getFullYear()}`;

  // Attendance pagination
  const indexOfLastAttendance = currentAttendancePage * attendancePerPage;
  const indexOfFirstAttendance = indexOfLastAttendance - attendancePerPage;
  const currentAttendance = filteredAttendance
    .slice(indexOfFirstAttendance, indexOfLastAttendance)
    .filter((record) => record && record.date && record.status && record._id)
    .map((record) => (
      <tr key={record._id} className="hover:bg-gray-50">
        <td className="py-3 px-4">{formatDateKolkata(record.date)}</td>
        <td className="py-3 px-4">
          <span className={`status-badge status-${record.status.toLowerCase()}`}>
            {record.status}
          </span>
        </td>
        <td className="py-3 px-4">{record.markedBy === 'Admin' ? 'Admin' : 'You'}</td>
      </tr>
    ));

  const totalAttendancePages = Math.ceil(filteredAttendance.length / attendancePerPage);

  // Transaction pagination
  const indexOfLastTransaction = currentTransactionPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalTransactionPages = Math.ceil(transactions.length / transactionsPerPage);

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

  if (!teacherToken) return null;
  if (!teacher) return <div className="text-center py-10">Loading teacher data...</div>;

  return (
    <div className="home-container">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <div className="welcome-text">
            <h1 className="text-4xl font-bold">
              {greeting}, <span className="teacher-name">{teacher?.name || 'Teacher'}</span>
            </h1>
            <p className="date-display">{formattedDate}</p>
          </div>
           <div className="mb-4">
            <button
              className={`mark-attendance-button bg-[#E94560] text-white px-4 py-2 rounded-md hover:bg-[#d43c55] transition-colors ${
                isMarking || isMarkedToday() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={handleMarkAttendance}
              disabled={isMarking || isMarkedToday()}
            >
              {isMarking ? 'Marking...' : "Mark Today's Attendance"}
            </button>
          </div>
          <div className="teacher-profile">
            <img
              src={teacher?.image || '/user.jpg'}
              alt="Teacher"
              className="welcome-profile-pic"
              onError={(e) => (e.target.src = '/user.jpg')}
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stat-card attendance-card">
          <div className="stat-icon">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="stat-content">
            <h3>Attendance Rate</h3>
            <div className="stat-value">
              <span className="stat-number">{stats.attendanceRate}%</span>
            </div>
            <div className="stat-progress">
              <div className="progress-bar" style={{ width: `${stats.attendanceRate}%` }}></div>
            </div>
          </div>
        </div>
        <div className="stat-card salary-card">
          <div className="stat-icon">
            <i className="fas fa-money-bill-wave"></i>
          </div>
          <div className="stat-content">
            <h3>Last Salary</h3>
            <div className="stat-value">
              <span className="currency">₹</span>
              <span className="stat-number">{stats.totalSalary.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="stat-card balance-card">
          <div className="stat-icon">
            <i className="fas fa-wallet"></i>
          </div>
          <div className="stat-content">
            <h3>Due Balance</h3>
            <div className="stat-value">
              <span className="stat-number">₹{stats.dueBalance.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Section */}
      <div className="dashboard-content">
        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="text-xl font-semibold">Attendance</h2>
          </div>
         
          <div className="attendance-filter-container flex gap-4 mb-4">
            <div className="attendance-filter">
              <label htmlFor="month-filter" className="block text-sm font-medium mb-1">
                Month
              </label>
              <select
                id="month-filter"
                className="attendance-select border rounded-md p-2"
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
              <label htmlFor="year-filter" className="block text-sm font-medium mb-1">
                Year
              </label>
              <select
                id="year-filter"
                className="attendance-select border rounded-md p-2"
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
          <div className="attendance-stats-container grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            <div className="attendance-stat-card flex items-center gap-3 p-3 bg-white rounded-md shadow-sm">
              <i className="fas fa-calendar stat-icon"></i>
              <div>
                <h4 className="text-sm font-medium text-gray-600">Total Days</h4>
                <span className="text-lg font-bold">{attendanceStats.totalDays}</span>
              </div>
            </div>
            <div className="attendance-stat-card flex items-center gap-3 p-3 bg-white rounded-md shadow-sm">
              <i className="fas fa-check-circle stat-icon"></i>
              <div>
                <h4 className="text-sm font-medium text-gray-600">Present</h4>
                <span className="text-lg font-bold">{attendanceStats.present}</span>
              </div>
            </div>
            <div className="attendance-stat-card flex items-center gap-3 p-3 bg-white rounded-md shadow-sm">
              <i className="fas fa-times-circle stat-icon"></i>
              <div>
                <h4 className="text-sm font-medium text-gray-600">Absent</h4>
                <span className="text-lg font-bold">{attendanceStats.absent}</span>
              </div>
            </div>
            <div className="attendance-stat-card flex items-center gap-3 p-3 bg-white rounded-md shadow-sm">
              <i className="fas fa-clock stat-icon"></i>
              <div>
                <h4 className="text-sm font-medium text-gray-600">Late</h4>
                <span className="text-lg font-bold">{attendanceStats.late}</span>
              </div>
            </div>
            <div className="attendance-stat-card flex items-center gap-3 p-3 bg-white rounded-md shadow-sm">
              <i className="fas fa-percentage stat-icon"></i>
              <div>
                <h4 className="text-sm font-medium text-gray-600">Attendance %</h4>
                <span className="text-lg font-bold">{attendanceStats.percentage}%</span>
              </div>
            </div>
          </div>
          <div className="attendance-table-container">
            <h4 className="text-lg font-medium mb-3">Attendance History</h4>
            {filteredAttendance.length === 0 ? (
              <p className="no-records-message text-gray-600 text-center py-4">
                {attendance.length > 0
                  ? 'No attendance records found for this period.'
                  : 'No attendance records available.'}
              </p>
            ) : (
              <>
                <table className="teacher-attendance-table w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-3 px-4 text-left">Date</th>
                      <th className="py-3 px-4 text-left">Status</th>
                      <th className="py-3 px-4 text-left">Marked By</th>
                    </tr>
                  </thead>
                  <tbody>{currentAttendance}</tbody>
                </table>
                {totalAttendancePages > 1 && (
                  <div className="pagination flex justify-center gap-4 mt-4">
                    <button
                      className="pagination-button px-4 py-2 bg-[#E94560] text-white rounded-md hover:bg-[#d43c55] disabled:opacity-50"
                      onClick={() => setCurrentAttendancePage(currentAttendancePage - 1)}
                      disabled={currentAttendancePage === 1}
                    >
                      Previous
                    </button>
                    <span className="pagination-info self-center">
                      Page {currentAttendancePage} of {totalAttendancePages}
                    </span>
                    <button
                      className="pagination-button px-4 py-2 bg-[#E94560] text-white rounded-md hover:bg-[#d43c55] disabled:opacity-50"
                      onClick={() => setCurrentAttendancePage(currentAttendancePage + 1)}
                      disabled={currentAttendancePage === totalAttendancePages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Salary Section */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="text-xl font-semibold">Salary Transactions</h2>
          </div>
          {transactions.length === 0 ? (
            <p className="no-records-message text-gray-600 text-center py-4">
              No salary transactions found.
            </p>
          ) : (
            <>
              <table className="teacher-salary-table w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-4 text-left">Month</th>
                    <th className="py-3 px-4 text-left">Amount</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Acknowledged On</th>
                    <th className="py-3 px-4 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTransactions.map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">{formatMonth(transaction.paymentMonth)}</td>
                      <td className="py-3 px-4">₹{transaction.amount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`teacher-transaction-status ${transaction.status.toLowerCase()} inline-block px-2 py-1 rounded-md text-sm`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">{formatFullDate(transaction.createdAt)}</td>
                      <td className="py-3 px-4">{formatFullDate(transaction.acknowledgedOn)}</td>
                      <td className="py-3 px-4">
                        <button
                          className={`teacher-acknowledge-button px-4 py-2 rounded-md ${
                            transaction.acknowledged
                              ? 'bg-gray-300 cursor-not-allowed'
                              : 'bg-[#3ABEF9] text-white hover:bg-[#2a9be0]'
                          }`}
                          disabled={transaction.acknowledged}
                          onClick={() => handleAcknowledgeSalary(transaction._id)}
                        >
                          {transaction.acknowledged ? 'Acknowledged' : 'Acknowledge'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalTransactionPages > 1 && (
                <div className="pagination flex justify-center gap-4 mt-4">
                  <button
                    className="pagination-button px-4 py-2 bg-[#E94560] text-white rounded-md hover:bg-[#d43c55] disabled:opacity-50"
                    onClick={() => setCurrentTransactionPage(currentTransactionPage - 1)}
                    disabled={currentTransactionPage === 1}
                  >
                    Previous
                  </button>
                  <span className="pagination-info self-center">
                    Page {currentTransactionPage} of {totalTransactionPages}
                  </span>
                  <button
                    className="pagination-button px-4 py-2 bg-[#E94560] text-white rounded-md hover:bg-[#d43c55] disabled:opacity-50"
                    onClick={() => setCurrentTransactionPage(currentTransactionPage + 1)}
                    disabled={currentTransactionPage === totalTransactionPages}
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

export default Teacher;
import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../../context/UserContext';
import { AppContext } from '../../../context/AppContext';
import './Home.css';

const Home = () => {
  const { teacherData: teacher } = useContext(UserContext);
  const { backendUrl, teacherToken } = useContext(AppContext);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  const [stats, setStats] = useState({
    attendanceRate: 0,
    totalSalary: 0,
    dueBalance: 0,
    recentNotifications: [],
  });

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

  useEffect(() => {
    if (teacher) {
      const totalClasses = teacher.attendance.length;
      const presentCount = teacher.attendance.filter(
        (record) => record.status === 'Present'
      ).length;
      const attendanceRate =
        totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0;

      setStats((prevStats) => ({
        ...prevStats,
        attendanceRate: attendanceRate.toFixed(2),
        totalSalary: teacher.salary || 0,
        dueBalance: teacher.dueBalance || 0,
        recentNotifications: teacher.notifications?.slice().reverse() || [],
      }));
    }
  }, [teacher]);


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

  return (
    <div className="home-container">
      <div className="welcome-section">
        <div className="welcome-content">
          <div className="welcome-text">
            <h1>
              {greeting},{' '}
              <span className="teacher-name">
                {teacher?.name || 'Teacher'}
              </span>
            </h1>
            <p className="date-display">{formattedDate}</p>
          </div>
          <div className="teacher-profile">
            <img
              src={teacher?.image}
              alt="Teacher"
              className="welcome-profile-pic"
              onError={(e) => (e.target.src = '/user.jpg')}
            />
          </div>
        </div>
      </div>

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
              <div
                className="progress-bar"
                style={{ width: `${stats.attendanceRate}%` }}
              ></div>
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
              <span className="stat-number">
                {stats.totalSalary.toLocaleString()}
              </span>
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
              <span className="stat-number">
                ₹{stats.dueBalance.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-card notifications-list-card">
          <div className="card-header">
            <h2>Recent Notifications</h2>
          </div>

          <div className="notifications-list">
            {stats.recentNotifications.length > 0 ? (
              stats.recentNotifications.map((notification) => (
                <div
                  key={notification._id || notification.id}
                  className={`notification-item ${notification.read ? '' : 'unread'
                    }`}
                >
                  <div className="notification-content">
                    <p>{notification.message}</p>
                    <span className="notification-time">
                      {new Date(notification.createdAt).toDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data-message">No recent notifications</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
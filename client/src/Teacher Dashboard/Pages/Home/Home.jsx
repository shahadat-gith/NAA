import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../../context/UserContext';
import { AppContext } from '../../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import axios from 'axios';

const Home = () => {
  const { teacherData: teacher } = useContext(UserContext);
  const { backendUrl, teacherToken } = useContext(AppContext);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tasks,setTasks] = useState([])
  const [greeting, setGreeting] = useState('');
  const [stats, setStats] = useState({
    attendanceRate: 0,
    totalSalary: 0,
    dueBalance: 0,
    upcomingEvents: [],
    recentNotifications: [],
  });

  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/admin/get-events');
      if (response.data.success) {
        const sortedEvents = response.data.events.sort((a, b) => new Date(a.date) - new Date(b.date));
        setStats((prevStats) => ({
          ...prevStats,
          upcomingEvents: sortedEvents,
        }));
      }
    } catch (error) {
      console.log('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [backendUrl]);

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


   const fetchTasks = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/task/get-tasks/${teacher._id}`, {
          headers: { Authorization: `Bearer ${teacherToken}` },
        });
        if (response.data.success) {
          setTasks(response.data.tasks);
        } else {
          console.log('API Error:', response.data.message || 'Failed to load tasks.');
        }
      } catch (error) {
        console.error('Fetch Tasks Error:', error.message);
      }
    }

  useEffect(() => {
   fetchTasks()
  }, [teacher, teacherToken, backendUrl]);



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

  const formatDate = (dateStr) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
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

  const handleTaskClick = () => {
    navigate('/teacher/tasks');
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
              src={teacher.image}
              alt="Teacher"
              className="welcome-profile-pic"
              onError={(e) => (e.target.src = '/user.jpg')}
            />
            <div className="teacher-role">
              <span className="subject-badge">
                {teacher?.subject || 'Subject'}
              </span>
              <span className="role-badge">Teacher</span>
            </div>
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

        <div className="stat-card tasks-card" onClick={handleTaskClick}>
          <div className="stat-icon">
            <i className="fas fa-tasks"></i>
          </div>
          <div className="stat-content">
            <h3>Your Tasks</h3>
            <div className="stat-value">
              <span className="stat-number">
                {tasks?.length || 0}
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
        <div className="dashboard-card events-card">
          <div className="card-header">
            <h2>Upcoming Events</h2>
          </div>

          <div className="events-list">
            {stats.upcomingEvents.length > 0 ? (
              stats.upcomingEvents.map((event) => (
                <div key={event._id || event.id} className="event-item">
                  <div className="event-date">
                    <div className="event-calendar">
                      <span className="event-month">
                        {new Date(event.date).toLocaleString('default', {
                          month: 'short',
                        })}
                      </span>
                      <span className="event-day">
                        {new Date(event.date).getDate()}
                      </span>
                    </div>
                  </div>
                  <div className="event-details">
                    <h4 className="event-title">{event.title}</h4>
                    <div className="event-meta">
                      <span>
                        <i className="far fa-clock"></i>{' '}
                        {new Date(
                          '2000-01-01T' + event.time
                        ).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </span>
                      <span>
                        <i className="far fa-calendar"></i>{' '}
                        {formatDate(event.date)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data-message">No upcoming events</p>
            )}
          </div>
        </div>

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
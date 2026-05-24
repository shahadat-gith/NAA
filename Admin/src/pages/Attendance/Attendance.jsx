import React, { useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Attendance.css';
import { AdminContext } from '../../context/AdminContext';

const Attendance = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  // QR States
  const [qrDetails, setQrDetails] = useState(null);
  const [qrLoading, setQrLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Mock Attendance List State
  const [attendanceList, _setAttendanceList] = useState([
    {
      _id: "att001",
      teacherId: { _id: "t1", name: "Dr. Ramesh Sharma", department: "Computer Science" },
      date: new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }),
      checkInTime: "2026-05-24T09:15:00.000Z",
      status: "Present",
      note: "Scanned on-campus display board",
      markedBy: "Teacher",
      deviceInfo: { ipAddress: "192.168.1.45", userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS...)" }
    },
    {
      _id: "att002",
      teacherId: { _id: "t2", name: "Prof. Sunita Das", department: "Physics" },
      date: new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }),
      checkInTime: "2026-05-24T09:32:00.000Z",
      status: "Late",
      note: "Traffic delay at national highway detour",
      markedBy: "Teacher",
      deviceInfo: { ipAddress: "192.168.1.89", userAgent: "Mozilla/5.0 (Linux; Android 13...)" }
    },
    {
      _id: "att003",
      teacherId: { _id: "t3", name: "Amit Baruah", department: "Mathematics" },
      date: new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }),
      checkInTime: null,
      status: "On-Leave",
      note: "Casual Leave approved via Email",
      markedBy: "Admin",
      deviceInfo: { ipAddress: "", userAgent: "" }
    }
  ]);

  const fetchTodayQR = useCallback(async () => {
    try {
      setQrLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/attendance/get-qr`);
      if (data.success) {
        setQrDetails(data.qrdetails);
      }
    } catch (error) {
      console.log("No active QR found or error fetching:", error.response?.data?.message || error.message);
      setQrDetails(null);
    } finally {
      setQrLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchTodayQR();
  }, [fetchTodayQR]);

  const generateTodayQR = async () => {
    try {
      setActionLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/attendance/generate-qr`, 
        {}, 
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      
      if (data.success) {
        setQrDetails(data.qrdetails);
        alert("Daily Attendance QR Generated Successfully!");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to generate QR code");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Present':
        return 'status-present';
      case 'Late':
        return 'status-late';
      case 'On-Leave':
        return 'status-onleave';
      default:
        return 'status-default';
    }
  };

  const refreshAttendance = () => {
    console.log('Fetch today attendance history placeholder');
  };

  return (
    <div className="atd-dashboard-container">
      <div className="atd-max-width-wrapper">
        
        {/* HEADER SECTION */}
        <header className="atd-header-section">
          <h1 className="atd-main-title">Faculty Attendance Dashboard</h1>
        </header>

        {/* QR CODE CONTROL CENTER */}
        <section className="atd-panel-card">
          {qrLoading ? (
            <div className="atd-loading-center">
              <div className="atd-spinner"></div>
            </div>
          ) : qrDetails ? (
            <div className="atd-qr-active-layout">
              <div className="atd-qr-frame">
                <img 
                  src={qrDetails.qrCodeBase64} 
                  alt="Attendance QR" 
                />
              </div>
              <div className="atd-qr-meta">
                <span className="atd-badge-active">Today's QR</span>
                <p className="atd-qr-date">Date: {qrDetails.date}</p>
              </div>
            </div>
          ) : (
            <div className="atd-empty-qr-state">
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <h3>No QR Code is generated yet!</h3>
              <p>Generate Attendance QR for today.</p>
              <button
                type="button"
                onClick={generateTodayQR}
                disabled={actionLoading}
                className="atd-btn-primary"
              >
                {actionLoading ? 'Compiling Safe Hash...' : "Generate Today's Attendance QR"}
              </button>
            </div>
          )}
        </section>

        {/* LIVE ATTENDANCE SHEET */}
        <section className="atd-panel-card">
          <div className="atd-panel-header">
            <div>
              <h2>Daily Attendance Registry</h2>
              <p>Live processing metrics matching active shifts.</p>
            </div>
            <div className="atd-panel-actions">
              <span className="atd-total-count">
                Total Logged: {attendanceList.length}
              </span>
              <button
                type="button"
                className="atd-refresh-btn"
                onClick={refreshAttendance}
                disabled={actionLoading}
              >
                Refresh
              </button>
            </div>
          </div>

          <div className="atd-log-list">
            {attendanceList.map((record) => {
              const attendanceDate = new Date(record.date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short'
              });

              const attendanceTime = record.checkInTime
                ? new Date(record.checkInTime).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })
                : '-- : -- : --';

              return (
                <article key={record._id} className="atd-log-item">
                  <div className="atd-log-badge" aria-hidden="true"></div>
                  <div className="atd-log-body">
                    <div className="atd-log-meta">
                      <span>{attendanceDate}</span>
                      <span>•</span>
                      <span>{attendanceTime}</span>
                    </div>
                    <p className="atd-log-message">
                      <strong>{record.teacherId.name}</strong> marked attendance.
                    </p>
                  </div>
                  <span className={`status-badge ${getStatusStyle(record.status)}`}>
                    {record.status}
                  </span>
                </article>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Attendance;
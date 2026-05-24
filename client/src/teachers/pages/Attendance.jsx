import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Html5QrcodeScanner } from 'html5-qrcode';
import '../styles/Attendance.css';
import { AppContext } from '../../context/AppContext';
import { useContext } from 'react';

const Attendance = () => {
  const { backendUrl } = useContext(AppContext);

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [marking, setMarking] = useState(false);

  const scannerRef = useRef(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('teacher-token') : null;

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backendUrl]);

  const fetchHistory = async () => {
    if (!backendUrl) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${backendUrl}/api/attendance/history/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success) {
        setHistory(res.data.attendance || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  // Start QR Scanner
  const startScanning = () => {
    setScanning(true);

    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scannerRef.current = scanner;

    scanner.render(
      async (decodedText) => {
        // Stop scanning after successful scan
        scanner.clear();
        setScanning(false);

        try {
          const parsedData = JSON.parse(decodedText);
          if (parsedData.token && parsedData.date) {
            await markAttendance(parsedData.token);
          } else {
            alert("Invalid QR Code format");
          }
        } catch (e) {
          console.log(e)
          alert("Invalid QR Code");
        }
      },
      (error) => {
        console.warn(error);
      }
    );
  };

  // Stop Scanner
  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
    }
    setScanning(false);
  };

  // Mark Attendance after scanning
  const markAttendance = async (qrToken) => {
    setMarking(true);
    try {
      const res = await axios.post(
        `${backendUrl}/api/attendance/mark-attendance`,
        {
          token: qrToken,
          markedBy: "Teacher",
          status: "Present",
          note: "Scanned via mobile/web app",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        alert("✅ Attendance marked successfully!");
        fetchHistory(); // Refresh history
      }
    } catch (err) {
      const message = err.response?.data?.message || "Failed to mark attendance";
      alert(`❌ ${message}`);
    } finally {
      setMarking(false);
    }
  };

  return (
    <div className="teacher-attendance-page">
      <div className="teacher-attendance-header">
        <div>
          <h1>Attendance History</h1>
          <p className="teacher-sub">Your personal attendance logs</p>
        </div>
        <div className="teacher-att-actions">
          <button 
            className="teacher-btn primary" 
            onClick={startScanning}
            disabled={scanning || marking}
          >
            {marking ? "Marking..." : "Scan QR"}
          </button>
        </div>
      </div>

      <section className="teacher-att-card">
        {loading ? (
          <div className="teacher-loading">Loading attendance…</div>
        ) : error ? (
          <div className="teacher-error">{error}</div>
        ) : history.length === 0 ? (
          <div className="teacher-empty">No attendance records found.</div>
        ) : (
          <div className="teacher-log-list">
            {history.map((item) => {
              const date = new Date(item.date).toLocaleDateString('en-GB', { 
                day: '2-digit', 
                month: 'short',
                year: 'numeric'
              });
              const time = item.checkInTime
                ? new Date(item.checkInTime).toLocaleTimeString('en-IN', { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    hour12: true 
                  })
                : '-- : --';

              return (
                <div key={item._id} className="teacher-log-item">
                  <div className="teacher-log-left">
                    <div className="teacher-log-date">{date}</div>
                    <div className="teacher-log-time">{time}</div>
                  </div>
                  <div className="teacher-log-main">
                    <div className="teacher-log-text">Attendance Marked</div>
                    {item.note && <div className="teacher-log-note">{item.note}</div>}
                  </div>
                  <div className={`teacher-log-status ${item.status?.toLowerCase() || ''}`}>
                    {item.status || 'Present'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* QR Scanner Modal */}
      {scanning && (
        <div className="qr-scanner-modal">
          <div className="qr-scanner-overlay">
            <div className="qr-scanner-container">
              <h3>Scan Attendance QR Code</h3>
              <div id="reader" style={{ width: '100%', maxWidth: '400px', margin: '20px auto' }}></div>
              
              <button 
                className="teacher-btn cancel-btn" 
                onClick={stopScanning}
                style={{ marginTop: '15px' }}
              >
                Cancel Scanning
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
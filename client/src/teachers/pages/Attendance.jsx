import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Html5QrcodeScanner } from 'html5-qrcode';
import '../styles/Attendance.css';
import { AppContext } from '../../context/AppContext';
import { useContext } from 'react';
import toast, { Toaster } from 'react-hot-toast';

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
  }, [backendUrl]);

  const fetchHistory = async () => {
    if (!backendUrl) return;
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/attendance/history/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success) {
        setHistory(res.data.attendance || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const startScanning = () => {
    setScanning(true);
    // Increased delay to ensure modal + #reader div is fully rendered
    setTimeout(() => {
      initializeScanner();
    }, 500);
  };

  const initializeScanner = () => {
    const readerElement = document.getElementById("reader");
    if (!readerElement) {
      toast.error("Scanner container not found");
      setScanning(false);
      return;
    }

    if (scannerRef.current) {
      scannerRef.current.clear();
    }

    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 12,
        qrbox: { width: 280, height: 280 },
        aspectRatio: 1.0,
        rememberLastUsedCamera: true,
        showTorchButtonIfSupported: true,
      },
      false
    );

    scannerRef.current = scanner;

    scanner.render(
      async (decodedText) => {
        // Success
        scanner.clear();
        setScanning(false);
        try {
          const parsedData = JSON.parse(decodedText);
          if (parsedData.token) {
            toast.success("QR Code Detected!");
            await markAttendance(parsedData.token);
          } else {
            toast.error("Invalid QR Code");
          }
        } catch (e) {
          toast.error("Failed to read QR Code");
        }
      },
      (error) => {
        // Ignore continuous "NotFoundException" spam
        if (!error?.startsWith("NotFoundException")) {
          console.warn(error);
        }
      }
    );
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    setScanning(false);
  };

  const markAttendance = async (qrToken) => {
    setMarking(true);
    const toastId = toast.loading("Marking your attendance...");

    try {
      const res = await axios.post(
        `${backendUrl}/api/attendance/mark-attendance`,
        {
          token: qrToken,
          markedBy: "Teacher",
          status: "Present",
          note: "Scanned via app",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("✅ Attendance Marked Successfully!", { id: toastId });
        fetchHistory();
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to mark attendance";
      toast.error(`❌ ${msg}`, { id: toastId });
    } finally {
      setMarking(false);
    }
  };

  return (
    <div className="teacher-attendance-page">
      <Toaster position="top-center" richColors closeButton />

      <div className="teacher-attendance-header">
        <div>
          <h1>Attendance History</h1>
          <p className="teacher-sub">Your personal attendance logs</p>
        </div>
        <button 
          className="teacher-btn primary" 
          onClick={startScanning}
          disabled={scanning || marking}
        >
          {marking ? "Processing..." : "Scan QR Code"}
        </button>
      </div>

      <section className="teacher-att-card">
        {loading ? (
          <div className="teacher-loading">Loading attendance history...</div>
        ) : error ? (
          <div className="teacher-error">{error}</div>
        ) : history.length === 0 ? (
          <div className="teacher-empty">No records found yet.</div>
        ) : (
          <div className="teacher-log-list">
            {history.map((item) => (
              <div key={item._id} className="teacher-log-item">
                <div className="teacher-log-left">
                  <div className="teacher-log-date">
                    {new Date(item.date).toLocaleDateString('en-GB', { 
                      day: '2-digit', month: 'short', year: 'numeric' 
                    })}
                  </div>
                  <div className="teacher-log-time">
                    {item.checkInTime 
                      ? new Date(item.checkInTime).toLocaleTimeString('en-IN', { 
                          hour: '2-digit', minute: '2-digit', hour12: true 
                        })
                      : '-- : --'
                    }
                  </div>
                </div>
                <div className="teacher-log-main">
                  <div className="teacher-log-text">Attendance Marked</div>
                  {item.note && <div className="teacher-log-note">{item.note}</div>}
                </div>
                <div className={`teacher-log-status ${item.status?.toLowerCase() || 'present'}`}>
                  {item.status || 'Present'}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* QR Scanner Modal */}
      {scanning && (
        <div className="qr-scanner-modal">
          <div className="qr-scanner-overlay">
            <div className="qr-scanner-container">
              <h3>Scan Attendance QR Code</h3>
              <div id="reader" style={{ width: "100%", maxWidth: "420px", margin: "20px auto" }}></div>
              
              <button 
                className="teacher-btn cancel-btn" 
                onClick={stopScanning}
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
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../styles/Attendance.css";
import { AppContext } from "../../context/AppContext";
import { useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import ScannerModal from "../components/ScannerModal";
import { BsQrCodeScan } from "react-icons/bs";
import Calendar from "../components/Calendar";
import Loader from "../../components/Loader/Loader";

const Attendance = () => {
  const { backendUrl } = useContext(AppContext);

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [marking, setMarking] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const token = localStorage.getItem("teacher-token");

  // Fetch Attendance for Selected Month
  const fetchMonthlyAttendance = useCallback(async () => {
    if (!backendUrl) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${backendUrl}/api/attendance/history/me`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          month: selectedMonth + 1,
          year: selectedYear,
        },
      });

      if (res.data?.success) {
        setHistory(res.data.attendance || []);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      setError(errorMsg);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [backendUrl, token, selectedMonth, selectedYear]);

  // Hook into timeline state mutations
  useEffect(() => {
    fetchMonthlyAttendance();
  }, [fetchMonthlyAttendance]);

  // Scan and register check-in token strings
  const markAttendance = async (qrToken) => {
    setMarking(true);
    try {
      const res = await axios.post(`${backendUrl}/api/attendance/mark-attendance`,
        {
          token: qrToken,
          markedBy: "Teacher",
          status: "Present",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Attendance Marked!")
        setHistory(res.data.attendance || []);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to mark attendance";
      toast.error(msg);
    } finally {
      setMarking(false);
    }
  };

// 1. Get today's date elements
const today = new Date();
const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

// Check if any single record in the history array matches today's date string
const isTodayAttendanceMarked = history.some((att) => att.date === todayStr);

  return (
    <div className="teacher-attendance-page">
      {/* Control Top Header */}
      <div className="teacher-attendance-header">
        <div>
          <h1>Attendance</h1>
          <p className="teacher-sub font-medium">Monthly Overview</p>
        </div>

        <button
          className="teacher-scan-icon-btn"
          onClick={() => setShowScanner(true)}
          disabled={marking || isTodayAttendanceMarked}
          aria-label="Scan QR Code"
        >
          <BsQrCodeScan size={24} />
        </button>
      </div>

      {/* Loading Ring */}
      {loading && <Loader text="Loading attendance records..." />}

      {/* Network Alert Message */}
      {error && !loading && (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      )}

      {/* Integrated Workspace Module */}
      {!loading && !error && (
        <div className="calendar-container-pane">
          <Calendar
            history={history}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
          />
        </div>
      )}

      {/* Scanner Overlay */}
      <ScannerModal
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScanSuccess={markAttendance}
      />
    </div>
  );
};

export default Attendance;
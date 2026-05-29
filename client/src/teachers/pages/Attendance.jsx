import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../styles/Attendance.css";
import { AppContext } from "../../context/AppContext";
import { useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import ScannerModal from "../components/ScannerModal";
import { BsQrCodeScan } from "react-icons/bs";
import Calendar from "../components/Calendar";
import { useOutletContext } from "react-router-dom";
import AttendanceHistory from "../components/AttendanceHistory";

const Attendance = () => {
  const { backendUrl } = useContext(AppContext);
  const { loading, setLoading } = useOutletContext();
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [marking, setMarking] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const token = localStorage.getItem("teacher-token");

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
  }, [backendUrl, token, selectedMonth, selectedYear, setLoading]);

  useEffect(() => {
    fetchMonthlyAttendance();
  }, [fetchMonthlyAttendance]);

  const markAttendance = async (qrToken) => {
    setMarking(true);
    try {
      const res = await axios.post(
        `${backendUrl}/api/attendance/mark-attendance`,
        {
          token: qrToken,
          markedBy: "Teacher",
          status: "Present",
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success) {
        toast.success("Attendance Marked!");
        setHistory(res.data.attendance || []);
        setShowScanner(false);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to mark attendance";
      toast.error(msg);
    } finally {
      setMarking(false);
    }
  };

  const getTodayISTString = () => {
    return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  };

  const isTodayAttendanceMarked = history.some((att) => {
    if (!att.date) return false;
    const dbDateString = att.date.split("T")[0];
    return dbDateString === getTodayISTString();
  });

  return (
    <div className="teacher-attendance-page">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="teacher-attendance-header">
        <div>
          <h1>Attendance</h1>
          <p className="teacher-sub font-medium">Monthly Overview</p>
        </div>

        <button
          className={`teacher-scan-icon-btn ${isTodayAttendanceMarked ? "disabled-btn-style" : ""}`}
          onClick={() => setShowScanner(true)}
          disabled={marking || isTodayAttendanceMarked}
          aria-label="Scan QR Code"
        >
          <BsQrCodeScan size={24} />
        </button>
      </div>

      {error && !loading && (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      )}

      {/* REFACTORED: 50/50 Card Grid with Mobile Re-ordering */}
      {!loading && !error && (
        <div className="attendance-workspace-grid">
          {/* Card 1: Calendar Card Section */}
          <Calendar
            history={history}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
          />

          {/* Card 2: History Log Card Section */}
          <AttendanceHistory history={history} />
        </div>
      )}

      <ScannerModal
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScanSuccess={markAttendance}
      />
    </div>
  );
};

export default Attendance;

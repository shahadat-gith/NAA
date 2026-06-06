import React, { useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./Attendance.css";
import { AdminContext } from "../../context/AdminContext";
import toast from "react-hot-toast";
import Loader from "../../components/Loader/Loader";
import AttendanceLogs from "./AttendanceLogs";

const Attendance = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  // Core Aggregation States
  const [qrDetails, setQrDetails] = useState(null);
  const [qrLoading, setQrLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [attendanceList, setAttendanceList] = useState([]);

  // Local calculation wrapper matching Asia/Kolkata context formats ("YYYY-MM-DD")
  const getTodayDateString = () => {
    return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  };

  /* ================= VALIDATE QR SESSION WITHOUT TIMEZONE DRIFTING ================= */
  const isQrValid = (qrDoc) => {
    if (!qrDoc || qrDoc.isExpired) return false;
    
    // Safely parse backend timestamp into an explicit localized date string match
    if (!qrDoc.date) return false;
    const backendDateString = new Date(qrDoc.date).toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });
    
    return backendDateString === getTodayDateString();
  };

  /* ================= FETCH DASHBOARD ATTENDANCE DETAILS ================= */
  const fetchDashboardDetails = useCallback(async () => {
    try {
      setQrLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/api/attendance/today-dashboard-details`,
        { headers: { Authorization: `Bearer ${adminToken}` } },
      );

      if (data.success) {
        setQrDetails(data.qrdetails);
        setAttendanceList(data.attendance);
      }
    } catch (error) {
      console.error("Dashboard fetching runtime exception:", error);
      setQrDetails(null);
    } finally {
      setQrLoading(false);
    }
  }, [backendUrl, adminToken]);

  useEffect(() => {
    fetchDashboardDetails();
  }, [fetchDashboardDetails]);

  /* ================= GENERATE NEW DAILY QR SESSION ================= */
  const generateTodayQR = async () => {
    try {
      setActionLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/attendance/generate-qr`,
        {},
        { headers: { Authorization: `Bearer ${adminToken}` } },
      );

      if (data.success) {
        setQrDetails(data.qrdetails);
        toast.success("QR Generated successfully!");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to generate QR code",
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* ================= MANUALLY EXPIRE ACTIVE QR SESSION ================= */
  const expireActiveQR = async () => {
    try {
      setActionLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/attendance/expire-qr`,
        {},
        { headers: { Authorization: `Bearer ${adminToken}` } },
      );

      if (data.success) {
        // Correctly updates local state immutably 
        setQrDetails((prev) => (prev ? { ...prev, isExpired: true } : null));
        toast.success("QR session expired!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to expire QR code");
    } finally {
      setActionLoading(false);
    }
  };

  if (qrLoading) {
    return <Loader text="Loading dashboard metrics..." />;
  }

  return (
    <div className="atd-dashboard-container">
      <div className="atd-max-width-wrapper">
        
        {/* HEADER SECTION */}
        <header className="atd-header-section">
          <h1 className="atd-main-title">Attendance Dashboard</h1>
        </header>

        {/* QR CODE CONTROL CENTER */}
        <section className="atd-panel-card">
          {isQrValid(qrDetails) ? (
            <div className="atd-qr-active-layout">
              <div className="atd-qr-frame">
                <img src={qrDetails.qrCodeBase64} alt="Attendance QR" />
              </div>
              <div className="atd-action-row">
                <button
                  type="button"
                  onClick={expireActiveQR}
                  disabled={actionLoading}
                  className="atd-btn-danger"
                >
                  {actionLoading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin m-right"></i>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-power-off m-right"></i>
                      Expire QR
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={generateTodayQR}
                  disabled={actionLoading}
                  className="atd-btn-secondary"
                >
                  <i className="fa-solid fa-rotate m-right"></i>
                  Regenerate QR
                </button>
              </div>
            </div>
          ) : (
            <div className="atd-empty-qr-state">
              <div className="atd-empty-qr-icon-wrapper">
                <i className="fa-solid fa-qrcode fa-3x"></i>
              </div>
              <h3>No Active QR Code Session Found for Today!</h3>
              <p>
                The scan verification window is closed. Click the button below to instantiate today's attendance matrix.
              </p>
              <button
                type="button"
                onClick={generateTodayQR}
                disabled={actionLoading}
                className="atd-btn-primary"
              >
                {actionLoading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin m-right"></i>
                    generating...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-wand-magic-sparkles m-right"></i>
                    Generate QR
                  </>
                )}
              </button>
            </div>
          )}
        </section>

        {/* REFACTORED ISOLATED LOG COMPONENT */}
        <AttendanceLogs
          attendanceList={attendanceList}
          onRefresh={fetchDashboardDetails}
          actionLoading={actionLoading}
        />
      </div>
    </div>
  );
};

export default Attendance;
import React, { useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-hot-toast";
import Loader from "../../components/common/Loader";
import AttendanceLogs from "./AttendanceLogs";
import { QrCode, Power, RefreshCw, Users, Calendar, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Attendance = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);
  const navigate = useNavigate();

  const [qrDetails, setQrDetails] = useState(null);
  const [qrLoading, setQrLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [attendanceList, setAttendanceList] = useState([]);

  const getTodayDateString = () => {
    return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  };

  const isQrValid = (qrDoc) => {
    if (!qrDoc || qrDoc.isExpired) return false;
    if (!qrDoc.date) return false;

    const backendDateString = new Date(qrDoc.date).toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });
    return backendDateString === getTodayDateString();
  };

  const fetchDashboardDetails = useCallback(async () => {
    try {
      setQrLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/api/attendance/today-dashboard-details`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      if (data.success) {
        setQrDetails(data.qrdetails);
        setAttendanceList(data.attendance || []);
      }
    } catch (error) {
      console.error("Error fetching attendance dashboard:", error);
      setQrDetails(null);
    } finally {
      setQrLoading(false);
    }
  }, [backendUrl, adminToken]);

  useEffect(() => {
    fetchDashboardDetails();
  }, [fetchDashboardDetails]);

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
        toast.success("Today's QR Code generated successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate QR code");
    } finally {
      setActionLoading(false);
    }
  };

  const expireActiveQR = async () => {
    try {
      setActionLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/attendance/expire-qr`,
        {},
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      if (data.success) {
        setQrDetails((prev) => (prev ? { ...prev, isExpired: true } : null));
        toast.success("QR Code session has been expired.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to expire QR code");
    } finally {
      setActionLoading(false);
    }
  };

  const goToStaffDashboard = () => {
    navigate("/attendance/dashboard");
  };

  if (qrLoading) {
    return <Loader text="Loading attendance dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[var(--color-primary-subtle)] flex items-center justify-center text-[var(--color-primary)] border border-[var(--border-default)]">
              <Users size={28} />
            </div>
            <div>
              <h1 className="text-1.5xl md:text-3xl font-bold">Attendance Dashboard</h1>
            </div>
          </div>

          {/* Link to Staff List Dashboard */}
          <button
            onClick={goToStaffDashboard}
            className="flex items-center gap-2 px-5 py-3 bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-2xl text-sm font-semibold transition-all hover:border-[var(--color-primary)] group"
          >
            Dashboard
            <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* QR Code Management Panel */}
          <div className="lg:col-span-5">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-1.5xl md:text-2xl font-semibold">Today's QR Code</h2>
              </div>

              {isQrValid(qrDetails) ? (
                <div className="space-y-8">
                  <div className="flex justify-center bg-white p-6 rounded-2xl border border-[var(--border-default)]">
                    <img
                      src={qrDetails.qrCodeBase64}
                      alt="Today's Attendance QR"
                      className="w-64 h-64 object-contain"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={expireActiveQR}
                      disabled={actionLoading}
                      className="flex items-center justify-center gap-2 py-4 px-6 rounded-2xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-semibold transition-all disabled:opacity-60"
                    >
                      <Power size={20} />
                      Expire QR
                    </button>

                    <button
                      onClick={generateTodayQR}
                      disabled={actionLoading}
                      className="flex items-center justify-center gap-2 py-4 px-6 rounded-2xl border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] font-semibold transition-all disabled:opacity-60"
                    >
                      <RefreshCw size={20} className={actionLoading ? "animate-spin" : ""} />
                      Regenerate
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-20 h-20 rounded-full bg-[var(--bg-base)] flex items-center justify-center mb-6 border border-[var(--border-default)]">
                    <QrCode size={42} className="text-[var(--text-muted)]" />
                  </div>
                  <h3 className="text-sm md:text-2xl font-semibold mb-3">No Active QR Code</h3>
                  <p className="text-[var(--text-secondary)] max-w-xs mx-auto mb-8">
                    Generate QR to start today's attendance marking session.
                  </p>

                  <button
                    onClick={generateTodayQR}
                    disabled={actionLoading}
                    className="w-full py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-bright)] text-white font-semibold rounded-2xl transition-all disabled:opacity-70 flex items-center justify-center gap-3"
                  >
                    {actionLoading ? (
                      <>
                        <RefreshCw size={20} className="animate-spin" />
                        Generating...
                      </>
                    ) : (
                     "Generate QR"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Live Attendance Logs */}
          <div className="lg:col-span-7">
            <AttendanceLogs
              attendanceList={attendanceList}
              onRefresh={fetchDashboardDetails}
              actionLoading={actionLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
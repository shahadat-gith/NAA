import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  ShieldAlert,
  Calendar,
  Clock,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import Loader from "../../components/common/Loader";
import { Button } from "../../components/common/Button.jsx";


const StaffAttendanceHistory = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);
  const location = useLocation()
  const { staffId } = location.state;

  const [profile, setProfile] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [submittingOverride, setSubmittingOverride] = useState(false);

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
  });
  const [endDate, setEndDate] = useState(() => 
    new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
  );

  // Fetch Staff Attendance History
  const fetchStaffHistory = useCallback(async () => {
    if (!staffId) return;

    try {
      setLoadingDetail(true);
      const { data } = await axios.get(
        `${backendUrl}/api/attendance/admin/staff-history/${staffId}?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );

      if (data?.success) {
        setProfile(data.profile);
        setLogs(data.logs || []);
      } else {
        toast.error(data?.message || "Failed to load attendance history.");
      }
    } catch (err) {
      console.error("Error fetching attendance history:", err);
      toast.error(err?.response?.data?.message || "Error loading attendance records.");
    } finally {
      setLoadingDetail(false);
    }
  }, [backendUrl, adminToken, staffId, startDate, endDate]);

  useEffect(() => {
    fetchStaffHistory();
  }, [fetchStaffHistory]);

  const handleOverrideSubmit = async (targetStatus) => {
    const todayIST = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

    try {
      setSubmittingOverride(true);
      const { data } = await axios.post(
        `${backendUrl}/api/attendance/admin/override-attendance`,
        { id: staffId, targetDate: todayIST, status: targetStatus },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      if (data?.success) {
        toast.success(`Staff marked as ${targetStatus} for today.`);
        fetchStaffHistory();
      } else {
        toast.error(data?.message || "Failed to update attendance.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update attendance record.");
    } finally {
      setSubmittingOverride(false);
    }
  };

  if(loadingDetail){
    return <Loader text="loading staff attedance history..."/>
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <div className="mx-auto">
        {/* Back Button & Header */}
        <div className="flex items-center gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Staff Details</h1>
            <p className="text-sm text-[var(--text-secondary)]">Attendance History</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Profile & Controls */}
          <div className="lg:col-span-5 space-y-6">
            {profile && (
              <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <img
                    src={profile?.image?.url || profile?.image || "/user.png"}
                    alt={profile.name}
                    className="w-20 h-20 rounded-2xl border border-[var(--border-default)] object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold truncate">{profile.name}</h2>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                      ID: {profile.staffId || "N/A"} • {profile.designation} ({profile.staffType})
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Manual Override */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShieldAlert size={18} className="text-[var(--color-primary-bright)]" />
                <h3 className="font-semibold text-lg">Manual Override</h3>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-5">
                Change today's attendance record
              </p>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  disabled={submittingOverride}
                  onClick={() => handleOverrideSubmit("Absent")}
                  className="py-4 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-950/50 text-red-500 font-semibold transition-all active:scale-95 disabled:opacity-60"
                >
                  Mark Absent
                </Button>
                <Button
                  disabled={submittingOverride}
                  onClick={() => handleOverrideSubmit("On-Leave")}
                  className="py-4 rounded-md border border-amber-500/30 bg-amber-500/10 hover:bg-amber-950/50 text-amber-500 font-semibold transition-all active:scale-95 disabled:opacity-60"
                >
                  Mark On Leave
                </Button>
              </div>
            </div>

            {/* Date Range */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={18} className="text-[var(--color-primary-bright)]" />
                <h3 className="font-semibold text-lg">Date Range</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">From</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border-default)] bg-[var(--bg-base)] focus:border-[var(--border-strong)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">To</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border-default)] bg-[var(--bg-base)] focus:border-[var(--border-strong)]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - History */}
          <div className="lg:col-span-7">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-lg">Attendance History</h3>
                <span className="text-xs px-3 py-1 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-full">
                  {logs.length} records
                </span>
              </div>

              {loadingDetail ? (
                <div className="flex-1 flex items-center justify-center">
                  <span className="so-spinner" />
                </div>
              ) : logs.length > 0 ? (
                <div className="space-y-3 overflow-auto flex-1 custom-scroll">
                  {logs.map((log) => {
                    const status = log.status || "Present";
                    return (
                      <div
                        key={log._id}
                        className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-default)]"
                      >
                        <div>
                          <div className="font-semibold">
                            {new Date(log.date).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                          <div className="text-sm text-[var(--text-secondary)] mt-1">
                            Marked by: <span className="font-medium">{log.markedBy || "System"}</span>
                          </div>
                        </div>

                        <span
                          className={`px-4 py-1.5 rounded-2xl text-sm font-semibold border ${
                            status === "Present"
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                              : status === "Absent"
                              ? "bg-red-500/10 border-red-500/30 text-red-500"
                              : "bg-amber-500/10 border-amber-500/30 text-amber-500"
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
                  <Clock size={48} className="text-[var(--text-muted)] mb-4" />
                  <h4 className="text-xl font-semibold mb-2">No Records Found</h4>
                  <p className="text-[var(--text-secondary)]">No attendance records in selected date range.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffAttendanceHistory;
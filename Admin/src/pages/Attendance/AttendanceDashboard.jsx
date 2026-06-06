import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
} from "react";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Search, Users, Eye, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/common/Loader";

const AttendanceDashboard = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);
  const navigate = useNavigate();

  const [staffList, setStaffList] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All"); // All, Teaching, Non-Teaching

  // Fetch Staff List with Monthly Attendance Stats
  useEffect(() => {
    const fetchStaffList = async () => {
      try {
        setLoadingList(true);
        const { data } = await axios.get(
          `${backendUrl}/api/attendance/admin/staff-list`,
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }
        );

        if (data?.success) {
          setStaffList(data.staff || []); 
        } else {
          toast.error(data?.message || "Failed to load staff list.");
        }
      } catch (err) {
        console.error("Error loading staff list:", err);
        toast.error(
          err?.response?.data?.message || "Network error loading staff list."
        );
      } finally {
        setLoadingList(false);
      }
    };

    if (backendUrl && adminToken) fetchStaffList();
  }, [backendUrl, adminToken]);

  // Combined Search + Filter
  const filteredStaff = useMemo(() => {
    let result = [...staffList];

    // Apply Type Filter
    if (activeFilter !== "All") {
      result = result.filter(
        (staff) =>
          staff.staffType?.toLowerCase() === activeFilter.toLowerCase()
      );
    }

    // Apply Search Query
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter(
        (staff) =>
          staff.name?.toLowerCase().includes(query) ||
          staff.staffId?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [searchQuery, staffList, activeFilter]);

  const handleViewHistory = (staffId) => {
    navigate("/attendance/dashboard/history", {
      state: {staffId}
    });
  };


  if(loadingList){
    return <Loader text="getting staffs..." />
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--color-primary-subtle)] flex items-center justify-center text-[var(--color-primary)] border border-[var(--border-default)]">
              <Users size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Staff Attendance</h1>
              <p className="text-[var(--text-secondary)]">
                Current Month Overview
              </p>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Type Filters */}
          <div className="flex gap-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl p-1">
            {["All", "Teaching", "Non-Teaching"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeFilter === filter
                    ? "bg-[var(--color-primary)] text-white shadow-sm"
                    : "hover:bg-[var(--bg-surface-2)] text-[var(--text-secondary)]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
              <Search size={20} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or staff ID..."
              className="w-full pl-12 pr-6 py-4 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl text-base focus:border-[var(--border-strong)] focus:ring-2 focus:ring-[var(--color-primary-glow)] outline-none transition-all"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl overflow-hidden shadow-sm">
          {loadingList ? (
            <div className="flex justify-center py-20">
              <span className="so-spinner" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead>
                  <tr className="border-b border-[var(--border-default)] bg-[var(--bg-surface-2)]">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      Staff
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      Present
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      Absent
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      On Leave
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      Attendance %
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-default)]">
                  {filteredStaff.length > 0 ? (
                    filteredStaff.map((staff) => {
                      const stats = staff.attendanceStats || {};
                      const totalDays = stats.totalDays || 0;
                      const presentDays = stats.presentDays || 0;
                      const attendancePercentage =
                        totalDays > 0
                          ? Math.round((presentDays / totalDays) * 100)
                          : 0;

                      return (
                        <tr
                          key={staff._id}
                          className="hover:bg-[var(--bg-surface-2)] transition-colors group cursor-pointer"
                          onClick={() => handleViewHistory(staff._id)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  staff?.image?.url ||
                                  staff?.image ||
                                  "/user.png"
                                }
                                alt={staff.name}
                                className="w-10 h-10 rounded-2xl object-cover border border-[var(--border-default)]"
                              />
                              <div>
                                <div className="font-semibold text-[var(--text-primary)]">
                                  {staff.name}
                                </div>
                                <div className="text-xs text-[var(--text-secondary)] flex items-center gap-2">
                                  {staff.staffId}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-sm font-semibold">
                              {presentDays}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-block px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-sm font-semibold">
                              {stats.absentDays || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-block px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-sm font-semibold">
                              {stats.onLeaveDays || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <span className="font-semibold text-lg">
                                {attendancePercentage}%
                              </span>
                              <div className="w-16 h-2 bg-[var(--bg-base)] rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-emerald-500 rounded-full transition-all"
                                  style={{ width: `${attendancePercentage}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              className="inline-flex items-center gap-2 px-5 py-2 bg-[var(--bg-base)] hover:bg-[var(--color-primary)] hover:text-white border border-[var(--border-default)] rounded-2xl text-sm font-semibold transition-all group-hover:border-[var(--color-primary)]"
                            >
                              <Eye size={16} />
                              View
                              <ChevronRight size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center">
                          <Users size={48} className="text-[var(--text-muted)] mb-4" />
                          <h3 className="text-xl font-semibold mb-2">No Staff Found</h3>
                          <p className="text-[var(--text-secondary)]">
                            No matching records found for the selected filter.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-4 text-center text-xs text-[var(--text-muted)]">
          Showing current month attendance • Click any row to view full history
        </div>
      </div>
    </div>
  );
};

export default AttendanceDashboard;
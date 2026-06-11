import React, { useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Search, Users, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { AdminContext } from "../../context/AdminContext";
import Loader from "../../components/common/Loader";
import { Button } from "../../components/common/Button";

const Staffs = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);
  const navigate = useNavigate();

  const [staffMembers, setStaffMembers] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  /* ================= FETCH STAFF ================= */
  const fetchStaffs = async () => {
    if (!adminToken) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/staff/all`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      if (data.success) {
        setStaffMembers(data.staffs || data.directory || []);
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast.error("Failed to load staff members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, [adminToken]);

  /* ================= FILTERED STAFF ================= */
  const filteredStaff = useMemo(() => {
    let result = [...staffMembers];

    if (roleFilter !== "All") {
      result = result.filter(
        (person) =>
          person.staffType?.toLowerCase() === roleFilter.toLowerCase(),
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (person) =>
          person.name?.toLowerCase().includes(term) ||
          person.staffId?.toLowerCase().includes(term),
      );
    }

    return result;
  }, [staffMembers, searchTerm, roleFilter]);

  const visibleStaffs = filteredStaff.slice(0, visibleCount);

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 10, staffMembers.length));
  };

  if (loading) {
    return <Loader text="Loading staff members..." />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <div className="max-w-7xl mx-auto md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">
              Staff Directory
            </h1>
            <p className="text-[var(--text-secondary)] mt-1">
              Manage all teaching and non-teaching staff
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Type Filters */}
          <div className="flex gap-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl p-1">
            {["All", "Teaching", "Non-Teaching"].map((filter) => (
              <button
                key={filter}
                onClick={() => setRoleFilter(filter)}
                className={`px-5 py-1 rounded-xl text-sm font-semibold transition-all ${
                  roleFilter === filter
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or staff ID..."
              className="w-full pl-12 pr-6 py-4 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl text-base focus:border-[var(--border-strong)] focus:ring-2 focus:ring-[var(--color-primary-glow)] outline-none transition-all"
            />
          </div>
        </div>
        {/* Results Count */}
        {staffMembers.length > 0 && (
          <div className="mb-6 text-[var(--text-secondary)]">
            Showing{" "}
            <span className="font-semibold text-[var(--text-primary)]">
              {visibleStaffs.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[var(--text-primary)]">
              {staffMembers.length}
            </span>{" "}
            images
          </div>
        )}

        {/* Table */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="border-b border-[var(--border-default)] bg-[var(--bg-surface-2)]">
                  <th className="px-6 py-5 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider w-2/5">
                    Staff
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Staff ID
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-default)]">
                {visibleStaffs.length > 0 ? (
                  visibleStaffs.map((staff) => (
                    <tr
                      key={staff._id}
                      onClick={() => navigate(`/staffs/${staff._id}`)}
                      className="hover:bg-[var(--bg-surface-2)] transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          {/* <div className="w-11 h-11 rounded-2xl overflow-hidden border border-[var(--border-default)] bg-[var(--bg-base)] flex-shrink-0">
                            <img
                              src={staff.image?.url || "/user.png"}
                              alt={staff.name}
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                          </div> */}
                          <div>
                            <div className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                              {staff.name}
                            </div>
                            <span
                              className={`inline-block mt-1 px-3 py-0.5 text-xs font-medium rounded-full border ${
                                staff.staffType?.toLowerCase() === "teaching"
                                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                                  : "bg-amber-500/10 border-amber-500/30 text-amber-500"
                              }`}
                            >
                              {staff.staffType || "Staff"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 font-mono text-[var(--text-secondary)] whitespace-nowrap">
                        {staff.staffId || "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <Users
                          size={48}
                          className="text-[var(--text-muted)] mb-4"
                        />
                        <h3 className="text-xl font-semibold">
                          No Staff Found
                        </h3>
                        <p className="text-[var(--text-secondary)] mt-2">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {visibleCount < staffMembers.length && (
          <div className="flex justify-center mt-8">
            <Button variant="primary" onClick={handleShowMore}>
              Show More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Staffs;

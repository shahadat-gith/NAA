import React, { useState, useEffect, useContext, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Search, Plus, Eye, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { AdminContext } from "../../context/AdminContext";
import Loader from "../../components/common/Loader";

const Admissions = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);
  const navigate = useNavigate();

  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState({
    class: "",
    medium: "",
    stream: "",
    status: "",
  });

  const classOptions = Array.from({ length: 12 }, (_, i) => String(i + 1));

  /* ================= FETCH ADMISSIONS ================= */
  const fetchAdmissions = async () => {
    if (!adminToken) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/admission/list`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      if (data.success) {
        setAdmissions(data.admissions || []);
      }
    } catch (error) {
      console.error("Error fetching admissions:", error);
      toast.error("Failed to load admissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, [adminToken]);

  /* ================= FILTERED DATA ================= */
  const filteredAdmissions = useMemo(() => {
    let result = [...admissions];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((a) =>
        a.name?.toLowerCase().includes(term)
      );
    }

    if (filters.class) {
      result = result.filter((a) => String(a.class) === String(filters.class));
    }

    if (filters.medium) {
      result = result.filter((a) => a.medium === filters.medium);
    }

    if (filters.stream) {
      result = result.filter((a) => a.stream === filters.stream);
    }

    if (filters.status) {
      result = result.filter((a) => (a.status || "pending") === filters.status);
    }

    return result;
  }, [admissions, searchTerm, filters]);

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({
      class: "",
      medium: "",
      stream: "",
      status: "",
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this admission?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${backendUrl}/api/admission/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      toast.success("Admission deleted successfully");
      fetchAdmissions();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting admission");
    }
  };

  if (loading) {
    return <Loader text="Loading admissions..." />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[var(--text-primary)]">Admissions</h1>
            <p className="text-[var(--text-secondary)] mt-1">Manage admission applications</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by student name..."
                  className="w-full pl-12 pr-6 py-4 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                />
              </div>
            </div>

            {/* Class */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Class</label>
              <select
                value={filters.class}
                onChange={(e) => setFilters({ ...filters, class: e.target.value, stream: "" })}
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
              >
                <option value="">All Classes</option>
                {classOptions.map((cls) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>

            {/* Medium */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Medium</label>
              <select
                value={filters.medium}
                onChange={(e) => setFilters({ ...filters, medium: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
              >
                <option value="">All Mediums</option>
                <option value="english">English</option>
                <option value="assamese">Assamese</option>
              </select>
            </div>

            {/* Stream (conditional) */}
            {(filters.class === "11" || filters.class === "12") && (
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Stream</label>
                <select
                  value={filters.stream}
                  onChange={(e) => setFilters({ ...filters, stream: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                >
                 <option value="">All Streams</option>
                <option value="arts">Arts</option>
                <option value="science">Science</option>
                </select>
              </div>
            )}

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <button
            onClick={clearFilters}
            className="mt-6 flex items-center gap-2 px-5 py-3 border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] rounded-2xl font-medium transition-all"
          >
            <X size={18} />
            Clear Filters
          </button>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-[var(--text-secondary)]">
          Showing <span className="font-semibold text-[var(--text-primary)]">{filteredAdmissions.length}</span> admissions
        </div>

        {/* Table */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="border-b border-[var(--border-default)] bg-[var(--bg-surface-2)]">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">#</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Class</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Medium</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Stream</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Applied On</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[var(--border-default)]">
                {filteredAdmissions.length > 0 ? (
                  filteredAdmissions.map((adm, index) => (
                    <tr key={adm._id} className="hover:bg-[var(--bg-surface-2)] transition-colors">
                      <td className="px-6 py-4 text-[var(--text-secondary)]">{index + 1}</td>
                      <td className="px-6 py-4 font-semibold text-[var(--text-primary)]">{adm.name}</td>
                      <td className="px-6 py-4">{adm.class}</td>
                      <td className="px-6 py-4 capitalize">{adm.medium}</td>
                      <td className="px-6 py-4 capitalize">{adm.stream || "—"}</td>
                      <td className="px-6 py-4 text-[var(--text-secondary)]">
                        {adm.createdAt
                          ? new Date(adm.createdAt).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => navigate(`/admissions/${adm._id}`)}
                            className="p-2 hover:bg-[var(--bg-surface-2)] rounded-xl transition-colors text-[var(--color-primary)]"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(adm._id)}
                            className="p-2 hover:bg-red-500/10 rounded-xl transition-colors text-red-500"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-20 text-center text-[var(--text-secondary)]">
                      No admissions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admissions;
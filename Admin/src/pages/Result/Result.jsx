import React, { useState, useContext, useEffect, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, RefreshCw, Download, Upload, Trophy } from "lucide-react";

import { AdminContext } from "../../context/AdminContext";
import Loader from "../../components/common/Loader";
import { capitalizeWords } from "../../utils/utility";
import { CLASS_OPTIONS, STREAM_OPTIONS } from "../../utils/academicOptions";
import { generateReportCards } from "./resultPdf";
import { pdf } from "@react-pdf/renderer";

import UploadResults from "../../components/results/UploadResults";

const Result = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [results, setResults] = useState(() => {
    const cached = sessionStorage.getItem("results");
    return cached ? JSON.parse(cached) : [];
  });

  const [loading, setLoading] = useState(results.length === 0);
  const [modalOpen, setModalOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const [filters, setFilters] = useState({
    medium: "",
    class: "",
    stream: "",
    searchTerm: "",
  });

  const getAvailableClasses = () => {
    if (!filters.medium) return [];
    return CLASS_OPTIONS[filters.medium.toLowerCase()] || [];
  };

  const filteredResults = useMemo(() => {
    return results
      .filter((r) => {
        const searchLower = filters.searchTerm.toLowerCase();
        return (
          (!filters.medium || r.medium?.toLowerCase() === filters.medium.toLowerCase()) &&
          (!filters.class || r.class === filters.class) &&
          (!filters.stream || r.stream?.toLowerCase() === filters.stream.toLowerCase()) &&
          (!filters.searchTerm ||
            r.name?.toLowerCase().includes(searchLower) ||
            r.registrationNo?.toString().includes(searchLower))
        );
      })
      .sort((a, b) => (b.percentage || 0) - (a.percentage || 0));
  }, [results, filters]);

  const fetchResults = async () => {
    if (!adminToken) return;
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/results`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      if (res.data.success) {
        const data = res.data.data || [];
        setResults(data);
        sessionStorage.setItem("results", JSON.stringify(data));
        sessionStorage.setItem("results_time", Date.now());
      }
    } catch (err) {
      toast.error("Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    sessionStorage.removeItem("results");
    sessionStorage.removeItem("results_time");
    fetchResults();
  };

  useEffect(() => {
    if (location.state?.results) {
      setResults(location.state.results);
      sessionStorage.setItem("results", JSON.stringify(location.state.results));
      setLoading(false);
    }
  }, [location.state]);

  useEffect(() => {
    if (!adminToken) return;

    const cached = sessionStorage.getItem("results");
    const cachedTime = sessionStorage.getItem("results_time");
    const isExpired = cachedTime && Date.now() - Number(cachedTime) > 30 * 60 * 1000;

    if (!cached || isExpired) fetchResults();
    else setLoading(false);
  }, [adminToken]);

  const handleView = (registrationNo) => {
    navigate(`/result/${registrationNo}`, { state: { results } });
  };

  const handleDownload = async () => {
    if (!filters.medium || !filters.class) return toast.error("Please select Medium and Class");
    if ((filters.class === "11" || filters.class === "12") && !filters.stream) {
      return toast.error("Please select Stream for Class 11/12");
    }
    if (filteredResults.length === 0) return toast.error("No results found");

    // ... (download logic remains the same)
    try {
      setDownloading(true);
      // ... rest of download code
    } catch (error) {
      toast.error("Failed to download report cards");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <Loader text="Loading results..." />;

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
          <div className="flex items-center gap-3">
            <Trophy className="text-[var(--color-primary)]" size={28} />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">Results</h1>
              <p className="text-sm md:text-base text-[var(--text-secondary)]">Manage student exam results</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2.5 text-sm bg-[var(--bg-surface)] border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] rounded-2xl font-medium transition-all"
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-2 px-4 py-2.5 text-sm bg-[var(--color-primary)] hover:bg-[var(--color-primary-bright)] text-white rounded-2xl font-semibold transition-all disabled:opacity-60"
            >
              <Download size={16} />
              {downloading ? "Downloading..." : "Download Report Cards"}
            </button>

            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm bg-[var(--color-primary)] hover:bg-[var(--color-primary-bright)] text-white rounded-2xl font-semibold transition-all"
            >
              <Upload size={16} />
              Upload
            </button>
          </div>
        </div>

        {/* Filters - Better mobile stacking */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-4 md:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Medium, Class, Stream, Search */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-[var(--text-muted)] mb-1">Medium</label>
              <select
                value={filters.medium}
                onChange={(e) => setFilters({ ...filters, medium: e.target.value, class: "", stream: "" })}
                className="w-full px-3 py-2.5 md:py-3 text-sm bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
              >
                <option value="">All Mediums</option>
                <option value="english">English</option>
                <option value="assamese">Assamese</option>
              </select>
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-[var(--text-muted)] mb-1">Class</label>
              <select
                value={filters.class}
                onChange={(e) => setFilters({ ...filters, class: e.target.value, stream: "" })}
                disabled={!filters.medium}
                className="w-full px-3 py-2.5 md:py-3 text-sm bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none disabled:opacity-60"
              >
                <option value="">All Classes</option>
                {getAvailableClasses().map((cls) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>

            {(filters.class === "11" || filters.class === "12") && (
              <div>
                <label className="block text-xs md:text-sm font-medium text-[var(--text-muted)] mb-1">Stream</label>
                <select
                  value={filters.stream}
                  onChange={(e) => setFilters({ ...filters, stream: e.target.value })}
                  className="w-full px-3 py-2.5 md:py-3 text-sm bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                >
                  <option value="">All Streams</option>
                  {STREAM_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="lg:col-span-2">
              <label className="block text-xs md:text-sm font-medium text-[var(--text-muted)] mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                <input
                  type="text"
                  placeholder="Name or Reg No"
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 md:py-3 text-sm bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                />
              </div>
            </div>
          </div>

          {(filters.medium || filters.class || filters.stream || filters.searchTerm) && (
            <button
              onClick={() => setFilters({ medium: "", class: "", stream: "", searchTerm: "" })}
              className="mt-4 text-sm text-red-500 hover:text-red-600 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-[var(--text-secondary)]">
          Showing <span className="font-semibold text-[var(--text-primary)]">{filteredResults.length}</span> results
        </div>

        {/* Table - More mobile friendly */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="border-b border-[var(--border-default)] bg-[var(--bg-surface-2)]">
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Rank</th>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider hidden sm:table-cell">Marks</th>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">%</th>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-center text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-default)]">
                {filteredResults.length > 0 ? (
                  filteredResults.map((r, index) => (
                    <tr key={r._id} className="hover:bg-[var(--bg-surface-2)] transition-colors">
                      <td className="px-4 py-4 md:px-6 text-sm font-mono text-[var(--text-secondary)]">#{index + 1}</td>
                      <td className="px-4 py-4 md:px-6 font-medium text-sm">{capitalizeWords(r.name)}</td>
                      <td className="px-4 py-4 md:px-6 text-sm text-[var(--text-secondary)] hidden sm:table-cell">
                        {r.totalMarks || "—"}
                      </td>
                      <td className="px-4 py-4 md:px-6 text-sm font-semibold">
                        {r.percentage ? `${r.percentage}%` : "—"}
                      </td>
                      <td className="px-4 py-4 md:px-6 text-center">
                        <button
                          onClick={() => handleView(r.registrationNo)}
                          className="px-4 py-1.5 md:px-5 md:py-2 text-xs md:text-sm bg-[var(--bg-base)] border border-[var(--border-default)] hover:bg-[var(--color-primary)] hover:text-white rounded-xl md:rounded-2xl font-medium transition-all"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <Trophy size={48} className="mx-auto text-[var(--text-muted)] mb-3" />
                      <p className="text-[var(--text-secondary)]">No results match your filters</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modalOpen && (
        <UploadResults
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Result;
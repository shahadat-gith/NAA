import React, { useState, useEffect, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Search, RefreshCw, Download, Upload, Trophy } from "lucide-react";

import { AdminContext } from "../../context/AdminContext";
import Loader from "../../components/common/Loader";
import { capitalizeWords } from "../../utils/utility";
import { CLASS_OPTIONS, STREAM_OPTIONS } from "../../utils/academicOptions";
import { generateReportCards } from "./resultPdf";
import { pdf } from "@react-pdf/renderer";
import { Button } from "../../components/common/Button";

const Result = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
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

  /* ================= FETCH RESULTS ================= */
  const fetchResults = async () => {
    if (!adminToken) return;
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/results`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      if (res.data.success) {
        setResults(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [adminToken]);

  const handleRefresh = () => {
    fetchResults();
  };

  const handleView = (registrationNo) => {
    navigate(`/result/${registrationNo}`);
  };

  /* ================= DOWNLOAD REPORT CARDS ================= */
  const handleDownload = async () => {
    if (!filters.medium || !filters.class) {
      return toast.error("Please select Medium and Class");
    }
    if ((filters.class === "11" || filters.class === "12") && !filters.stream) {
      return toast.error("Please select Stream for Class 11/12");
    }
    if (filteredResults.length === 0) {
      return toast.error("No results found for selected filters");
    }

    try {
      setDownloading(true);

      const settingsRes = await axios.get(`${backendUrl}/api/settings/`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      const principal = settingsRes.data?.success
        ? settingsRes.data.data?.authorities?.find(
            (a) => a.role?.toLowerCase() === "principal"
          )
        : null;

      const blob = await pdf(
        generateReportCards({
          results: filteredResults,
          principal,
        })
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `report_cards_${filters.class}_${filters.medium}${
        filters.stream ? `_${filters.stream}` : ""
      }.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      toast.success("Report cards downloaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to download report cards");
    } finally {
      setDownloading(false);
    }
  };

  const openUploadResults = () => {
    navigate("/actions?type=UploadResults");
  };

  if (loading) return <Loader text="Loading results..." />;

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
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
            <Button
              onClick={handleRefresh}
              variant="secondary"
            >
              Refresh
            </Button>

            <Button
              onClick={handleDownload}
              disabled={downloading}
              loading={downloading}
            >
              {downloading ? "Downloading" : "Download Reports"}
            </Button>

            <Button
              onClick={openUploadResults}
              variant="success"
            >
              Upload Results
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-4 md:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-[var(--text-muted)] mb-1">Medium</label>
              <select
                value={filters.medium}
                onChange={(e) => setFilters({ ...filters, medium: e.target.value, class: "", stream: "" })}
                className="w-full px-4 py-3 text-sm bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
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
                className="w-full px-4 py-3 text-sm bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none disabled:opacity-60"
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
                  className="w-full px-4 py-3 text-sm bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
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
                  className="w-full pl-10 pr-4 py-3 text-sm bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                />
              </div>
            </div>
          </div>

          {(filters.medium || filters.class || filters.stream || filters.searchTerm) && (
            <Button
              onClick={() => setFilters({ medium: "", class: "", stream: "", searchTerm: "" })}
              className="mt-4"
              variant="warning"
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Count */}
        <div className="mb-6 text-sm text-[var(--text-secondary)]">
          Showing <span className="font-semibold text-[var(--text-primary)]">{filteredResults.length}</span> results
        </div>

        {/* Table */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="border-b border-[var(--border-default)] bg-[var(--bg-surface-2)]">
                  <th className="px-4 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Rank</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Name</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider hidden sm:table-cell">Marks</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">%</th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-default)]">
                {filteredResults.length > 0 ? (
                  filteredResults.map((r, index) => (
                    <tr key={r._id} className="hover:bg-[var(--bg-surface-2)] transition-colors">
                      <td className="px-4 py-5 text-sm font-mono text-[var(--text-secondary)]">#{index + 1}</td>
                      <td className="px-4 py-5 font-medium">{capitalizeWords(r.name)}</td>
                      <td className="px-4 py-5 text-sm text-[var(--text-secondary)] hidden sm:table-cell">
                        {r.totalMarks || "—"}
                      </td>
                      <td className="px-4 py-5 text-sm font-semibold">
                        {r.percentage ? `${r.percentage}%` : "—"}
                      </td>
                      <td className="px-4 py-5 text-center">
                        <Button
                          onClick={() => handleView(r.registrationNo)}
                          variant="success"
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center">
                      <Trophy size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
                      <p className="text-[var(--text-secondary)]">No results match your filters</p>
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

export default Result;
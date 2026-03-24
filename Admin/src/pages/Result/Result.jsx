import React, { useContext, useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UploadResults from "./UploadResults";
import "./Styles/Result.css";
import toast from "react-hot-toast";
import Loader from "../../components/Loader/Loader";
import { AdminContext } from "../../context/AdminContext";
import { capitalizeWords } from "../../utils/utility";
import { CLASS_OPTIONS, STREAM_OPTIONS } from "../../utils/academicOptions";

const Result = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  // Filter states
  const [filters, setFilters] = useState({
    class: "",
    medium: "",
    stream: "",
    searchTerm: "", // Combined Name or RegNo search
  });

  const getAvailableClasses = () => {
    if (!filters.medium) return [];
    return CLASS_OPTIONS[filters.medium.toLowerCase()] || [];
  };

  /* ================= FILTER LOGIC ================= */
  const filteredResults = useMemo(() => {
    return results
      .filter((r) => {
        const searchLower = filters.searchTerm.toLowerCase();

        // Use optional chaining and nullish coalescing to prevent crashes
        return (
          (!filters.medium || r.medium?.toLowerCase() === filters.medium.toLowerCase()) &&
          (!filters.class || r.class === filters.class) &&
          (!filters.stream || r.stream?.toLowerCase() === filters.stream.toLowerCase()) &&
          (!filters.searchTerm ||
            r.name?.toLowerCase().includes(searchLower) ||
            r.registrationNo?.toString().includes(searchLower))
        );
      })
      .sort((a, b) => {
        // 1. Sort by Rank (Numeric)
        if (a.rank !== b.rank) return (a.rank || 999) - (b.rank || 999);

        // 2. Secondary sort by Name (Alphabetical)
        return (a.name || "").localeCompare(b.name || "");
      });
  }, [results, filters]);
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
      toast.error(err.response?.data?.message || "Unable to load results");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [adminToken]);

  const handleView = (registrationNo) => {
    navigate(`/result/${registrationNo}`);
  };

  if (loading) return <Loader text="Loading results..." />;

  return (
    <div className="result-page">
      <div className="result-header">
        <div>
          <h2>Results</h2>
          <p className="result-subtitle">Manage and upload student exam results.</p>
        </div>
        <button className="btn-primary" onClick={() => setModalOpen(true)}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v8M3.5 5.5L7 2l3.5 3.5M2 11h10"
              stroke="#EEEDFE" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Upload result
        </button>
      </div>

      {/* ================= FILTERS ================= */}
      <div className="result-filters">
        <div className="filter-row">
          <div className="filter-group">
            <label>Medium</label>
            <select
              value={filters.medium}
              onChange={(e) => setFilters({ ...filters, medium: e.target.value, class: "" })}
            >
              <option value="">All Mediums</option>
              <option value="english">English</option>
              <option value="assamese">Assamese</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Class</label>
            <select
              value={filters.class}
              onChange={(e) => setFilters({ ...filters, class: e.target.value })}
              disabled={!filters.medium}
            >
              <option value="">All Classes</option>
              {getAvailableClasses().map((cls) => (
                <option key={cls} value={cls}>
                  {capitalizeWords(cls)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Stream</label>
            <select
              value={filters.stream}
              onChange={(e) => setFilters({ ...filters, stream: e.target.value })}
            >
              <option value="">All Streams</option>
              {STREAM_OPTIONS.map((stream) => (
                <option key={stream} value={stream}>
                  {capitalizeWords(stream)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Search Name / RegNo</label>
            <input
              type="text"
              placeholder="Enter name or Reg No..."
              value={filters.searchTerm}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
            />
          </div>

          {(filters.medium || filters.class || filters.stream || filters.searchTerm) && (
            <button
              className="clear-filters-btn"
              onClick={() => setFilters({ class: "", medium: "", stream: "", searchTerm: "" })}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="result-list-container">
        {filteredResults.length > 0 ? (
          <table className="result-table">
            <thead>
              <tr>
                <th className="col-rank">Rank</th>
                <th className="col-name">Name</th>
                <th className="col-name">Total Marks</th>
                <th className="col-percent">Percentage</th>
                <th className="col-action">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((r) => (
                <tr key={r._id} className="result-row">
                  <td className="col-rank">#{r.rank}</td>
                  <td className="col-name">{capitalizeWords(r.name) || "-"}</td>
                  <td className="col-total">
                    {r.totalMarks
                      ? `${r.totalMarks} / ${r.maxMarksPerSubject * r.marks.length}`
                      : "Absent"}
                  </td>
                  <td className="col-percent">
                    {r.percentage !== 0
                      ? `${r.percentage}%`
                      : "Absent"}
                  </td>
                  <td className="col-action">
                    <button className="view-btn" onClick={() => handleView(r.registrationNo)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-results-box">
            <p className="no-results">No records match your filters.</p>
          </div>
        )}
      </div>

      {modalOpen && (
        <UploadResults
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={() => fetchResults()}
        />
      )}
    </div>
  );
};

export default Result;
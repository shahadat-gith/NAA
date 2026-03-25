import React, { useContext, useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import UploadResults from "./UploadResults";
import "./Styles/Result.css";
import Loader from "../../components/Loader/Loader";
import { AdminContext } from "../../context/AdminContext";
import { capitalizeWords } from "../../utils/utility";
import { CLASS_OPTIONS, STREAM_OPTIONS } from "../../utils/academicOptions";

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

  const [filters, setFilters] = useState({
    class: "",
    medium: "",
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
      .sort((a, b) => b.percentage - a.percentage);
  }, [results, filters]);

  /* ================= FETCH ================= */
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= REFRESH ================= */
  const handleRefresh = () => {
    sessionStorage.removeItem("results");
    sessionStorage.removeItem("results_time");
    fetchResults();
  };

  /* ================= LOAD ================= */
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

    const isExpired =
      cachedTime && Date.now() - Number(cachedTime) > 30 * 60 * 1000;

    if (!cached || isExpired) {
      fetchResults();
    } else {
      setLoading(false);
    }
  }, [adminToken]);

  /* ================= NAVIGATION ================= */
  const handleView = (registrationNo) => {
    navigate(`/result/${registrationNo}`, { state: { results } });
  };

  if (loading) return <Loader text="Loading results..." />;

  return (
    <div className="rp-result-page">
      <div className="rp-result-header">
        <div>
          <h2>Results</h2>
          <p className="rp-result-subtitle">
            Manage and upload student exam results.
          </p>
        </div>

        <div className="rp-header-actions">
          <button className="rp-btn-secondary" onClick={handleRefresh}>
            Refresh
          </button>

          <button
            className="rp-btn-primary"
            onClick={() => setModalOpen(true)}
          >
            Upload result
          </button>
        </div>
      </div>

      {/* ================= FILTERS ================= */}
      <div className="rp-result-filters">
        <div className="rp-filter-row">
          <div className="rp-filter-group">
            <label>Medium</label>
            <select
              value={filters.medium}
              onChange={(e) =>
                setFilters({ ...filters, medium: e.target.value, class: "" })
              }
            >
              <option value="">All Mediums</option>
              <option value="english">English</option>
              <option value="assamese">Assamese</option>
            </select>
          </div>

          <div className="rp-filter-group">
            <label>Class</label>
            <select
              value={filters.class}
              onChange={(e) =>
                setFilters({ ...filters, class: e.target.value })
              }
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

          <div className="rp-filter-group">
            <label>Stream</label>
            <select
              value={filters.stream}
              onChange={(e) =>
                setFilters({ ...filters, stream: e.target.value })
              }
            >
              <option value="">All Streams</option>
              {STREAM_OPTIONS.map((stream) => (
                <option key={stream} value={stream}>
                  {capitalizeWords(stream)}
                </option>
              ))}
            </select>
          </div>

          <div className="rp-filter-group">
            <label>Search Name / RegNo</label>
            <input
              type="text"
              placeholder="Enter name or Reg No..."
              value={filters.searchTerm}
              onChange={(e) =>
                setFilters({ ...filters, searchTerm: e.target.value })
              }
            />
          </div>

          {(filters.medium ||
            filters.class ||
            filters.stream ||
            filters.searchTerm) && (
            <button
              className="rp-clear-filters-btn"
              onClick={() =>
                setFilters({
                  class: "",
                  medium: "",
                  stream: "",
                  searchTerm: "",
                })
              }
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="rp-result-list-container">
        {filteredResults.length > 0 ? (
          <table className="rp-result-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Total Marks</th>
                <th>Percentage</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredResults.map((r) => (
                <tr key={r._id}>
                  <td>#{r.rank}</td>
                  <td>{capitalizeWords(r.name) || "-"}</td>

                  <td>
                    {r.totalMarks
                      ? `${r.totalMarks} / ${
                          r.maxMarksPerSubject * r.marks.length
                        }`
                      : "Absent"}
                  </td>

                  <td>
                    {r.percentage !== 0
                      ? `${r.percentage}%`
                      : "Absent"}
                  </td>

                  <td>
                    <button
                      className="rp-view-btn"
                      onClick={() => handleView(r.registrationNo)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="rp-no-results-box">
            <p>No records match your filters.</p>
          </div>
        )}
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
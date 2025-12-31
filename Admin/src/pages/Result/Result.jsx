import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

import { AdminContext } from "../../context/AdminContext";
import Loader from "../../components/Loader/Loader";
import ResultModal from "./ResultModal/ResultModal";

import {
  CLASS_OPTIONS,
  STREAM_OPTIONS,
  EXAM_OPTIONS,
  SESSION_OPTIONS,
  MEDIUM_OPTIONS,
} from "../../utils/academicOptions";

import "./Result.css";
import toast from "react-hot-toast";

const Result = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editResult, setEditResult] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);


  /* ================= SEARCH & FILTER STATES ================= */
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterMedium, setFilterMedium] = useState("");
  const [filterStream, setFilterStream] = useState("");
  const [filterSession, setFilterSession] = useState("");
  const [filterExam, setFilterExam] = useState("");


  const toggleVisibility = async (id, currentValue) => {
    try {
      setUpdatingId(id);

      await axios.post(
        `${backendUrl}/api/results/update-visibility`,
        { id, canSee: !currentValue },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      // Optimistic UI update
      setResults((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, canSee: !currentValue } : r
        )
      );
    } catch (err) {
      toast.error("Failed to update visibility");
    } finally {
      setUpdatingId(null);
    }
  };


  /* ================= FETCH RESULTS ================= */
  const fetchResults = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        `${backendUrl}/api/results/all`,
        {},
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      if (res.data.success) {
        setResults(res.data.results || []);
      }
    } catch (err) {
      console.error("Error fetching results", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  /* ================= FILTERED RESULTS ================= */
  const filteredResults = useMemo(() => {
    return results.filter((r) => {
      const name = r.studentDetails?.name?.toLowerCase() || "";
      const reg = r.registrationNo.toLowerCase();

      if (
        search &&
        !name.includes(search.toLowerCase()) &&
        !reg.includes(search.toLowerCase())
      ) {
        return false;
      }

      if (filterClass && r.class !== filterClass) return false;
      if (filterMedium && r.medium !== filterMedium) return false;
      if (filterStream && r.stream !== filterStream) return false;
      if (filterSession && r.academicSession !== filterSession) return false;
      if (filterExam && r.examName !== filterExam) return false;

      return true;
    });
  }, [
    results,
    search,
    filterClass,
    filterMedium,
    filterStream,
    filterSession,
    filterExam,
  ]);


  const clearFilters = () => {
    setSearch("");
    setFilterClass("");
    setFilterMedium("");
    setFilterStream("");
    setFilterSession("");
    setFilterExam("");
  };

  /* ================= DELETE RESULT ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this result?")) return;

    try {
      await axios.post(
        `${backendUrl}/api/results/delete`,
        { id },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      fetchResults();
    } catch (err) {
      alert("Failed to delete result");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="result-page">
      {/* ================= HEADER ================= */}
      <div className="result-header">
        <h2>Results</h2>
        <button className="btn-primary" onClick={() => setModalOpen(true)}>
          + Upload Result
        </button>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="result-filters">
        <input
          placeholder="Search by name or registration no"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
          <option value="">Class</option>
          {[...new Set([...CLASS_OPTIONS.english, ...CLASS_OPTIONS.assamese])].map(
            (c) => (
              <option key={c} value={c}>{c}</option>
            )
          )}
        </select>

        <select value={filterMedium} onChange={(e) => setFilterMedium(e.target.value)}>
          <option value="">Medium</option>
          {MEDIUM_OPTIONS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <select value={filterStream} onChange={(e) => setFilterStream(e.target.value)}>
          <option value="">Stream</option>
          {STREAM_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select value={filterSession} onChange={(e) => setFilterSession(e.target.value)}>
          <option value="">Session</option>
          {SESSION_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select value={filterExam} onChange={(e) => setFilterExam(e.target.value)}>
          <option value="">Exam</option>
          {EXAM_OPTIONS.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>

        <button
          className="btn-clear-filters"
          onClick={clearFilters}
        >
          Clear filters
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="result-table-wrapper">
        <table className="result-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Reg No</th>
              <th>Class</th>
              <th>Medium</th>
              <th>Stream</th>
              <th>Exam</th>
              <th>Session</th>
              <th>Total</th>
              <th>%</th>
              <th>Grade</th>
              <th>Rank</th>
              <th>Visible</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredResults.length === 0 ? (
              <tr>
                <td colSpan="14" style={{ textAlign: "center" }}>
                  No results found
                </td>
              </tr>
            ) : (
              filteredResults.map((r, index) => (
                <tr key={r._id}>
                  <td>{index + 1}</td>
                  <td>{r.studentDetails?.name || "—"}</td>
                  <td>{r.registrationNo}</td>
                  <td>{r.class}</td>
                  <td>{r.medium}</td>
                  <td>{r.stream || "—"}</td>
                  <td>{r.examName}</td>
                  <td>{r.academicSession}</td>
                  <td>{r.totalMarks}</td>
                  <td>{r.percentage}%</td>
                  <td>{r.grade}</td>
                  <td>{r.rank || "—"}</td>
                  <td>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={r.canSee}
                        disabled={updatingId === r._id}
                        onChange={() => toggleVisibility(r._id, r.canSee)}
                      />
                      <span className="slider"></span>
                    </label>
                  </td>
                  <td className="action-cell">
                    <button
                      className="btn-edit"
                      onClick={() => {
                        setEditResult(r);
                        setModalOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(r._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}
      {modalOpen && (
        <ResultModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditResult(null);
          }}
          editData={editResult}
          onSuccess={fetchResults}
        />
      )}
    </div>
  );
};

export default Result;

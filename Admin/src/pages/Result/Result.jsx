import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UploadResults from "./UploadResults";
import "./Styles/Result.css";
import toast from "react-hot-toast";
import Loader from "../../components/Loader/Loader";
import { AppContext } from "../../context/AppContext";
import { AdminContext } from "../../context/AdminContext";


const Result = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);
  const { results, setResults } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  // helper to fetch results and update context/local state
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
      toast.error(
        err.response?.data?.message || "Unable to load results"
      );
    } finally {
      setLoading(false);
    }
  };

  // load once on mount
  useEffect(() => {
    fetchResults();
  }, []);

  const handleView = (registrationNo) => {
    navigate(`/result/${registrationNo}`);
  };

  return (
    <div className="result-page">
      {/* ================= HEADER ================= */}
      <div className="result-header">
        <div>
          <h2>Results</h2>
          <p className="result-subtitle">
            Manage and upload student exam results.
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => setModalOpen(true)}
        >
          + Upload Result
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="result-list-container">
        {loading ? (
          <Loader message="Loading results..." />
        ) : results && results.length > 0 ? (
          <table className="result-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Class</th>
                <th>Medium</th>
                <th>Stream</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r._id} className="result-row">
                  <td>{r.name || "-"}</td>
                  <td>{r.class}</td>
                  <td>{r.medium}</td>
                  <td>{r.stream || "-"}</td>
                  <td className="actions-cell">
                    <button
                      className="view-btn"
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
          <p className="no-results">No results available.</p>
        )}
      </div>

      {/* ================= MODAL ================= */}
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

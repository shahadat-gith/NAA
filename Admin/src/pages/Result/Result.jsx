import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UploadResults from "./UploadResults";
import "./Styles/Result.css";
import toast from "react-hot-toast";
import Loader from "../../components/Loader/Loader";
import { AdminContext } from "../../context/AdminContext";
import { capitalizeWords } from "../../utils/utility";

const Result = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

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
      toast.error(
        err.response?.data?.message || "Unable to load results"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD ON MOUNT ================= */
  useEffect(() => {
    fetchResults();
  }, [adminToken]);

  const handleView = (registrationNo) => {
    navigate(`/result/${registrationNo}`);
  };

  if (loading) {
    return <Loader text="Loading results..." />;
  }

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
        {results && results.length > 0 ? (
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
                  <td>{capitalizeWords(r.name) || "-"}</td>
                  <td>{capitalizeWords(r.class)}</td>
                  <td>{capitalizeWords(r.medium)}</td>
                  <td>{capitalizeWords(r.stream) || "-"}</td>
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

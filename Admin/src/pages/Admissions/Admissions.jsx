import { useState, useEffect, useContext } from "react";
import "./Admissions.css";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";

const Admissions = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);
  const navigate = useNavigate();

  const academicSessions = [
    "2024-2025",
    "2025-2026",
    "2026-2027",
    "2027-2028",
    "2028-2029",
    "2029-2030",
  ];

  const classOptions = ["", ...Array.from({ length: 12 }, (_, i) => String(i + 1))];
  const mediumOptions = ["", "english", "assamese"];
  const streamOptions = ["science", "arts"];

  const [selectedSession, setSelectedSession] = useState("2025-2026");
  const [admissions, setAdmissions] = useState([]);
  const [filteredAdmissions, setFilteredAdmissions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    class: "",
    medium: "",
    stream: "",
    status: "",
  });

  const clearFilters = () => {
    setFilters({
      class: "",
      medium: "",
      stream: "",
      status: "",
    });
  };

  /* ================= FETCH ADMISSIONS ================= */
  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/student/admissions`,
        {
          params: { academicSession: selectedSession },
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (data.success) {
        setAdmissions(data.admissions || []);
        setFilteredAdmissions(data.admissions || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= APPLY FILTERS ================= */
  useEffect(() => {
    let result = [...admissions];

    if (filters.class) {
      result = result.filter(
        (a) => a.student?.class === filters.class
      );
    }

    if (filters.medium) {
      result = result.filter(
        (a) => a.student?.medium === filters.medium
      );
    }

    if (filters.stream) {
      result = result.filter(
        (a) => a.student?.stream === filters.stream
      );
    }

    if (filters.status) {
      result = result.filter(
        (a) => a.status === filters.status
      );
    }

    setFilteredAdmissions(result);
  }, [filters, admissions]);

  useEffect(() => {
    fetchAdmissions();
  }, [selectedSession]);

  return (
    <div className="admissions-page">
      <h2>Admissions</h2>

      {/* ================= FILTERS ================= */}
      <div className="admissions-filter">
        <label>Session</label>
        <select
          value={selectedSession}
          onChange={(e) => setSelectedSession(e.target.value)}
        >
          {academicSessions.map((session) => (
            <option key={session} value={session}>
              {session}
            </option>
          ))}
        </select>

        <label>Class</label>
        <select
          value={filters.class}
          onChange={(e) =>
            setFilters({ ...filters, class: e.target.value, stream: "" })
          }
        >
          <option value="">All</option>
          {classOptions.slice(1).map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>

        <label>Medium</label>
        <select
          value={filters.medium}
          onChange={(e) =>
            setFilters({ ...filters, medium: e.target.value })
          }
        >
          <option value="">All</option>
          {mediumOptions.slice(1).map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        {(filters.class === "11" || filters.class === "12") && (
          <>
            <label>Stream</label>
            <select
              value={filters.stream}
              onChange={(e) =>
                setFilters({ ...filters, stream: e.target.value })
              }
            >
              <option value="">All</option>
              {streamOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </>
        )}

        <label>Status</label>
        <select
          value={filters.status}
          onChange={(e) =>
            setFilters({ ...filters, status: e.target.value })
          }
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>

        <button className="clear-filter-btn" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      {/* ================= TABLE ================= */}
      {loading ? (
        <Loader text="Loading admissions..." />
      ) : (
        <table className="admissions-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Reg. No</th>
              <th>Name</th>
              <th>Class</th>
              <th>Medium</th>
              <th>Stream</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmissions.length === 0 ? (
              <tr>
                <td colSpan="9">No admissions found</td>
              </tr>
            ) : (
              filteredAdmissions.map((adm, index) => (
                <tr key={adm._id}>
                  <td>{index + 1}</td>
                  <td>{adm.student?.registrationNo || "—"}</td>
                  <td>{adm.student?.name}</td>
                  <td>{adm.student?.class}</td>
                  <td>{adm.student?.medium}</td>
                  <td>{adm.student?.stream || "-"}</td>
                  <td>
                    <span className={`status ${adm.status}`}>
                      {adm.status}
                    </span>
                  </td>
                  <td>
                    {new Date(adm?.admissionDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    }
                  </td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => navigate(`/admissions/${adm._id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Admissions;

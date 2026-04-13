import { useState, useEffect, useContext, useMemo } from "react";
import "./Admissions.css";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";

const Admissions = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const classOptions = [
    "",
    ...Array.from({ length: 12 }, (_, i) => String(i + 1)),
  ];

  const mediumOptions = ["", "english", "assamese"];
  const streamOptions = ["science", "arts"];

  const [filters, setFilters] = useState({
    class: "",
    medium: "",
    stream: "",
    status: "",
  });

  /* ================= FETCH ADMISSIONS ================= */
  const fetchAdmissions = async () => {
    if (!adminToken) return;
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/admission/list`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      if (response.data.success) {
        setAdmissions(response.data.admissions || []);
      }
    } catch (error) {
      console.error("Error fetching admissions:", error);
      toast.error("Failed to load admissions");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD ON MOUNT ================= */
  useEffect(() => {
    fetchAdmissions();
  }, [adminToken]);

  /* ================= CLEAR FILTERS ================= */
  const clearFilters = () => {
    setFilters({
      class: "",
      medium: "",
      stream: "",
      status: "",
    });
  };

  /* ================= FILTERED DATA ================= */
  const filteredAdmissions = useMemo(() => {
    let result = [...(admissions || [])];

    if (filters.class) {
      result = result.filter(
        (a) =>
          String(a.class) ===
          String(filters.class)
      );
    }

    if (filters.medium) {
      result = result.filter(
        (a) => a.medium === filters.medium
      );
    }

    if (filters.stream) {
      result = result.filter(
        (a) => a.stream === filters.stream
      );
    }

    if (filters.status) {
      result = result.filter(
        (a) =>
          (a.status || "pending") ===
          filters.status
      );
    }

    return result;
  }, [filters, admissions]);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this admission?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${backendUrl}/api/admission/${id}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      toast.success("Admission deleted successfully");
      fetchAdmissions(); 
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Error deleting admission"
      );
    }
  };

  if (loading) {
    return <Loader text="Loading admissions..." />;
  }

  return (
    <div className="admissions-page">
      <h2>Admissions</h2>

      {/* ================= FILTERS ================= */}
      <div className="admissions-filter">
        <label>Class</label>
        <select
          value={filters.class}
          onChange={(e) =>
            setFilters({
              ...filters,
              class: e.target.value,
              stream: "",
            })
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
            setFilters({
              ...filters,
              medium: e.target.value,
            })
          }
        >
          <option value="">All</option>
          {mediumOptions.slice(1).map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        {(filters.class === "11" ||
          filters.class === "12") && (
          <>
            <label>Stream</label>
            <select
              value={filters.stream}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  stream: e.target.value,
                })
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
            setFilters({
              ...filters,
              status: e.target.value,
            })
          }
        >
          <option value="">All</option>
          <option value="pending">
            Pending
          </option>
          <option value="verified">
            Verified
          </option>
          <option value="rejected">
            Rejected
          </option>
        </select>

        <button
          className="clear-filter-btn"
          onClick={clearFilters}
        >
          Clear Filters
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="admissions-table-container">
        <table className="admissions-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Class</th>
              <th>Medium</th>
              <th>Stream</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredAdmissions.length ===
            0 ? (
              <tr>
                <td colSpan="7">
                  No admissions found
              </td>
            </tr>
          ) : (
            filteredAdmissions.map(
              (adm, index) => {
                const date =
                  adm.createdAt
                    ? new Date(
                        adm.createdAt
                      )
                    : null;

                return (
                  <tr key={adm._id}>
                    <td>{index + 1}</td>
                    <td>{adm.name}</td>
                    <td>{adm.class}</td>
                    <td>{adm.medium}</td>
                    <td>
                      {adm.stream || "-"}
                    </td>
                    <td>
                      {date
                        ? date.toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "—"}
                    </td>
                    <td className="action-cell">
                      <button
                        className="view-btn"
                        onClick={() =>
                          navigate(
                            `/admissions/${adm._id}`
                          )
                        }
                      >
                        View
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(
                            adm._id
                          )
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              }
            )
          )}
        </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admissions;

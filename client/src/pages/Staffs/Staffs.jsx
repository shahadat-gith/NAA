import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Helmet } from "react-helmet-async";
import "./Staffs.css";
import { StaffCard } from "./StaffCard";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "../../components/Loader/Loader";

const Staffs = () => {
  const { backendUrl } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTeachers = useCallback(async () => {
    if (!backendUrl) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/teacher/all-teachers`);
      if (data.success) {
        setTeachers(data.teachers);
      }
    } catch (error) {
      console.error("Failed to fetch Teachers:", error);
      toast.error("Could not load teachers");
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    if (!backendUrl) return;
    fetchTeachers();
  }, [backendUrl, fetchTeachers]);

  // Enhanced filtering logic syncing with the updated schema layout
  const filteredTeachers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    // If search field is empty, seamlessly list everyone
    if (!term) return teachers;

    return teachers.filter((teacher) => {
      const matchName = teacher.name?.toLowerCase().includes(term);
      const matchSubject = teacher.subjectTaught?.toLowerCase().includes(term);

      // Return true if either condition matches
      return matchName || matchSubject;
    });
  }, [teachers, searchTerm]);

  return (
    <div className="staff-page">
      <Helmet>
        <title>Our Teachers | Nashib Ali Academy</title>
        <meta
          name="description"
          content="Meet the experienced and dedicated teaching staff of Nashib Ali Academy."
        />
      </Helmet>

      {/* Hero & Search Section */}
      <section className="staff-hero">
        <div className="section-container staff-hero-inner">
          <div className="staff-hero-content">
            <p className="staff-kicker">Our Faculty</p>
            <h1 className="staff-title">Teachers Who Shape Futures</h1>
          </div>

          <div className="staff-search-card">
            <label className="staff-search-label" htmlFor="teacher-search">
              Search teachers
            </label>
            <div className="staff-search-input-wrapper">
              <input
                id="teacher-search"
                type="text"
                placeholder="Search by name or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button
                  className="search-clear-btn"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
            <div className="staff-search-meta">
              <span>{filteredTeachers.length} teachers found</span>
              <span>
                {searchTerm
                  ? `Filtered by "${searchTerm}"`
                  : "Search by teacher name or subject department"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="directory-section">
        <div className="section-container">
          {loading ? (
            <Loader />
          ) : filteredTeachers.length > 0 ? (
            <div className="teachers-grid">
              {filteredTeachers.map((teacher, index) => (
                <StaffCard key={teacher._id || index} teacher={teacher} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <h3>No teachers found</h3>
              <p>
                Try a different search term like "Mathematics", "Social
                Studies", or another department name.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Staffs;

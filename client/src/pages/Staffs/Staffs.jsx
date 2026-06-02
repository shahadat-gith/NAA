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
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- Fetch Consolidated Staff Directory Pipeline ---
  const fetchStaffData = useCallback(async () => {
    if (!backendUrl) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/staff/all`);
      if (data.success) {
        setStaffList(data.staffs || []);
      }
    } catch (error) {
      console.error("Failed to fetch Staff records:", error);
      toast.error("Could not load staff directory");
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchStaffData();
  }, [fetchStaffData]);

  // --- Filtered List handling Search Terms ---
  const searchedStaff = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return staffList;

    return staffList.filter((item) => {
      const matchName = item.name?.toLowerCase().includes(term);
      const matchDesignation = item.designation?.toLowerCase().includes(term);
      const matchSubject = item.subjectTaught?.toLowerCase().includes(term);
      return matchName || matchDesignation || matchSubject;
    });
  }, [staffList, searchTerm]);

  // --- Column Split 1: Teaching Staff ---
  const teachingStaff = useMemo(() => {
    return searchedStaff.filter((item) => item.staffType === "Teaching");
  }, [searchedStaff]);

  // --- Column Split 2: Non-Teaching Staff ---
  const nonTeachingStaff = useMemo(() => {
    return searchedStaff.filter((item) => item.staffType === "Non Teaching");
  }, [searchedStaff]);

  return (
    <div className="staff-page">
      <Helmet>
        <title>Our Staff Directory | Nashib Ali Academy</title>
        <meta
          name="description"
          content="Browse the teaching faculty and supporting administration members of Nashib Ali Academy."
        />
      </Helmet>

      <div className="staff-container">
        
        {/* Simple & Clean Header Block */}
        <header className="staff-simple-header">
          <h1 className="staff-main-title">Our Staff Directory</h1>
          <p className="staff-count-meta">Showing {searchedStaff.length} active institution professionals</p>
          
          {/* Centered Minimal Search Field */}
          <div className="staff-search-box-wrapper">
            <i className="fas fa-search search-icon-left"></i>
            <input
              type="text"
              placeholder="Search staff by name, role, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-simple"
            />
            {searchTerm && (
              <button
                className="search-clear-btn-simple"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </header>

        {/* Directory Layout Area split into two structural columns */}
        <main className="directory-content-area">
          {loading ? (
            <Loader />
          ) : searchedStaff.length > 0 ? (
            <div className="directory-columns-layout">
              
              {/* COLUMN 1: TEACHING STAFF */}
              <div className="directory-column">
                <div className="column-heading-wrapper">
                  <h2 className="column-section-title">Teaching Staff</h2>
                  <span className="column-count-badge">{teachingStaff.length}</span>
                </div>
                {teachingStaff.length > 0 ? (
                  <div className="column-cards-grid">
                    {teachingStaff.map((staffMember, index) => (
                      <StaffCard key={staffMember._id || index} teacher={staffMember} />
                    ))}
                  </div>
                ) : (
                  <p className="column-empty-notice">No teaching faculty matches found.</p>
                )}
              </div>

              {/* Vertical Center Border Separator for desktop visuals */}
              <div className="column-vertical-divider"></div>

              {/* COLUMN 2: NON-TEACHING STAFF */}
              <div className="directory-column">
                <div className="column-heading-wrapper">
                  <h2 className="column-section-title">Non-Teaching Staff</h2>
                  <span className="column-count-badge">{nonTeachingStaff.length}</span>
                </div>
                {nonTeachingStaff.length > 0 ? (
                  <div className="column-cards-grid">
                    {nonTeachingStaff.map((staffMember, index) => (
                      <StaffCard key={staffMember._id || index} teacher={staffMember} />
                    ))}
                  </div>
                ) : (
                  <p className="column-empty-notice">No support staff matches found.</p>
                )}
              </div>

            </div>
          ) : (
            <div className="no-results">
              <h3>No directory files matching found</h3>
              <p>We couldn't locate active staff details matching "{searchTerm}".</p>
            </div>
          )}
        </main>

      </div>
    </div>
  );
};

export default Staffs;
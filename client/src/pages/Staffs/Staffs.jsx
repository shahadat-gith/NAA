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

  const getStaffSequence = (staffId = "") => {
    const parts = staffId.split("-");
    return Number(parts[2]) || 0;
  };

  const searchedStaff = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    let filtered = staffList.filter(
      (staff) => staff.status === "Active"
    );

    if (term) {
      filtered = filtered.filter((item) => {
        const matchName = item.name?.toLowerCase().includes(term);
        const matchDesignation = item.designation?.toLowerCase().includes(term);
        const matchSubject = item.subjectTaught?.toLowerCase().includes(term);
        const matchStaffId = item.staffId?.toLowerCase().includes(term);

        return (
          matchName ||
          matchDesignation ||
          matchSubject ||
          matchStaffId
        );
      });
    }

    return filtered;
  }, [staffList, searchTerm]);

  const teachingStaff = useMemo(() => {
    return [...searchedStaff]
      .filter((item) => item.staffType === "Teaching")
      .sort(
        (a, b) =>
          getStaffSequence(a.staffId) -
          getStaffSequence(b.staffId)
      );
  }, [searchedStaff]);

  const nonTeachingStaff = useMemo(() => {
    return [...searchedStaff]
      .filter((item) => item.staffType === "Non-Teaching")
      .sort(
        (a, b) =>
          getStaffSequence(a.staffId) -
          getStaffSequence(b.staffId)
      );
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
        <header className="staff-simple-header">
          <h1 className="staff-main-title">Our Staff Directory</h1>

          <p className="staff-count-meta">
            Showing {searchedStaff.length} active institution professionals
          </p>

          <div className="staff-search-box-wrapper">
            <i className="fas fa-search search-icon-left"></i>

            <input
              type="text"
              placeholder="Search staff by name, role, subject, or staff ID..."
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

        <main className="directory-content-area">
          {loading ? (
            <Loader />
          ) : searchedStaff.length > 0 ? (
            <div className="directory-columns-layout">
              <div className="directory-column">
                <div className="column-heading-wrapper">
                  <h2 className="column-section-title">
                    Teaching Staff
                  </h2>

                  <span className="column-count-badge">
                    {teachingStaff.length}
                  </span>
                </div>

                {teachingStaff.length > 0 ? (
                  <div className="column-cards-grid">
                    {teachingStaff.map((staffMember) => (
                      <StaffCard
                        key={staffMember._id}
                        teacher={staffMember}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="column-empty-notice">
                    No teaching faculty matches found.
                  </p>
                )}
              </div>

              <div className="column-vertical-divider"></div>

              <div className="directory-column">
                <div className="column-heading-wrapper">
                  <h2 className="column-section-title">
                    Non-Teaching Staff
                  </h2>

                  <span className="column-count-badge">
                    {nonTeachingStaff.length}
                  </span>
                </div>

                {nonTeachingStaff.length > 0 ? (
                  <div className="column-cards-grid">
                    {nonTeachingStaff.map((staffMember) => (
                      <StaffCard
                        key={staffMember._id}
                        teacher={staffMember}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="column-empty-notice">
                    No support staff matches found.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="no-results">
              <h3>No directory files matching found</h3>
              <p>
                We couldn't locate active staff details matching "{searchTerm}".
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Staffs;
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Helmet } from "react-helmet-async";
import "./Staffs.css";
import { StaffCard } from "./StaffCard";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "../../components/Loader/Loader";
import { Section } from "./Section";

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
      if (data.success) setStaffList(data.staffs || []);
    } catch (error) {
      console.error("Failed to fetch staff records:", error);
      toast.error("Could not load staff directory");
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => { fetchStaffData(); }, [fetchStaffData]);

  const getSeq = (staffId = "") => Number(staffId.split("-")[2]) || 0;

  const activeStaff = useMemo(() =>
    staffList.filter(s => s.status === "Active"), [staffList]);

  const searchedStaff = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return activeStaff;
    return activeStaff.filter(s =>
      s.name?.toLowerCase().includes(term) ||
      s.staffId?.toLowerCase().includes(term)
    );
  }, [activeStaff, searchTerm]);

  const teachingStaff = useMemo(() =>
    [...searchedStaff]
      .filter(s => s.staffType === "Teaching")
      .sort((a, b) => getSeq(a.staffId) - getSeq(b.staffId)),
    [searchedStaff]);

  const nonTeachingStaff = useMemo(() =>
    [...searchedStaff]
      .filter(s => s.staffType === "Non-Teaching")
      .sort((a, b) => getSeq(a.staffId) - getSeq(b.staffId)),
    [searchedStaff]);

  return (
    <div className="staff-page">
      <Helmet>
        <title>Our Staff Directory | Nashib Ali Academy</title>
        <meta name="description" content="Browse the teaching faculty and supporting administration members of Nashib Ali Academy." />
      </Helmet>

      <div className="staff-container">
        <header className="staff-header">
          <h1 className="staff-title">Our Staff Directory</h1>
          <p className="staff-meta">
            Showing {searchedStaff.length} active institution professional{searchedStaff.length !== 1 ? "s" : ""}
          </p>
          <div className="staff-search">
            <i className="fas fa-search staff-search__icon" aria-hidden="true"></i>
            <input
              type="text"
              className="staff-search__input"
              placeholder="Search by name, or staff ID…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              aria-label="Search staff"
            />
            {searchTerm && (
              <button
                className="staff-search__clear"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </header>

        <main className="staff-main">
          {loading ? ( <Loader overlay={false}/>) : searchedStaff.length > 0 ? (
            <div className="staff-section">
              <Section
                title="Teaching staff"
                staff={teachingStaff}
                emptyMsg="No teaching faculty matches found."
                avatarClass="avatar--teach"
              />


              <Section
                title="Non-teaching staff"
                staff={nonTeachingStaff}
                emptyMsg="No support staff matches found."
                avatarClass="avatar--nonteach"
              />
            </div>
          ) : (
            <div className="staff-empty">
              <i className="fas fa-search staff-empty__icon" aria-hidden="true"></i>
              <h3 className="staff-empty__heading">No staff found</h3>
              <p className="staff-empty__body">
                No active staff match &ldquo;{searchTerm}&rdquo;. Try a different search term.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};


export default Staffs;
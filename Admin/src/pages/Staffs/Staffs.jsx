import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./Staffs.css";
import { AdminContext } from "../../context/AdminContext";
import Loader from "../../components/Loader/Loader";

const Staffs = () => {
  const { adminToken, backendUrl } = useContext(AdminContext);
  const navigate = useNavigate();

  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All"); 

  /* ================= FETCH CONSOLIDATED STAFF MATRIX ================= */
  const fetchStaffMatrix = async () => {
    if (!adminToken) return;
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/staff/all`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (response.data.success) {
        setStaffMembers(response.data.staffs || response.data.directory || []);
      }
    } catch (error) {
      console.error("Error pulling staff records:", error);
      toast.error("Failed to extract master staff parameters");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffMatrix();
  }, [adminToken]);

  /* ================= ADMINISTRATIVE MULTI-FILTER STREAM ================= */
  const cleanFilteredStaffList = useMemo(() => {
    return (staffMembers || []).filter((person) => {
      if (roleFilter !== "All" && person.staffType !== roleFilter) return false;

      const cleanTerm = searchTerm.trim().toLowerCase();
      if (!cleanTerm) return true;

      return (
        person.name?.toLowerCase().includes(cleanTerm) ||
        person.designation?.toLowerCase().includes(cleanTerm)
      );
    });
  }, [staffMembers, searchTerm, roleFilter]);

  if (loading) return <Loader text="Synchronizing master staff index blocks..." />;

  return (
    <div className="adm-staff-panel">
      
      {/* Dashboard Section Top Heading Panel */}
      <header className="adm-panel-header">
        <div className="adm-title-block">
          <h1 className="adm-panel-title">Staff Management Console</h1>
          <p className="adm-panel-subtitle">Overview directory of active school faculty members and personnel.</p>
        </div>
      </header>

      {/* Controller Controls Toolbar Layer */}
      <section className="adm-toolbar-card">
        <div className="adm-search-input-field">
          <i className="fas fa-search search-lens"></i>
          <input
            type="text"
            placeholder="Search staff by name or designation title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="adm-field-input"
          />
        </div>

        <div className="adm-filter-group-buttons">
          {["All", "Teaching", "Non Teaching"].map((type) => (
            <button
              key={type}
              type="button"
              className={`adm-filter-btn ${roleFilter === type ? "active-filter-state" : ""}`}
              onClick={() => setRoleFilter(type)}
            >
              {type === "All" ? "All Staff" : `${type} Staff`}
            </button>
          ))}
        </div>
      </section>

      {/* Grid Canvas Matrix Layout */}
      <main className="adm-matrix-content">
        {cleanFilteredStaffList.length > 0 ? (
          <div className="adm-cards-dashboard-grid">
            {cleanFilteredStaffList.map((employee) => {
              const avatar = employee.image?.url || "/user.png";
              return (
                <div 
                  className="adm-staff-minimal-card" 
                  key={employee._id}
                  onClick={() => navigate(`/staffs/${employee._id}`)}
                  title={`Open complete detail inspectors for ${employee.name}`}
                >
                  
                  {/* Image Box Canvas */}
                  <div className="adm-card-media-box">
                    <img src={avatar} alt={employee.name} className="adm-card-avatar" />
                  </div>

                  {/* Core Minimal Meta Text Block */}
                  <div className="adm-card-body-text">
                    <h3 className="adm-card-title-name" title={employee.name}>
                      {employee.name}
                    </h3>
                    <p className="adm-card-subtitle-role">
                      {employee.designation}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="adm-empty-fallback-state">
            <i className="fas fa-folder-open empty-icon-lens"></i>
            <h3>No Matches found</h3>
           
          </div>
        )}
      </main>

    </div>
  );
};

export default Staffs;
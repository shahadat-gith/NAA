import React, { useEffect, useState, useContext } from "react";
import "./AuthoritiesTab.css";
import EditModal from "./EditModal";
import axios from "axios";
import toast from "react-hot-toast";
import { AdminContext } from "../../../../context/AdminContext";

const AuthoritiesTab = () => {
  const [authorities, setAuthorities] = useState([]);
  const [editingAuth, setEditingAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  const { backendUrl, adminToken } = useContext(AdminContext);

  /* ================= FETCH ================= */
  const fetchAuthorities = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${backendUrl}/api/settings/authorities`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (res.data.success) {
        setAuthorities(res.data.authorities);
      }
    } catch (error) {
      toast.error("Failed to load authorities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthorities();
  }, []);

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2 className="auth-title">
          <i className="fas fa-users-cog"></i> School Authorities
        </h2>
      </div>

      {loading ? (
        <div style={{ color: "#94a3b8" }}>Loading authorities...</div>
      ) : (
        <div className="auth-grid">
          {authorities.map((auth) => (
            <div key={auth._id} className="auth-card">
              <button
                className="auth-edit-icon"
                onClick={() => setEditingAuth(auth)}
              >
                <i className="fas fa-edit"></i>
              </button>

              <div className="auth-card-content">
                <img
                  src={auth.image?.url}
                  alt={auth.name}
                  className="auth-photo"
                />

                <h3 className="auth-name">{auth.name}</h3>
                <div className="auth-position">{auth.role}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDIT MODAL */}
      <EditModal
        open={!!editingAuth}
        authority={editingAuth}
        onClose={() => setEditingAuth(null)}
        onSuccess={fetchAuthorities}
      />
    </div>
  );
};

export default AuthoritiesTab;

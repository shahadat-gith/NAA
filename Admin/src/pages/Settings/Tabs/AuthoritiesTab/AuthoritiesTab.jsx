import React, { useState } from "react";
import "./AuthoritiesTab.css";
import EditModal from "./EditModal";

const AuthoritiesTab = ({ authorities = [], loading }) => {
  const [editingAuth, setEditingAuth] = useState(null);

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2 className="auth-title">
          <i className="fas fa-users-cog"></i> School Authorities
        </h2>
      </div>

      {loading ? (
        <div style={{ color: "#94a3b8" }}>
          Loading authorities...
        </div>
      ) : authorities.length === 0 ? (
        <div style={{ color: "#94a3b8" }}>
          No authorities found
        </div>
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
                  src={auth.image?.url || "/user.png"}
                  alt={auth.name}
                  className="auth-photo"
                />

                <h3 className="auth-name">{auth.name}</h3>
                <div className="auth-position">
                  {auth.role}
                </div>
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
      />
    </div>
  );
};

export default AuthoritiesTab;

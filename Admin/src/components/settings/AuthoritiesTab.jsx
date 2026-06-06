import React, { useState } from "react";
import { Edit2, Users } from "lucide-react";

import EditAuthorityModal from "./EditAuthorityModal";

const AuthoritiesTab = ({ authorities = [], loading }) => {
  const [editingAuth, setEditingAuth] = useState(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-[var(--text-secondary)]">
        Loading authorities...
      </div>
    );
  }

  if (authorities.length === 0) {
    return (
      <div className="text-center py-16">
        <Users size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
        <p className="text-[var(--text-secondary)]">No authorities found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-[var(--text-primary)] flex items-center gap-3">
          <Users className="text-[var(--color-primary)]" size={28} />
          School Authorities
        </h3>
        <p className="text-[var(--text-secondary)] mt-1">Manage principal, teachers, and staff in leadership roles</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {authorities.map((auth) => (
          <div
            key={auth._id}
            className="bg-[var(--bg-base)] border border-[var(--border-default)] rounded-3xl p-6 hover:border-[var(--border-strong)] transition-all group relative overflow-hidden"
          >
            {/* Edit Button */}
            <button
              onClick={() => setEditingAuth(auth)}
              className="absolute top-5 right-5 p-2.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl opacity-0 group-hover:opacity-100 hover:bg-[var(--color-primary)] hover:text-white transition-all"
            >
              <Edit2 size={18} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-[var(--bg-base)] shadow-md mb-5">
                <img
                  src={auth.image?.url || "/user.png"}
                  alt={auth.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <h4 className="font-semibold text-xl text-[var(--text-primary)]">
                {auth.name}
              </h4>
              <p className="text-[var(--text-secondary)] mt-1 text-lg capitalize">
                {auth.role}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <EditAuthorityModal
        open={!!editingAuth}
        authority={editingAuth}
        onClose={() => setEditingAuth(null)}
      />
    </div>
  );
};

export default AuthoritiesTab;
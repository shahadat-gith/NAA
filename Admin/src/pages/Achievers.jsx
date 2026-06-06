import React, { useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, Search, Image as ImageIcon } from "lucide-react";

import { AdminContext } from "../context/AdminContext";
import Loader from "../components/common/Loader";

import AddAchieverModal from "../components/achievers/AddAchieverModal";
import UpdateAchieverModal from "../components/achievers/UpdateAchieverModal";

const Achievers = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [achievers, setAchievers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(null);

  /* ================= FETCH ACHIEVERS ================= */
  const fetchAchievers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/achievers/get-achievers`,
      );
      if (data.success) {
        setAchievers(data.achievers || []);
      }
    } catch (error) {
      console.error("Error fetching achievers:", error);
      toast.error("Failed to load achievers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievers();
  }, []);

  /* ================= FILTERED DATA ================= */
  const filteredAchievers = useMemo(() => {
    if (!searchTerm.trim()) return achievers;

    return achievers.filter((achiever) =>
      achiever.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, achievers]);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this achiever?",
    );

    if (!confirmDelete) return;

    try {
      await toast.promise(
        axios.delete(`${backendUrl}/api/achievers/delete-achievers/${id}`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        }),
        {
          loading: "Deleting achiever...",
          success: "Achiever deleted successfully!",
          error: "Failed to delete achiever.",
        },
      );
      fetchAchievers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting achiever");
    }
  };

  if (loading) {
    return <Loader text="Loading achievers..." />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              Achievers
            </h1>
            <p className="text-[var(--text-secondary)] mt-1">
              Celebrating our star performers
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 md:mt-0 flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-bright)] text-white rounded-2xl font-semibold transition-all"
          >
            <Plus size={20} />
            Add Achiever
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-md">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            size={20}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name..."
            className="w-full pl-12 pr-6 py-4 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none text-base"
          />
        </div>

        {/* Results Count */}
        <div className="mb-6 text-[var(--text-secondary)]">
          Showing{" "}
          <span className="font-semibold text-[var(--text-primary)]">
            {filteredAchievers.length}
          </span>{" "}
          achievers
        </div>

        {/* Table */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="border-b border-[var(--border-default)] bg-[var(--bg-surface-2)]">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Father
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Mother
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Village
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[var(--border-default)]">
                {filteredAchievers.length > 0 ? (
                  filteredAchievers.map((achiever) => (
                    <tr
                      key={achiever._id}
                      className="hover:bg-[var(--bg-surface-2)] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-[var(--border-default)] cursor-pointer hover:scale-105 transition-transform">
                          <img
                            src={achiever?.image.url || "/user.png"}
                            alt={achiever.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>

                      <td className="px-6 py-4 font-semibold text-[var(--text-primary)]">
                        {achiever.name}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-emerald-500">
                          {achiever.percentage}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[var(--text-secondary)]">
                        {achiever.father || "—"}
                      </td>
                      <td className="px-6 py-4 text-[var(--text-secondary)]">
                        {achiever.mother || "—"}
                      </td>
                      <td className="px-6 py-4 text-[var(--text-secondary)]">
                        {achiever.village || "—"}
                      </td>
                      <td className="px-6 py-4 text-[var(--text-secondary)]">
                        {achiever.year || "—"}
                      </td>
                      <td className="px-6 py-4">{achiever.className || "—"}</td>

                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setShowUpdateModal(achiever)}
                            className="p-2 hover:bg-[var(--bg-surface-2)] rounded-xl transition-colors text-[var(--color-primary)]"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(achiever._id)}
                            className="p-2 hover:bg-red-500/10 rounded-xl transition-colors text-red-500"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="9"
                      className="px-6 py-20 text-center text-[var(--text-secondary)]"
                    >
                      No achievers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddAchieverModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        backendUrl={backendUrl}
        adminToken={adminToken}
        onAddSuccess={fetchAchievers}
      />

      {showUpdateModal && (
        <UpdateAchieverModal
          isOpen={!!showUpdateModal}
          onClose={() => setShowUpdateModal(null)}
          backendUrl={backendUrl}
          adminToken={adminToken}
          achiever={showUpdateModal}
          onUpdateSuccess={fetchAchievers}
        />
      )}
    </div>
  );
};

export default Achievers;

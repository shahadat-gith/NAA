import React, { useContext, useState, useMemo } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import AddAchieverModal from "./AddAchieverModal";
import UpdateAchieverModal from "./UpdateAchieverModal";
import ImageModal from "../../components/ImageModal/ImageModal";
import "./Achievers.css";

const Achievers = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);
  const { achievers, loading, fetchInitialData } =
    useContext(AppContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(null);
  const [person, setPerson] = useState(null);
  const [imageOpen, setImageOpen] = useState(false);

  /* ================= FILTERED DATA ================= */

  const filteredAchievers = useMemo(() => {
    if (!searchTerm.trim()) return achievers || [];

    return achievers.filter((achiever) =>
      achiever.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, achievers]);

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this achiever?"
    );

    if (!confirmDelete) return;

    try {
      await toast.promise(
        axios.delete(
          `${backendUrl}/api/achievers/delete-achievers/${id}`,
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }
        ),
        {
          loading: "Deleting achiever...",
          success: "Achiever deleted successfully!",
          error: "Failed to delete achiever.",
        }
      );

      fetchInitialData(); // refresh from context
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Error deleting achiever"
      );
    }
  };

  return (
    <div className="admin-content">
      <div className="achievers-header">
        <h1>Manage Achievers</h1>

        <div className="achievers-subtitle">
          Total achievers: {filteredAchievers.length}
        </div>

        <button
          className="add-btn"
          onClick={() => setShowAddModal(true)}
        >
          <i className="fas fa-plus"></i>
          Add Achiever
        </button>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="search-section">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          placeholder="Search by achiever name..."
          className="search-input"
        />
      </div>

      {/* ================= TABLE ================= */}
      <div className="achievers-list-container">
        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
            <p>Loading achievers...</p>
          </div>
        ) : filteredAchievers.length === 0 ? (
          <p className="no-achievers">
            No achievers found.
          </p>
        ) : (
          <table className="achievers-list">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Percentage</th>
                <th>Father</th>
                <th>Mother</th>
                <th>Village</th>
                <th>Year</th>
                <th>Class</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAchievers.map(
                (achiever) => (
                  <tr
                    key={achiever._id}
                    className="achiever-item"
                  >
                    <td className="image-cell">
                      {achiever.image ? (
                        <img
                          src={achiever.image.replace(
                            "/upload/",
                            "/upload/w_100,h_100,q_auto,f_webp/"
                          )}
                          alt={achiever.name}
                          className="achiever-image"
                          onClick={() => {
                            setPerson(achiever);
                            setImageOpen(true);
                          }}
                        />
                      ) : (
                        <div className="no-image">
                          <i className="fas fa-user"></i>
                        </div>
                      )}
                    </td>

                    <td>{achiever.name}</td>
                    <td>
                      {achiever.percentage}%
                    </td>
                    <td>{achiever.father}</td>
                    <td>{achiever.mother}</td>
                    <td>{achiever.village}</td>
                    <td>{achiever.year}</td>
                    <td>
                      {achiever.className}
                    </td>

                    <td className="actions-cell">
                      <button
                        className="update-btn"
                        onClick={() =>
                          setShowUpdateModal(
                            achiever
                          )
                        }
                      >
                        <i className="fas fa-edit"></i>
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(
                            achiever._id
                          )
                        }
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ================= IMAGE MODAL ================= */}
      {imageOpen && person && (
        <ImageModal
          isOpen={imageOpen}
          person={person}
          onClose={() => setImageOpen(false)}
        />
      )}

      {/* ================= ADD MODAL ================= */}
      <AddAchieverModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        backendUrl={backendUrl}
        adminToken={adminToken}
        onAddSuccess={fetchInitialData}
      />

      {/* ================= UPDATE MODAL ================= */}
      {showUpdateModal && (
        <UpdateAchieverModal
          isOpen={!!showUpdateModal}
          onClose={() =>
            setShowUpdateModal(null)
          }
          backendUrl={backendUrl}
          adminToken={adminToken}
          achiever={showUpdateModal}
          onUpdateSuccess={fetchInitialData}
        />
      )}
    </div>
  );
};

export default Achievers;

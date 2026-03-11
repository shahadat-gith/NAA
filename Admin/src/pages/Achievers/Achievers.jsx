import React, { useContext, useState, useMemo, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import toast from "react-hot-toast";
import axios from "axios";
import AddAchieverModal from "./AddAchieverModal";
import UpdateAchieverModal from "./UpdateAchieverModal";
import ImageModal from "../../components/ImageModal/ImageModal";
import Loader from "../../components/Loader/Loader";
import "./Achievers.css";

const Achievers = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [achievers, setAchievers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(null);
  const [person, setPerson] = useState(null);
  const [imageOpen, setImageOpen] = useState(false);

  /* ================= FETCH ACHIEVERS ================= */
  const fetchAchievers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/achievers/get-achievers`);
      if (response.data.success) {
        setAchievers(response.data.achievers || []);
      }
    } catch (error) {
      console.error("Error fetching achievers:", error);
      toast.error("Failed to load achievers");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD ON MOUNT ================= */
  useEffect(() => {
    fetchAchievers();
  }, []);

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

      fetchAchievers();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Error deleting achiever"
      );
    }
  };

  if (loading) {
    return <Loader text="Loading achievers..." />;
  }

  return (
    <div className="admin-content">
      <div className="ac-header">
        <h1>Manage Achievers</h1>

        <div className="ac-subtitle">
          Total achievers: {filteredAchievers.length}
        </div>

        <button
          className="ac-add-btn"
          onClick={() => setShowAddModal(true)}
        >
          <i className="fas fa-plus"></i>
          Add Achiever
        </button>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="ac-search-section">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          placeholder="Search by achiever name..."
          className="ac-search-input"
        />
      </div>

      {/* ================= TABLE ================= */}
      <div className="ac-list-container">
        {filteredAchievers.length === 0 ? (
          <p className="ac-no-achievers">
            No achievers found.
          </p>
        ) : (
          <table className="ac-list">
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
                    className="ac-item"
                  >
                    <td className="ac-image-cell">
                      {achiever.image ? (
                        <img
                          src={achiever.image.replace(
                            "/upload/",
                            "/upload/w_100,h_100,q_auto,f_webp/"
                          )}
                          alt={achiever.name}
                          className="ac-image"
                          onClick={() => {
                            setPerson(achiever);
                            setImageOpen(true);
                          }}
                        />
                      ) : (
                        <div className="ac-no-image">
                          <i className="fas fa-user"></i>
                        </div>
                      )}
                    </td>

                    <td>{achiever.name}</td>
                    <td>{achiever.percentage}%</td>
                    <td>{achiever.father}</td>
                    <td>{achiever.mother}</td>
                    <td>{achiever.village}</td>
                    <td>{achiever.year}</td>
                    <td>{achiever.className}</td>

                    <td className="ac-actions-cell">
                      <button
                        className="ac-update-btn"
                        onClick={() =>
                          setShowUpdateModal(
                            achiever
                          )
                        }
                      >
                        <i className="fas fa-edit"></i>
                      </button>

                      <button
                        className="ac-delete-btn"
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
        onAddSuccess={fetchAchievers}
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
          onUpdateSuccess={fetchAchievers}
        />
      )}
    </div>
  );
};

export default Achievers;
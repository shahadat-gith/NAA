import React, { useContext, useState, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import AddAchieverModal from './AddAchieverModal';
import UpdateAchieverModal from './UpdateAchieverModal';
import ImageModal from '../../components/ImageModal/ImageModal';
import './Achievers.css';

const Achievers = () => {
    const { backendUrl, adminToken } = useContext(AdminContext);
    const [achievers, setAchievers] = useState([]);
    const [filteredAchievers, setFilteredAchievers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(null); // null or achiever object
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null); // null or _id
    const [isLoading, setIsLoading] = useState(false);
    const [person, setPerson] = useState(null);
    const [imageOpen, setImageOpen] = useState(false);

    // Fetch all achievers
    const loadAchievers = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${backendUrl}/api/achievers/get-achievers`, {
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            setAchievers(response.data.achievers || []);
            setFilteredAchievers(response.data.achievers || []);
        } catch (error) {
            console.error('Fetch achievers error:', error);
            toast.error('Failed to fetch achievers: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch achievers on mount
    useEffect(() => {
        loadAchievers();
    }, [backendUrl, adminToken]);

    // Filter achievers by search term
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredAchievers(achievers);
        } else {
            setFilteredAchievers(
                achievers.filter((achiever) =>
                    achiever.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
    }, [searchTerm, achievers]);

    const openAddModal = () => {
        setShowAddModal(true);
        document.body.style.overflow = 'hidden';
    };

    const closeAddModal = () => {
        setShowAddModal(false);
        document.body.style.overflow = 'unset';
    };

    const openUpdateModal = (achiever) => {
        setShowUpdateModal(achiever);
        document.body.style.overflow = 'hidden';
    };

    const closeUpdateModal = () => {
        setShowUpdateModal(null);
        document.body.style.overflow = 'unset';
    };

    const openDeleteConfirm = (id) => {
        setShowDeleteConfirm(id);
        document.body.style.overflow = 'hidden';
    };

    const closeDeleteConfirm = () => {
        setShowDeleteConfirm(null);
        document.body.style.overflow = 'unset';
    };

    const closeImageModal = () => {
        setImageOpen(false);
    };

    // Handle delete achiever
    const handleDelete = async (id) => {
        try {
            await toast.promise(
                axios.delete(`${backendUrl}/api/achievers/delete-achievers/${id}`, {
                    headers: { Authorization: `Bearer ${adminToken}` },
                }),
                {
                    pending: 'Deleting achiever...',
                    success: 'Achiever deleted successfully!',
                    error: 'Failed to delete achiever.',
                }
            );
            closeDeleteConfirm();
            await loadAchievers();
        } catch (error) {
            console.error('Delete achiever error:', error);
            toast.error(error.response?.data?.message || 'Error deleting achiever');
        }
    };

    return (
        <div className="admin-content">
            <div className="achievers-header">
                <h1>Manage Achievers</h1>
                <div className="achievers-subtitle">Total achievers: {filteredAchievers.length}</div>
                <button className="add-btn" onClick={openAddModal} aria-label="Add new achiever">
                    <i className="fas fa-plus"></i>
                    Add Achiever
                </button>
            </div>

            <div className="search-section">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by achiever name..."
                    className="search-input"
                    aria-label="Search achievers by name"
                />
            </div>

            <div className="achievers-list-container">
                {isLoading ? (
                    <div className="loader-container">
                        <div className="loader"></div>
                        <p>Loading achievers...</p>
                    </div>
                ) : filteredAchievers.length === 0 ? (
                    <p className="no-achievers">No achievers found.</p>
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
                            {filteredAchievers.map((achiever) => (
                                <tr key={achiever._id} className="achiever-item">
                                    <td className="image-cell">
                                        {achiever.image ? (
                                            <img
                                                src={achiever.image.replace('/upload/', '/upload/w_100,h_100,q_auto,f_webp/')}
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
                                    <td>{achiever.percentage}%</td>
                                    <td>{achiever.father}</td>
                                    <td>{achiever.mother}</td>
                                    <td>{achiever.village}</td>
                                    <td>{achiever.year}</td>
                                    <td>{achiever.className}</td>
                                    <td className="actions-cell">
                                        <button
                                            className="update-btn"
                                            onClick={() => openUpdateModal(achiever)}
                                            title="Update Achiever"
                                            aria-label={`Update ${achiever.name}`}
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => openDeleteConfirm(achiever._id)}
                                            title="Delete Achiever"
                                            aria-label={`Delete ${achiever.name}`}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="modal-container" onClick={closeDeleteConfirm}>
                    <div className="delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-btn" onClick={closeDeleteConfirm} title="Close" aria-label="Close delete confirmation modal">
                            <i className="fas fa-times"></i>
                        </button>
                        <h2>Confirm Deletion</h2>
                        <div>Are you sure you want to delete this achiever? This action cannot be undone.</div>
                        <div className="delete-confirm-buttons">
                            <button className="cancel-btn" onClick={closeDeleteConfirm} aria-label="Cancel deletion">
                                Cancel
                            </button>
                            <button className="confirm-delete-btn" onClick={() => handleDelete(showDeleteConfirm)} aria-label="Confirm deletion">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Modal */}
            {imageOpen && person && (
                <ImageModal isOpen={imageOpen} person={person} onClose={closeImageModal} />
            )}

            {/* Add Achiever Modal */}
            <AddAchieverModal
                isOpen={showAddModal}
                onClose={closeAddModal}
                backendUrl={backendUrl}
                adminToken={adminToken}
                onAddSuccess={loadAchievers}
            />

            {/* Update Achiever Modal */}
            {showUpdateModal && (
                <UpdateAchieverModal
                    isOpen={!!showUpdateModal}
                    onClose={closeUpdateModal}
                    backendUrl={backendUrl}
                    adminToken={adminToken}
                    achiever={showUpdateModal}
                    onUpdateSuccess={loadAchievers}
                />
            )}
        </div>
    );
};

export default Achievers;
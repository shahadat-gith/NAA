import React, { useContext, useState, useEffect, useRef } from 'react';
import { AdminContext } from '../../context/AdminContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import './Achievers.css';

const Achievers = () => {
    const { backendUrl, adminToken } = useContext(AdminContext);
    const [achievers, setAchievers] = useState([]);
    const [selectedAchiever, setSelectedAchiever] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null); // null or _id
    const [formData, setFormData] = useState({
        name: '',
        father: '',
        mother: '',
        village: '',
        percentage: '',
        year: '',
        className: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);

    // Fetch all achievers
    const loadAchievers = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${backendUrl}/api/achievers/get-achievers`, {
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            setAchievers(response.data.achievers || []);
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

    // Modal handlers
    const openViewModal = (achiever) => {
        setSelectedAchiever(achiever);
        document.body.style.overflow = 'hidden';
    };

    const closeViewModal = () => {
        setSelectedAchiever(null);
        document.body.style.overflow = 'unset';
    };

    const openAddModal = () => {
        setShowAddModal(true);
        document.body.style.overflow = 'hidden';
    };

    const closeAddModal = () => {
        setShowAddModal(false);
        setFormData({
            name: '',
            father: '',
            mother: '',
            village: '',
            percentage: '',
            year: '',
            className: '',
        });
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = null;
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

    // Form handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
        } else {
            toast.error('Please select a valid image file');
            setImageFile(null);
            if (fileInputRef.current) fileInputRef.current.value = null;
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    // Handle add achiever
    const handleAddAchiever = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.percentage || !formData.year || !formData.className) {
            toast.error('Name, percentage, year, and class are required');
            return;
        }

        const form = new FormData();
        form.append('name', formData.name);
        form.append('father', formData.father);
        form.append('mother', formData.mother);
        form.append('village', formData.village);
        form.append('percentage', formData.percentage);
        form.append('year', formData.year);
        form.append('className', formData.className);
        if (imageFile) form.append('image', imageFile);

        try {
            await toast.promise(
                axios.post(`${backendUrl}/api/achievers/add-achiever`, form, {
                    headers: {
                        Authorization: `Bearer ${adminToken}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }),
                {
                    pending: 'Adding achiever...',
                    success: 'Achiever added successfully!',
                    error: 'Failed to add achiever.',
                }
            );
            closeAddModal();
            await loadAchievers();
        } catch (error) {
            console.error('Add achiever error:', error);
            toast.error(error.response?.data?.message || 'Error adding achiever');
        }
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
                <div className="achievers-subtitle">Total achievers: {achievers.length}</div>
                <button className="add-btn" onClick={openAddModal}>
                    <i className="fas fa-plus"></i>
                    Add Achiever
                </button>
            </div>

            <div className="achievers-list-container">
                {isLoading ? (
                    <div className="loader-container">
                        <div className="loader"></div>
                        <p>Loading achievers...</p>
                    </div>
                ) : achievers.length === 0 ? (
                    <p className="no-achievers">No achievers available.</p>
                ) : (
                    <table className="achievers-list">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Percentage</th>
                                <th>Year</th>
                                <th>Class</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {achievers.map((achiever) => (
                                <tr key={achiever._id} className="achiever-item">
                                    <td className="image-cell">
                                        {achiever.image ? (
                                            <img
                                                src={achiever.image.replace('/upload/', '/upload/w_100,h_100,q_auto,f_webp/')}
                                                alt={achiever.name}
                                                className="achiever-image"
                                            />
                                        ) : (
                                            <div className="no-image">
                                                <i className="fas fa-user"></i>
                                            </div>
                                        )}
                                    </td>
                                    <td>{achiever.name}</td>
                                    <td>{achiever.percentage}%</td>
                                    <td>{achiever.year}</td>
                                    <td>{achiever.className}</td>
                                    <td className="actions-cell">
                                        <button
                                            className="view-btn"
                                            onClick={() => openViewModal(achiever)}
                                            title="View Achiever"
                                        >
                                            <i className="fas fa-eye"></i>
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => openDeleteConfirm(achiever._id)}
                                            title="Delete Achiever"
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

            {/* View Modal */}
            {selectedAchiever && (
                <div className="modal-container" onClick={closeViewModal}>
                    <div className="modal-content view-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-btn" onClick={closeViewModal} title="Close">
                            <i className="fas fa-times"></i>
                        </button>
                        <div className="view-modal-content">
                            <div className="view-modal-image-container">
                                {selectedAchiever.image ? (
                                    <img
                                        src={selectedAchiever.image}
                                        alt={selectedAchiever.name}
                                        className="view-modal-image"
                                    />
                                ) : (
                                    <div className="view-modal-no-image">
                                        <i className="fas fa-user"></i>
                                    </div>
                                )}
                            </div>
                            <div className="view-modal-details">
                                <h2 className="view-modal-title">{selectedAchiever.name}</h2>
                                <div className="view-modal-info">
                                    <p>
                                        <strong>Percentage:</strong> {selectedAchiever.percentage}%
                                    </p>
                                    <p>
                                        <strong>Year:</strong> {selectedAchiever.year}
                                    </p>
                                    <p>
                                        <strong>Class:</strong> {selectedAchiever.className}
                                    </p>
                                    {selectedAchiever.father && (
                                        <p>
                                            <strong>Father:</strong> {selectedAchiever.father}
                                        </p>
                                    )}
                                    {selectedAchiever.mother && (
                                        <p>
                                            <strong>Mother:</strong> {selectedAchiever.mother}
                                        </p>
                                    )}
                                    {selectedAchiever.village && (
                                        <p>
                                            <strong>Village:</strong> {selectedAchiever.village}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Add Modal */}
            {showAddModal && (
                <div className="modal-container" onClick={closeAddModal}>
                    <div className="modal-content add-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-btn" onClick={closeAddModal} title="Close">
                            <i className="fas fa-times"></i>
                        </button>
                        <h2>Add Achiever</h2>
                        <form onSubmit={handleAddAchiever} className="add-achiever-form">
                            {/* Row 1 */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">Name *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="percentage">Percentage * (%)</label>
                                    <input
                                        type="text"
                                        id="percentage"
                                        name="percentage"
                                        value={formData.percentage}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="year">Year *</label>
                                    <input
                                        type="text"
                                        id="year"
                                        name="year"
                                        value={formData.year}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Row 2 */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="className">Class *</label>
                                    <input
                                        type="text"
                                        id="className"
                                        name="className"
                                        value={formData.className}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="father">Father</label>
                                    <input
                                        type="text"
                                        id="father"
                                        name="father"
                                        value={formData.father}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="mother">Mother</label>
                                    <input
                                        type="text"
                                        id="mother"
                                        name="mother"
                                        value={formData.mother}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            {/* Row 3 */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="village">Village</label>
                                    <input
                                        type="text"
                                        id="village"
                                        name="village"
                                        value={formData.village}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="image">Image</label>
                                    <input
                                        type="file"
                                        id="image"
                                        ref={fileInputRef}
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="submit-btn">Add Achiever</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="modal-container" onClick={closeDeleteConfirm}>
                    <div className="modal-content delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-btn" onClick={closeDeleteConfirm} title="Close">
                            <i className="fas fa-times"></i>
                        </button>
                        <h2>Confirm Deletion</h2>
                        <p>Are you sure you want to delete this achiever? This action cannot be undone.</p>
                        <div className="delete-confirm-buttons">
                            <button className="cancel-btn" onClick={closeDeleteConfirm}>
                                Cancel
                            </button>
                            <button className="confirm-delete-btn" onClick={() => handleDelete(showDeleteConfirm)}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Achievers;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './UpdateAchieverModal.css';

const UpdateAchieverModal = ({ isOpen, onClose, backendUrl, adminToken, achiever, onUpdateSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        father: '',
        mother: '',
        village: '',
        percentage: '',
        className: '',
        year: '',
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    // Initialize form with achiever data
    useEffect(() => {
        if (achiever) {
            setFormData({
                name: achiever.name || '',
                father: achiever.father || '',
                mother: achiever.mother || '',
                village: achiever.village || '',
                percentage: achiever.percentage || '',
                className: achiever.className || '',
                year: achiever.year || '',
            });
            setImagePreview(achiever.image || '');
        }
    }, [achiever]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            if (formData[key]) {
                data.append(key, formData[key]);
            }
        });
        if (image) {
            data.append('image', image);
        }

        try {
            await toast.promise(
                axios.put(`${backendUrl}/api/achievers/update-achiever/${achiever._id}`, data, {
                    headers: {
                        Authorization: `Bearer ${adminToken}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }),
                {
                    pending: 'Updating achiever...',
                    success: 'Achiever updated successfully!',
                    error: 'Failed to update achiever.',
                }
            );
            onUpdateSuccess();
            onClose();
        } catch (error) {
            console.error('Update achiever error:', error);
            toast.error(error.response?.data?.message || 'Error updating achiever');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="ach-modal-container">
            <div className="ach-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-btn" onClick={onClose} title="Close" aria-label="Close update modal">
                    <i className="fas fa-times"></i>
                </button>
                <div className="ach-update-modal">
                    <h2>Update Achiever</h2>
                    <form onSubmit={handleSubmit} className="update-achiever-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter name"
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="father">Father's Name</label>
                                <input
                                    type="text"
                                    id="father"
                                    name="father"
                                    value={formData.father}
                                    onChange={handleInputChange}
                                    placeholder="Enter father's name"
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="mother">Mother's Name</label>
                                <input
                                    type="text"
                                    id="mother"
                                    name="mother"
                                    value={formData.mother}
                                    onChange={handleInputChange}
                                    placeholder="Enter mother's name"
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="village">Village</label>
                                <input
                                    type="text"
                                    id="village"
                                    name="village"
                                    value={formData.village}
                                    onChange={handleInputChange}
                                    placeholder="Enter village"
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="percentage">Percentage</label>
                                <input
                                    type="text"
                                    id="percentage"
                                    name="percentage"
                                    value={formData.percentage}
                                    onChange={handleInputChange}
                                    placeholder="Enter percentage (e.g., 85.5)"
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="className">Class</label>
                                <input
                                    type="text"
                                    id="className"
                                    name="className"
                                    value={formData.className}
                                    onChange={handleInputChange}
                                    placeholder="Enter class"
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="year">Year</label>
                                <input
                                    type="text"
                                    id="year"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleInputChange}
                                    placeholder="Enter year (e.g., 2023)"
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="image">Image</label>
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="form-input"
                                />
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="image-preview"
                                    />
                                )}
                            </div>
                        </div>
                        <div className="ach-form-buttons">
                            <button type="button" className="ach-cancel-btn" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="ach-submit-btn">
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateAchieverModal;
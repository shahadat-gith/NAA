import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import './AddAchieverModal.css';

const AddAchieverModal = ({ isOpen, onClose, backendUrl, adminToken, onAddSuccess }) => {
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
    const fileInputRef = useRef(null);

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
            onClose();
            await onAddSuccess();
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
        } catch (error) {
            console.error('Add achiever error:', error);
            toast.error(error.response?.data?.message || 'Error adding achiever');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="aacm-modal-container" onClick={onClose}>
            <div className="aacm-modal-content aacm-add-modal" onClick={(e) => e.stopPropagation()}>
                <button className="aacm-modal-btn" onClick={onClose} title="Close" aria-label="Close add achiever modal">
                    <i className="fas fa-times"></i>
                </button>
                <h2>Add Achiever</h2>

                <form onSubmit={handleAddAchiever} className="aacm-form">
                    {/* Row 1 */}
                    <div className="aacm-form-row">
                        <div className="aacm-form-group">
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter student name"
                                required
                            />
                        </div>

                        <div className="aacm-form-group">
                            <input
                                type="text"
                                id="percentage"
                                name="percentage"
                                value={formData.percentage}
                                onChange={handleInputChange}
                                placeholder="Enter percentage (e.g., 95.5)"
                                required
                            />
                        </div>

                        <div className="aacm-form-group">
                            <input
                                type="text"
                                id="year"
                                name="year"
                                value={formData.year}
                                onChange={handleInputChange}
                                placeholder="Enter year (e.g., 2025)"
                                required
                            />
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="aacm-form-row">
                        <div className="aacm-form-group">
                            <input
                                type="text"
                                id="className"
                                name="className"
                                value={formData.className}
                                onChange={handleInputChange}
                                placeholder="Enter class (e.g., Class 10)"
                                required
                            />
                        </div>

                        <div className="aacm-form-group">
                            <input
                                type="text"
                                id="father"
                                name="father"
                                value={formData.father}
                                onChange={handleInputChange}
                                placeholder="Enter father's name"
                                required
                            />
                        </div>

                        <div className="aacm-form-group">
                            <input
                                type="text"
                                id="mother"
                                name="mother"
                                value={formData.mother}
                                onChange={handleInputChange}
                                placeholder="Enter mother's name"
                                required
                            />
                        </div>
                    </div>

                    {/* Row 3 */}
                    <div className="aacm-form-row">
                        <div className="aacm-form-group">
                            <input
                                type="text"
                                id="village"
                                name="village"
                                value={formData.village}
                                onChange={handleInputChange}
                                placeholder="Enter village name"
                                required
                            />
                        </div>

                        <div className="aacm-form-group">
                            <input
                                type="file"
                                id="image"
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    <button type="submit" className="aacm-submit-btn" aria-label="Add new achiever">
                        Add Achiever
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddAchieverModal;
import React, { useContext, useEffect, useState } from "react";
import { TeacherContext } from "../../context/TeacherContext";
import axios from "axios";
import toast from 'react-hot-toast';
import { Link } from "react-router-dom";
import "./ListAllTeacher.css";
import { AdminContext } from "../../context/AdminContext";

const ListAllTeacher = () => {
    const { backendUrl, teachers, getAllTeachers } = useContext(TeacherContext);
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [teacherToDelete, setTeacherToDelete] = useState(null);
    const [isUpdateDisabled, setIsUpdateDisabled] = useState(false);
    const { adminToken } = useContext(AdminContext);

    useEffect(() => {
        getAllTeachers();
    }, []);

    useEffect(() => {
        const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
        const alreadyUpdated = teachers.length > 0 && teachers.every(t => t.updateDueBalanceMonth === currentMonth);
        setIsUpdateDisabled(alreadyUpdated);
    }, [teachers]);

    const handleDelete = async (teacherId) => {
        setShowPopup(true);
        setTeacherToDelete(teacherId);
    };

    const confirmDelete = async () => {
        if (!teacherToDelete) return;

        setLoading(true);
        setShowPopup(false);
        try {
            await axios.delete(`${backendUrl}/api/teacher/delete-teacher/${teacherToDelete}`, {
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            getAllTeachers();
            toast.success("Teacher deleted successfully!");
        } catch (error) {
            toast.error("Failed to delete teacher. Please try again.");
            console.error("Error deleting teacher:", error);
        } finally {
            setLoading(false);
            setTeacherToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowPopup(false);
        setTeacherToDelete(null);
    };

    const handleUpdateDueBalance = async () => {
        setLoading(true);
        try {
            await axios.put(`${backendUrl}/api/teacher/update-due-balance`, null, {
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            toast.success("Due balances updated successfully!");
            getAllTeachers();
        } catch (error) {
            console.error("Error updating due balances:", error);
            toast.error("Failed to update due balances.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="teacher-list">
            <h2>All Teachers</h2>

            <div style={{ marginBottom: "20px" }}>
                <button
                    className="update-balance-button"
                    onClick={handleUpdateDueBalance}
                    disabled={loading || isUpdateDisabled}
                >
                    {loading
                        ? "Updating..."
                        : isUpdateDisabled
                        ? "Already Updated This Month"
                        : "Update Due Balances"}
                </button>
            </div>

            {teachers.length > 0 ? (
                <table className="teacher-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Experience</th>
                            <th>Salary</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teachers.map((teacher) => (
                            <tr key={teacher._id} className="underlined-row">
                                <td>
                                    <img
                                        src={`${backendUrl}/${teacher.image.replace("\\", "/")}`}
                                        alt={teacher.name}
                                        className="teacher-img"
                                    />
                                </td>
                                <td>
                                    <Link to={`/teacher/${teacher._id}`} className="teacher-link">
                                        {teacher.name}
                                        <i className="fas fa-arrow-up-right-from-square icon"></i>
                                    </Link>
                                </td>
                                <td>{teacher.email}</td>
                                <td>{teacher.experience} Years</td>
                                <td>₹{teacher.salary}</td>
                                <td>
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDelete(teacher._id)}
                                        disabled={loading}
                                    >
                                        {loading ? "Deleting..." : "Delete"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No teachers found.</p>
            )}

            {showPopup && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Confirm Deletion</h3>
                        <p>Are you sure you want to delete this teacher?</p>
                        <div className="modal-buttons">
                            <button className="confirm-button" onClick={confirmDelete} disabled={loading}>
                                {loading ? "Deleting..." : "Yes"}
                            </button>
                            <button className="cancel-button" onClick={cancelDelete} disabled={loading}>
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListAllTeacher;

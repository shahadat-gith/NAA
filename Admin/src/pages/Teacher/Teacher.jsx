import React, { useContext, useEffect, useState } from "react";
import { TeacherContext } from "../../context/TeacherContext";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import "./Teacher.css";
import { AdminContext } from "../../context/AdminContext";
import TeacherModal from "./TeacherModal/TeacherModal";

const Teacher = () => {
  const { backendUrl, teachers, getAllTeachers } =
    useContext(TeacherContext);

  const { adminToken } = useContext(AdminContext);

  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [teacherPopUp, setTeacherPopUp] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  /* ================= FETCH ================= */

  useEffect(() => {
    getAllTeachers();
  }, []);

  /* ================= DELETE ================= */

  const handleDelete = (teacherId) => {
    setShowPopup(true);
    setTeacherToDelete(teacherId);
  };

  const confirmDelete = async () => {
    if (!teacherToDelete) return;

    setLoading(true);
    setShowPopup(false);

    try {
      await axios.delete(
        `${backendUrl}/api/teacher/delete-teacher/${teacherToDelete}`,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );

      toast.success("Teacher deleted successfully");
      getAllTeachers();
    } catch (error) {
      console.error("Delete teacher error:", error);
      toast.error("Failed to delete teacher");
    } finally {
      setLoading(false);
      setTeacherToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowPopup(false);
    setTeacherToDelete(null);
  };

  /* ================= MODAL ================= */

  const openFormHandler = () => setTeacherPopUp(true);
  const closeFormHandler = () => setTeacherPopUp(false);

  /* ================= SEARCH ================= */

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ================= UI ================= */

  return (
    <div className="teacher-container">
      {/* ===== Header ===== */}
      <div className="teacher-header">
        <h2>All Teachers</h2>
        <p className="teacher-subtitle">
          Manage and view all teacher information
        </p>
      </div>

      {/* ===== Actions ===== */}
      <div className="teacher-actions">
        <div className="teacher-search">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="teacher-search-clear"
              onClick={() => setSearchTerm("")}
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>

        <div className="teacher-action-buttons">
          <button className="teacher-add-btn" onClick={openFormHandler}>
            <i className="fas fa-plus"></i>
            Add Teacher
          </button>
        </div>
      </div>

      {/* ===== Table ===== */}
      {filteredTeachers.length > 0 ? (
        <div className="teacher-table-wrapper">
          <table className="teacher-table">
            <thead>
              <tr>
                <th>Teacher</th>
                <th>Email</th>
                <th>Experience</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((teacher) => (
                <tr key={teacher._id}>
                  <td>
                    <div className="teacher-info">
                      <img
                        src={teacher.image}
                        alt={teacher.name}
                        className="teacher-img"
                      />
                      <div className="teacher-details">
                        <Link
                          to={`/teachers/${teacher._id}`}
                          className="teacher-name"
                        >
                          {teacher.name}
                          <i className="fas fa-external-link-alt"></i>
                        </Link>
                      </div>
                    </div>
                  </td>

                  <td>
                    {teacher.email && teacher.email !== "N/A"
                      ? teacher.email
                      : "Not Available"}
                  </td>

                  <td>{teacher.experience} Years</td>

                  <td>
                    <button
                      className="teacher-delete-btn"
                      onClick={() => handleDelete(teacher._id)}
                      disabled={loading}
                    >
                      <i className="fas fa-trash"></i>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="teacher-empty">
          <i className="fas fa-user-slash"></i>
          <h3>No Teachers Found</h3>
          <p>
            {searchTerm
              ? `No teachers match "${searchTerm}"`
              : "Start by adding your first teacher"}
          </p>
        </div>
      )}

      {/* ===== Delete Modal ===== */}
      {showPopup && (
        <div className="teacher-modal-overlay">
          <div className="teacher-modal-content">
            <div className="teacher-modal-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h3>Confirm Deletion</h3>
            <p>
              Are you sure you want to delete this teacher?
              This action cannot be undone.
            </p>
            <div className="teacher-modal-buttons">
              <button
                className="teacher-modal-confirm"
                onClick={confirmDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                className="teacher-modal-cancel"
                onClick={cancelDelete}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Add Teacher Modal ===== */}
      <TeacherModal
        isOpen={teacherPopUp}
        onClose={closeFormHandler}
      />
    </div>
  );
};

export default Teacher;

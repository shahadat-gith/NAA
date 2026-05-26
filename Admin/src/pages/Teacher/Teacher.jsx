import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import "./Teacher.css";
import TeacherModal from "./TeacherModal";
import { AdminContext } from "../../context/AdminContext";
import Loader from "../../components/Loader/Loader";

const Teacher = () => {
  const { adminToken, backendUrl } = useContext(AdminContext);

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teacherPopUp, setTeacherPopUp] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  /* ================= FETCH TEACHERS ================= */
  const fetchTeachers = async () => {
    if (!adminToken) return;
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/teacher/all-teachers`);
      if (response.data.success) {
        setTeachers(response.data.teachers || []);
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
      toast.error("Failed to load teachers");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD ON MOUNT ================= */
  useEffect(() => {
    fetchTeachers();
  }, [adminToken]);

  /* ================= DELETE ================= */
  const handleDelete = async (teacherId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this teacher?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${backendUrl}/api/teacher/delete-teacher/${teacherId}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      toast.success("Teacher deleted successfully");
      fetchTeachers();
    } catch (error) {
      console.error("Delete teacher error:", error);
      toast.error("Failed to delete teacher");
    }
  };

  /* ================= SEARCH ================= */
  const filteredTeachers = useMemo(() => {
    return (teachers || []).filter((teacher) =>
      (teacher.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [teachers, searchTerm]);

  if (loading)
    return <Loader text="Loading teachers..." />;

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
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />
          {searchTerm && (
            <button
              className="teacher-search-clear"
              onClick={() =>
                setSearchTerm("")
              }
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>

        <button
          className="teacher-add-btn"
          onClick={() =>
            setTeacherPopUp(true)
          }
        >
          <i className="fas fa-plus"></i>
          Add Teacher
        </button>
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
              {filteredTeachers.map(
                (teacher) => (
                  <tr key={teacher._id}>
                    <td>
                      <div className="teacher-info">
                        <img
                          src= {teacher.image.url ||"/user.png"}
                          alt={
                            teacher.name ||
                            "Teacher"
                          }
                          className="teacher-img"
                        />

                        <div className="teacher-details">
                          <Link
                            to={`/teachers/${teacher._id}`}
                            className="teacher-name"
                          >
                            {teacher.name ||
                              "Unnamed Teacher"}
                            <i className="fas fa-external-link-alt"></i>
                          </Link>
                        </div>
                      </div>
                    </td>

                    <td>
                      {teacher.email &&
                      teacher.email !== "N/A"
                        ? teacher.email
                        : "Not Available"}
                    </td>

                    <td>
                      {teacher.experience ||
                        0}{" "}
                      Years
                    </td>

                    <td>
                      <button
                        className="teacher-delete-btn"
                        onClick={() =>
                          handleDelete(
                            teacher._id
                          )
                        }
                      >
                        <i className="fas fa-trash"></i>
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              )}
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

      {/* ===== Add Teacher Modal ===== */}
      <TeacherModal
        isOpen={teacherPopUp}
        onClose={() =>
          setTeacherPopUp(false)
        }
        onSuccess={fetchTeachers}
      />
    </div>
  );
};

export default Teacher;

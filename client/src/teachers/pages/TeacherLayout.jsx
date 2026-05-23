import React, { useState, useEffect, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/TeacherLayout.css";
import { AppContext } from "../../context/AppContext";
import axios from "axios";

const TeacherLayout = () => {
  const { backendUrl } = useContext(AppContext);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("teacher-token");

  useEffect(() => {
    const loadTeacher = async () => {
      if (!token) {
        setError("Please log in as a teacher to view the portal.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${backendUrl}/api/auth/teacher/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTeacher(response.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load teacher data. Please log in again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (backendUrl) {
      loadTeacher();
    }
  }, [backendUrl, token]);

  if (loading) {
    return (
      <div className="teacher-loading-container">
        <div className="teacher-spinner"></div>
        <p>Loading teacher portal...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="teacher-error-card">
        <i className="fa-solid fa-triangle-exclamation error-icon"></i>
        <h2>Access Denied</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/teacher/login")} className="teacher-accent-button">
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="teacher-layout">
      <Navbar teacher = {teacher} />
      <main className="teacher-page-content">
        <Outlet context={[teacher, setTeacher]} />
      </main>
    </div>
  );
};

export default TeacherLayout;
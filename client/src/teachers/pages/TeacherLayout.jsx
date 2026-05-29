import React, { useState, useEffect, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/TeacherLayout.css";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import Loader from "../../components/Loader/Loader";
import toast from "react-hot-toast";

const TeacherLayout = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("teacher-token");
  const [loading, setLoading] = useState(true);
  
  const [dashboard, setDashboard] = useState({
    teacher: {},
    timetable: { schedule: [] },
    attendance: [],
    payments: [],
    dues: { totalDue: 0, dueMonths: [] },
  });

  useEffect(() => {
    // 1. Unified Route Protection Check
    if (!token) {
      toast.error("Please log in as a teacher to view the portal.");
      navigate("/teacher/login", { replace: true });
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/teacher/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setDashboard(response.data.dashboard);
        }
      } catch (err) {
        const message =
          err.response?.data?.message ||
          "Unable to load dashboard data. Please log in again.";

        toast.error(message);
        
        // Handle token expiration or invalidity immediately
        if (err.response?.status === 401) {
          localStorage.removeItem("teacher-token");
          navigate("/teacher/login", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    // 2. Fire fetch only if context is ready, otherwise let the application resolve context
    if (!backendUrl) {
      setLoading(false);
      toast.error("Server configuration unavailable. Please refresh the page.");
      return;
    }

    fetchDashboardData();
  }, [backendUrl, token, navigate]);

  // If there's no token, return null to completely prevent any flashing of unauthenticated UI elements
  if (!token) return null;

  return (
    <div className="teacher-layout loader-parent">
      {loading && <Loader overlay={false} />}

      <Navbar teacher={dashboard.teacher} />

      <main className="teacher-page-content">
        <Outlet context={{ dashboard, setDashboard, loading, setLoading }} />
      </main>
    </div>
  );
};

export default TeacherLayout;
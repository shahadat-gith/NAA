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

  // Redirection guard if token doesn't exist
  useEffect(() => {
    if (!token) {
      navigate("/teacher/login", { replace: true });
    }
  }, [navigate, token]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        toast.error("Please log in as a teacher to view the portal.");
        setLoading(false);
        return;
      }

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
        
        // Handle token expiration or invalidity
        if (err.response?.status === 401) {
          localStorage.removeItem("teacher-token");
          navigate("/teacher/login", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    if (backendUrl && token) {
      fetchDashboardData();
    }
  }, [backendUrl, token, navigate]);

  return (
    <div className="teacher-layout loader-parent">
      {loading && <Loader />}

      <Navbar teacher={dashboard.teacher} />

      <main className="teacher-page-content">
        <Outlet context={{ dashboard, setDashboard, loading }} />
      </main>
    </div>
  );
};

export default TeacherLayout;
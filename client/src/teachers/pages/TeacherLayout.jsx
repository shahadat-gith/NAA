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
  const [teacher, setTeacher] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("teacher-token");

  useEffect(() => {
    if (!token) {
      navigate("/teacher/login", { replace: true });
    }
  }, [navigate, token]);

  useEffect(() => {
    const loadTeacher = async () => {
      if (!token) {
        toast.error("Please log in as a teacher to view the portal.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${backendUrl}/api/auth/teacher/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTeacher(response.data.data);
      } catch (err) {
        const message =
          err.response?.data?.message ||
          "Unable to load teacher data. Please log in again.";

        toast.error(message);
        if (err.response?.status === 401) {
          localStorage.removeItem("teacher-token");
          navigate("/teacher/login", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    if (backendUrl) {
      loadTeacher();
    }
  }, [backendUrl, token, navigate]);

  return (
    <div className="teacher-layout loader-parent">
      {(loading || fetching) && <Loader />}

      <Navbar teacher={teacher} />

      <main className="teacher-page-content">
        <Outlet context={{ teacher, setTeacher, fetching, setFetching }} />
      </main>
    </div>
  );
};

export default TeacherLayout;
import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AppContext } from "../../context/AppContext";
import "../styles/TeacherLogin.css";
import background from "/search.webp";

const TeacherLogin = () => {
  const { backendUrl } = useContext(AppContext);
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!contact || !password) {
      return toast.error("Please enter both contact and password.");
    }

    if (!backendUrl) {
      return toast.error("Backend URL is not configured.");
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/teacher-login`,
        { contact, password }
      );

      if (response.data?.success) {
        localStorage.setItem("teacher-token", response.data.token);
        toast.success(response.data.message || "Login successful");
        navigate("/teacher");
      } else {
        toast.error(
          response.data?.message || "Login failed. Please check your credentials."
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to connect to server. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="teacher-login-page" 
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="teacher-login-card">
        <header className="teacher-login-header">
          <h1>Welcome back</h1>
          <p className="teacher-login-description">
            Enter your contact number and password to access the teacher portal.
          </p>
        </header>

        <form className="teacher-login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="contact">Contact number</label>
            <div className="input-wrapper">
              <i className="fa-solid fa-phone input-icon"></i>
              <input
                id="contact"
                type="text"
                value={contact}
                onChange={(event) => setContact(event.target.value)}
                placeholder="Enter your contact number"
                autoComplete="tel"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <i className="fa-solid fa-lock input-icon"></i>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>
          </div>

          <div className="teacher-forgot-wrapper">
            <button
              type="button"
              className="teacher-forgot-button"
              onClick={() => navigate("/teacher/forgot-password")}
            >
              Forgot password?
            </button>
          </div>

          <button
            className="teacher-login-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeacherLogin;
import React, { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Login.css";
import { UserContext } from "../../context/UserContext";
import { AppContext } from "../../context/AppContext";

const Login = () => {
  const { tab } = useParams();
  const [activeTab, setActiveTab] = useState(tab || "student");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { saveUserData } = useContext(UserContext);
  const { backendUrl,adminUrl } = useContext(AppContext);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setFormData({ email: "", password: "", rememberMe: false });
    setError("");
    navigate(`/login/${newTab}`);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const endpointMap = {
      student: "/api/auth/student-login",
      teacher: "/api/auth/teacher-login",
      admin: "/api/auth/admin-login",
    };

    const url = `${backendUrl}${endpointMap[activeTab]}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await response.json();

      const adminFrontendUrl = import.meta.env.VITE_ADMIN_URL;

      if (data.success) {
        if (activeTab === "admin") {
          window.location.href = `${adminFrontendUrl}/?token=${data.token}`;
        } else {
          saveUserData(activeTab, data.token, formData.rememberMe);
          navigate("/");
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h2 className="login-title">Login</h2>
          <p className="login-subtitle">Please select your role and sign in</p>
        </div>

        <div className="login-tabs">
          <button
            className={`login-tab ${activeTab === "student" ? "active" : ""}`}
            onClick={() => handleTabChange("student")}
          >
            <i className="fas fa-user-graduate tab-icon"></i> Student
          </button>
          <button
            className={`login-tab ${activeTab === "teacher" ? "active" : ""}`}
            onClick={() => handleTabChange("teacher")}
          >
            <i className="fas fa-chalkboard-teacher tab-icon"></i> Teacher
          </button>
          <button
            className={`login-tab ${activeTab === "admin" ? "active" : ""}`}
            onClick={() => handleTabChange("admin")}
          >
            <i className="fas fa-user-shield tab-icon"></i> Admin
          </button>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
              />
              <label htmlFor="rememberMe">Remember Me</label>
            </div>
            <a href={`/forgot-password/${activeTab}`} className="forgot-password">
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="login-submit-btn" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="login-footer">
          <p className="login-help-text">
            Need help? <a href="/contact">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
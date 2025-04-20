import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ForgotPassword.css";
import { AppContext } from "../../context/AppContext";
import {toast} from 'react-toastify'

const ForgotPassword = () => {
  const { tab } = useParams();
  const [activeTab, setActiveTab] = useState(tab || "student");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  useEffect(() => {
    if (tab && ["student", "teacher"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [tab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setStep(1);
    setFormData({
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    });
    setError("");
    setSuccess("");
    navigate(`/forgot-password/${tab}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!formData.email) {
      setError("Please enter your email");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/auth/forgot-password/${activeTab}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        setStep(2);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!formData.otp) {
      setError("Please enter the OTP");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/auth/forgot-password/${activeTab}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: formData.otp }),
      });
      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        setStep(3);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("OTP verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!formData.newPassword || !formData.confirmPassword) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/auth/forgot-password/${activeTab}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, newPassword: formData.newPassword }),
      });
      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        toast.success(data.message)
        setTimeout(() => navigate('/'), 2000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-header">
          <h1 className="forgot-password-title">Nashib Ali Academy</h1>
          <p className="forgot-password-subtitle">Reset Your Password</p>
        </div>

        <div className="forgot-password-tabs">
          <button
            className={`forgot-password-tab ${activeTab === "student" ? "active" : ""}`}
            onClick={() => handleTabChange("student")}
          >
            <i className="fas fa-user-graduate tab-icon"></i>
            Student
          </button>
          <button
            className={`forgot-password-tab ${activeTab === "teacher" ? "active" : ""}`}
            onClick={() => handleTabChange("teacher")}
          >
            <i className="fas fa-chalkboard-teacher tab-icon"></i>
            Teacher
          </button>
        </div>

        {error && <div className="forgot-password-error">{error}</div>}
        {success && <div className="forgot-password-success">{success}</div>}

        {step === 1 && (
          <form className="forgot-password-form" onSubmit={handleSendOTP}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={`Enter your ${activeTab} email`}
                required
              />
            </div>
            <button type="submit" className="forgot-password-submit-btn" disabled={isLoading}>
              {isLoading ? (
                <span>
                  <i className="fas fa-spinner fa-spin"></i> Sending OTP...
                </span>
              ) : (
                <span>Send OTP</span>
              )}
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="forgot-password-form" onSubmit={handleVerifyOTP}>
            <div className="form-group">
              <label htmlFor="otp">OTP</label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={formData.otp}
                onChange={handleInputChange}
                placeholder="Enter the OTP sent to your email"
                required
              />
            </div>
            <button type="submit" className="forgot-password-submit-btn" disabled={isLoading}>
              {isLoading ? (
                <span>
                  <i className="fas fa-spinner fa-spin"></i> Verifying...
                </span>
              ) : (
                <span>Verify OTP</span>
              )}
            </button>
          </form>
        )}

        {step === 3 && (
          <form className="forgot-password-form" onSubmit={handleResetPassword}>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Enter your new password"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your new password"
                required
              />
            </div>
            <button type="submit" className="forgot-password-submit-btn" disabled={isLoading}>
              {isLoading ? (
                <span>
                  <i className="fas fa-spinner fa-spin"></i> Resetting...
                </span>
              ) : (
                <span>Reset Password</span>
              )}
            </button>
          </form>
        )}

        <div className="forgot-password-footer">
          <p className="forgot-password-help-text">
            Back to{" "}
            <a href={`/login/${activeTab}`} className="login-link">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
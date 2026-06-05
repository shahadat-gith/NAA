import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { AppContext } from "../../context/AppContext";
import "../styles/ForgotPassword.css";

const ForgotPassword = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [step, setStep] = useState("send-otp");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSendOtp = async () => {
    if (!email.trim()) {
      return toast.error("Please enter your email address.");
    }
    if (!validateEmail(email.trim())) {
      return toast.error("Please enter a valid email address.");
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/forgot-password/staff/send-otp`,
        { email: email.trim().toLowerCase() }
      );

      if (response.data?.success) {
        toast.success(response.data.message || "OTP sent to your email.");
        setStep("verify-otp");
      } else {
        toast.error(response.data?.message || "Unable to send OTP.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to send OTP. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim() || otp.trim().length !== 6) {
      return toast.error("Please enter the 6-digit OTP.");
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/forgot-password/staff/verify-otp`,
        { email: email.trim().toLowerCase(), otp: otp.trim() }
      );

      if (response.data?.success) {
        toast.success(response.data.message || "OTP verified.");
        setStep("reset-password");
      } else {
        toast.error(response.data?.message || "Invalid OTP.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "OTP verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      return toast.error("Please enter and confirm your new password.");
    }
    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/forgot-password/staff/reset-password`,
        { email: email.trim().toLowerCase(), newPassword }
      );

      if (response.data?.success) {
        toast.success(response.data.message || "Password reset successfully.");
        navigate("/staff/login");
      } else {
        toast.error(response.data?.message || "Unable to reset password.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Password reset failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (step === "send-otp") {
      return (
        <>
          <p className="forgot-description">
            Enter the email linked to your staff account and we will send you a verification code.
          </p>
          <label className="forgot-label">
            Registered Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="staff@example.com"
              className="forgot-input"
            />
          </label>
          <button
            className="forgot-button"
            type="button"
            onClick={handleSendOtp}
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </>
      );
    }

    if (step === "verify-otp") {
      return (
        <>
          <p className="forgot-description">
            Enter the 6-digit code sent to <strong>{email}</strong>.
          </p>
          <label className="forgot-label">
            Verification Code
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              maxLength={6}
              className="forgot-input"
            />
          </label>
          <button
            className="forgot-button"
            type="button"
            onClick={handleVerifyOtp}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      );
    }

    return (
      <>
        <p className="forgot-description">
          Choose a new password for your staff account linked to <strong>{email}</strong>.
        </p>
        <label className="forgot-label">
          New Password
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New secure password"
            className="forgot-input"
          />
        </label>
        <label className="forgot-label">
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            className="forgot-input"
          />
        </label>
        <button
          className="forgot-button"
          type="button"
          onClick={handleResetPassword}
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </>
    );
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <div className="forgot-top">
          <h1>Forgot Password</h1>
          <p className="forgot-subtitle">Staff account recovery</p>
        </div>

        <div className="forgot-stepper">
          <span className={step === "send-otp" ? "active" : ""}>1. Email</span>
          <span className={step === "verify-otp" ? "active" : ""}>2. Verify</span>
          <span className={step === "reset-password" ? "active" : ""}>3. Reset</span>
        </div>

        <div className="forgot-form">{renderContent()}</div>

        <button
          className="forgot-secondary"
          type="button"
          onClick={() => navigate("/staff/login")}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;

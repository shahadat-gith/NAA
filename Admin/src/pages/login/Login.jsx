import React, { useState } from 'react';
import { User, Lock, X, GraduationCap, Shield } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [loginType, setLoginType] = useState('teacher');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log(`${loginType} login attempt:`, formData);
      setIsLoading(false);
    }, 1500);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <div className="app-container">
        <button
          onClick={() => setIsOpen(true)}
          className="open-button"
        >
          Open Login
        </button>
      </div>
    );
  }

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        {/* Header */}
        <div className="popup-header">
          <button
            onClick={handleClose}
            className="close-button"
          >
            <X size={24} />
          </button>
          <div className="header-content">
            <div className="icon-container">
              {loginType === 'teacher' ? (
                <GraduationCap className="icon" size={28} />
              ) : (
                <Shield className="icon" size={28} />
              )}
            </div>
            <h2 className="header-title">Welcome Back</h2>
            <p className="header-subtitle">
              Sign in to your {loginType} account
            </p>
          </div>
        </div>

        {/* Login Type Selector */}
        <div className="login-type-selector">
          <div className="selector-container">
            <button
              onClick={() => setLoginType('teacher')}
              className={`selector-button ${loginType === 'teacher' ? 'active' : ''}`}
            >
              <GraduationCap className="inline-icon" size={16} />
              Teacher
            </button>
            <button
              onClick={() => setLoginType('admin')}
              className={`selector-button ${loginType === 'admin' ? 'active' : ''}`}
            >
              <Shield className="inline-icon" size={16} />
              Admin
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="form-container">
          <div className="form-group">
            {/* Email Input */}
            <div className="input-wrapper">
              <div className="input-icon">
                <User className="icon" size={20} />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email address"
                className="form-input"
                required
              />
            </div>

            {/* Password Input */}
            <div className="input-wrapper">
              <div className="input-icon">
                <Lock className="icon" size={20} />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="form-input"
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  className="checkbox-input"
                />
                <span className="checkbox-text">Remember me</span>
              </label>
              <a href="#" className="forgot-password">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`submit-button ${loginType === 'teacher' ? 'teacher' : 'admin'} ${isLoading ? 'loading' : ''}`}
            >
              {isLoading ? (
                <div className="loading-content">
                  <div className="spinner"></div>
                  Signing in...
                </div>
              ) : (
                `Sign in as ${loginType}`
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="popup-footer">
          <p className="footer-text">
            Need help? <a href="#" className="support-link">Contact support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
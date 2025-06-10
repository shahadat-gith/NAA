import React, { useState, useEffect, useContext } from 'react';
import './ForgotPassword.css';
import { AppContext } from '../../context/AppContext';

const ForgotPassword = ({ isOpen, onClose }) => {
  const { backendUrl } = useContext(AppContext);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSuccessConfirmation, setShowSuccessConfirmation] = useState(false); // New state for success confirmation

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setFormData({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsLoading(false);
      setError('');
      setSuccess('');
      setShowSuccessConfirmation(false);
    }
  }, [isOpen]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
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
    setError('');
    setSuccess('');

    if (!formData.email) {
      setError('Email address is required');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/auth/forgot-password/teacher`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, action: 'send-otp' }),
      });
      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        setStep(2);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.otp) {
      setError('OTP is required');
      return;
    }

    if (!/^\d{6}$/.test(formData.otp)) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/auth/forgot-password/teacher`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp: formData.otp, action: 'verify-otp' }),
      });
      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        setStep(3);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('OTP verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.newPassword || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/auth/forgot-password/teacher`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, newPassword: formData.newPassword, action: 'reset-password' }),
      });
      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        setShowSuccessConfirmation(true); // Show success confirmation
        setTimeout(() => onClose(), 3000); // Close modal after 3 seconds
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Password reset failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setFormData({ ...formData, otp: '' });
    setStep(1);
    setError('');
    setSuccess('');

    setIsLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/auth/forgot-password/teacher`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, action: 'send-otp' }),
      });
      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="forgot-password-modal">
        {showSuccessConfirmation ? (
          <div className="success-confirmation">
            <div className="success-checkmark">
              <svg viewBox="0 0 52 52" className="checkmark">
                <circle cx="26" cy="26" r="25" fill="none" />
                <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
            </div>
            <h2 className="success-confirmation-title">Password Reset Successful!</h2>
            <p className="success-confirmation-message">
              Your password has been successfully reset. You will be redirected to the login page shortly.
            </p>
          </div>
        ) : (
          <>
            <button
              className="modal-close"
              onClick={onClose}
              aria-label="Close modal"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="forgot-password-header">
              <div className="lock-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="16" r="1" fill="currentColor" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <h1 className="forgot-password-title">Forgot Password?</h1>
              <p className="forgot-password-subtitle">
                {step === 1 && 'Enter your email to receive a reset code.'}
                {step === 2 && 'Enter the OTP sent to your email.'}
                {step === 3 && 'Set a new password for your account.'}
              </p>
            </div>

            {error && <span className="error-message">{error}</span>}
            {success && <span className="success-message">{success}</span>}

            {step === 1 && (
              <form onSubmit={handleSendOTP} className="forgot-password-form">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`form-input ${error ? 'error' : ''}`}
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="submit"
                  className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Sending OTP...
                    </>
                  ) : (
                    'Send OTP'
                  )}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOTP} className="forgot-password-form">
                <div className="form-group">
                  <label htmlFor="otp" className="form-label">
                    OTP Code
                  </label>
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    className={`form-input ${error ? 'error' : ''}`}
                    placeholder="Enter the 6-digit OTP"
                    value={formData.otp}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="submit"
                  className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Verifying...
                    </>
                  ) : (
                    'Verify OTP'
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleResendEmail}
                  disabled={isLoading}
                >
                  Resend OTP
                </button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleResetPassword} className="forgot-password-form">
                <div className="form-group">
                  <label htmlFor="newPassword" className="form-label">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    className={`form-input ${error ? 'error' : ''}`}
                    placeholder="Enter your new password"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className={`form-input ${error ? 'error' : ''}`}
                    placeholder="Confirm your new password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="submit"
                  className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Resetting...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
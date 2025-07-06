import React, { useContext, useState } from 'react';
import { User, Lock, GraduationCap, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import './Login.css';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import ForgotPassword from '../ForgotPassword/ForgotPassword';

const Login = () => {
  const { backendUrl, adminUrl } = useContext(AppContext);
  const { saveUserData } = useContext(UserContext);
  const [loginType, setLoginType] = useState('teacher');
  const [formData, setFormData] = useState({ contact: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (loginType === 'teacher') {
        const response = await axios.post(`${backendUrl}/api/auth/teacher-login`, formData);
        if (response.data.success) {
          const token = response.data.token;
          await saveUserData('teacher', token, rememberMe);
          toast.success(response.data.message);
          navigate('/');
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(`${backendUrl}/api/auth/admin-login`, formData);
        if (response.data.success) {
          const token = response.data.token;
          toast.success(response.data.message);
          window.location.href = `${adminUrl}?token=${token}`;
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const openForgotPassword = (e) => {
    e.preventDefault();
    setIsForgotPasswordOpen(true);
  };

  const closeForgotPassword = () => {
    setIsForgotPasswordOpen(false);
  };

  return (
    <div className="login-page">
      <div className="login-page__background"></div>
      <div className="login-page__container">
        <div className="login-page__form-section">
          <form className="login-page__form" onSubmit={handleSubmit}>
            <h2 className="login-page__title">Sign in</h2>
            <p className="login-page__subtitle">
              Welcome back! Please sign in to your {loginType} account
            </p>

            <div className="login-page__type-selector">
              <button
                type="button"
                onClick={() => setLoginType('teacher')}
                className={`login-page__type-button ${loginType === 'teacher' ? 'login-page__type-button--active' : ''}`}
              >
                <GraduationCap className="login-page__type-icon" size={18} />
                Teacher
              </button>
              <button
                type="button"
                onClick={() => setLoginType('admin')}
                className={`login-page__type-button ${loginType === 'admin' ? 'login-page__type-button--active' : ''}`}
              >
                <Shield className="login-page__type-icon" size={18} />
                Admin
              </button>
            </div>

            <button type="button" className="login-page__google-button">
              <img
                src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
                alt="googleLogo"
              />
            </button>

            <div className="login-page__divider">
              <div className="login-page__divider-line"></div>
              <p className="login-page__divider-text">or sign in with phone</p>
              <div className="login-page__divider-line"></div>
            </div>

            <div className="login-page__input-group">
              <User className="login-page__input-icon" size={20} />
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                placeholder="Phone Number"
                className="login-page__input"
                required
                pattern="[0-9]{10}"
                title="Please enter a valid 10-digit phone number"
              />
            </div>

            <div className="login-page__input-group">
              <Lock className="login-page__input-icon" size={20} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="login-page__input"
                required
              />
            </div>

            <div className="login-page__options">
              <div className="login-page__checkbox-group">
                <input
                  type="checkbox"
                  id="checkbox"
                  className="login-page__checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <label htmlFor="checkbox" className="login-page__checkbox-label">
                  Remember me
                </label>
              </div>
              <a
                href="#"
                className="login-page__forgot-link"
                onClick={openForgotPassword}
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`login-page__submit-button ${isLoading ? 'login-page__submit-button--disabled' : ''}`}
            >
              {isLoading ? (
                <div className="login-page__loading">
                  <div className="login-page__spinner"></div>
                  Signing in...
                </div>
              ) : (
                `Sign in as ${loginType}`
              )}
            </button>

            <p className="login-page__signup-text">
              Don't have an account? <a href="#" className="login-page__signup-link">Sign up</a>
            </p>
          </form>
        </div>
      </div>

      <ForgotPassword isOpen={isForgotPasswordOpen} onClose={closeForgotPassword} />
    </div>
  );
};

export default Login;
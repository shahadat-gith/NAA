import React, { useContext, useState } from "react";
import { User, Lock, GraduationCap, Shield, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import "./Login.css";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import ForgotPassword from "../ForgotPassword/ForgotPassword";

const Login = () => {
  const { backendUrl, adminUrl } = useContext(AppContext);
  const { saveUserData } = useContext(UserContext);

  const [loginType, setLoginType] = useState("teacher");
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    registrationNo: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetFields = () => {
    setFormData({
      phone: "",
      email: "",
      registrationNo: "",
      password: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let url = "";
      let payload = {};

      if (loginType === "teacher") {
        url = `${backendUrl}/api/auth/teacher-login`;
        payload = {
          phone: formData.phone,
          password: formData.password,
        };
      }

      if (loginType === "admin") {
        url = `${backendUrl}/api/auth/admin-login`;
        payload = {
          email: formData.email,
          password: formData.password,
        };
      }

      if (loginType === "student") {
        url = `${backendUrl}/api/auth/student-login`;
        payload = {
          registrationNo: formData.registrationNo,
          password: formData.password,
        };
      }

      const response = await axios.post(url, payload);

      if (!response.data.success) {
        toast.error(response.data.message);
        return;
      }

      const token = response.data.token;

      if (loginType === "admin") {
        toast.success(response.data.message);
        window.location.href = `${adminUrl}?token=${token}`;
        return;
      }

      await saveUserData(loginType, token, rememberMe);
      toast.success(response.data.message);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__background"></div>

      <div className="login-page__container">
        <div className="login-page__form-section">
          <form className="login-page__form" onSubmit={handleSubmit}>
            <h2 className="login-page__title">Sign in</h2>

            <div className="login-page__type-selector">
              <button
                type="button"
                onClick={() => {
                  setLoginType("teacher");
                  resetFields();
                }}
                className={`login-page__type-button ${
                  loginType === "teacher" ? "login-page__type-button--active" : ""
                }`}
              >
                <GraduationCap size={18} /> Teacher
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginType("student");
                  resetFields();
                }}
                className={`login-page__type-button ${
                  loginType === "student" ? "login-page__type-button--active" : ""
                }`}
              >
                <BookOpen size={18} /> Student
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginType("admin");
                  resetFields();
                }}
                className={`login-page__type-button ${
                  loginType === "admin" ? "login-page__type-button--active" : ""
                }`}
              >
                <Shield size={18} /> Admin
              </button>
            </div>

            {/* Dynamic Identifier Field */}
            {loginType === "teacher" && (
              <div className="login-page__input-group">
                <User size={20} />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  pattern="[0-9]{10}"
                  required
                />
              </div>
            )}

            {loginType === "admin" && (
              <div className="login-page__input-group">
                <User size={20} />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            {loginType === "student" && (
              <div className="login-page__input-group">
                <User size={20} />
                <input
                  type="text"
                  name="registrationNo"
                  placeholder="Registration Number"
                  value={formData.registrationNo}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            {/* Password */}
            <div className="login-page__input-group">
              <Lock size={20} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Remember & Forgot */}
            <div className="login-page__options">
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />{" "}
                Remember me
              </label>

              <button
                type="button"
                className="login-page__forgot-link"
                onClick={() => setIsForgotPasswordOpen(true)}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="login-page__submit-button"
            >
              {isLoading ? "Signing in..." : `Sign in as ${loginType}`}
            </button>
          </form>
        </div>
      </div>

      <ForgotPassword
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
    </div>
  );
};

export default Login;

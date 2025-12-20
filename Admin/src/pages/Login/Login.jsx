import React, { useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AdminContext } from "../../context/AdminContext";
import { useNavigate } from "react-router-dom";
import "./Login.css"

const Login = () => {
  const { backendUrl, setAdminToken } = useContext(AdminContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${backendUrl}/api/auth/admin-login`,
        formData
      );

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }

      const token = res.data.token;

      setAdminToken(token);
      localStorage.setItem("adminToken", token);

      toast.success("Admin logged in successfully");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <form onSubmit={handleSubmit}>
        <h2>Admin Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Admin Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;

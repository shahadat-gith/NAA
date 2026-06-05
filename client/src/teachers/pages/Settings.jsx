import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { AppContext } from "../../context/AppContext";
import ProfileUpdateModal from "../components/ProfileUpdateModal";
import "../styles/Settings.css";

const Settings = () => {
  const { backendUrl } = React.useContext(AppContext);
  const { dashboard, setDashboard } = useOutletContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submittingPassword, setSubmittingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const staff = dashboard.staff || {};
  const token = localStorage.getItem("staff-token");

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      return toast.error("Please fill both password fields.");
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error("New password and confirmation do not match.");
    }

    if (!backendUrl) {
      return toast.error("Server configuration is unavailable.");
    }

    setSubmittingPassword(true);
    try {
      const response = await axios.put(
        `${backendUrl}/api/auth/staff/update-password`,
        { newPassword: passwordForm.newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        toast.success(response.data.message || "Password updated successfully.");
        setPasswordForm({ newPassword: "", confirmPassword: "" });
      } else {
        toast.error(response.data?.message || "Unable to update password.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Password update failed.");
    } finally {
      setSubmittingPassword(false);
    }
  };

  return (
    <div className="teacher-settings-page">
      <div className="teacher-settings-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your staff profile, password and portal preferences.</p>
        </div>

        <button
          type="button"
          className="teacher-settings-edit-btn"
          onClick={() => setIsModalOpen(true)}
        >
          Edit Profile
        </button>
      </div>

      <div className="teacher-settings-grid">
        <section className="teacher-settings-card">
          <h2>Profile Summary</h2>
          <div className="teacher-settings-field">
            <span>Name</span>
            <strong>{staff?.name || "N/A"}</strong>
          </div>
          <div className="teacher-settings-field">
            <span>Email</span>
            <strong>{staff?.email || "N/A"}</strong>
          </div>
          <div className="teacher-settings-field">
            <span>Contact</span>
            <strong>{staff?.contact || "N/A"}</strong>
          </div>
          <div className="teacher-settings-field">
            <span>Designation</span>
            <strong>{staff?.designation || "N/A"}</strong>
          </div>
          <div className="teacher-settings-field">
            <span>Staff ID</span>
            <strong>{staff?.staffId || "NAA-STAFF"}</strong>
          </div>
          <div className="teacher-settings-field">
            <span>Department</span>
            <strong>{staff?.subjectTaught || staff?.subject || "N/A"}</strong>
          </div>
        </section>

        <section className="teacher-settings-card">
          <h2>Security</h2>
          <form className="teacher-settings-form" onSubmit={handlePasswordChange}>
            <label>
              New Password
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
                }
                placeholder="Enter new password"
                required
              />
            </label>

            <label>
              Confirm Password
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                }
                placeholder="Confirm new password"
                required
              />
            </label>

            <button className="teacher-settings-submit" type="submit" disabled={submittingPassword}>
              {submittingPassword ? "Updating..." : "Change Password"}
            </button>
          </form>
        </section>
      </div>

      {isModalOpen && (
        <ProfileUpdateModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          teacherData={staff}
          onUpdateSuccess={(updatedStaff) =>
            setDashboard((prev) => ({
              ...prev,
              staff: {
                ...prev.staff,
                ...updatedStaff,
              },
            }))
          }
        />
      )}
    </div>
  );
};

export default Settings;

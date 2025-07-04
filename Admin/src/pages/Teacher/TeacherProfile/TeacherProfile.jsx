import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import "./TeacherProfile.css";
import { TeacherContext } from "../../../context/TeacherContext";
import OverViewTab from "./Components/OverViewTab";
import TransactionsTab from "./Components/TransactionsTab";
import { AdminContext } from "../../../context/AdminContext";
import AttendanceTab from "./Components/AttendanceTab"; // Updated import path
import BankTab from "./Components/BankTab";
import axios from "axios";
import toast from 'react-hot-toast';

const TeacherProfile = () => {
  const { adminToken } = useContext(AdminContext);
  const { teacherId } = useParams();
  const { backendUrl, teachers } = useContext(TeacherContext);
  const [teacher, setTeacher] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showPayForm, setShowPayForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    date: "",
    status: "Successful",
  });

  const fetchTeacherData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/teacher/teacher/${teacherId}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (response.data.success) {
        setTeacher(response.data.teacher);
        setFormData((prev) => ({ ...prev, amount: response.data.teacher.salary?.toString() || "" }));
      } else {
        console.error('Teacher fetch failed:', response.data.message);
        setError(response.data.message || "Failed to fetch teacher data.");
        setTeacher(null);
      }
    } catch (error) {
      console.error("Error fetching teacher data:", error.message, error.response?.data);
      setError(error.response?.data?.message || "Error fetching teacher data.");
      setTeacher(null);
    }
  };

  const recordPayment = async (paymentData) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/teacher/record-transaction`,
        paymentData,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      if (response.data.success) {
        toast.success("Payment recorded successfully!");
        await fetchTeacherData();
      } else {
        setError(response.data.message || "Failed to record payment.");
        toast.error(response.data.message || "Failed to record payment.");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Error recording payment.";
      console.error('Record payment error:', message, error.response?.data);
      setError(message);
      toast.error(message);
    }
  };

  useEffect(() => {
    fetchTeacherData();
  }, [teacherId, backendUrl, adminToken]);

  useEffect(() => {
    if (teacher) {
      setAttendance(teacher.attendance || []);
      setTransactions(teacher.transactions || []);
    }
  }, [teacher]);

  useEffect(() => {
    const selectedTeacher = Array.isArray(teachers)
      ? teachers.find((t) => t._id === teacherId)
      : teachers[teacherId];
    if (selectedTeacher && (!teacher || teacher._id !== selectedTeacher._id)) {
      setTeacher(selectedTeacher);
      setFormData((prev) => ({ ...prev, amount: selectedTeacher.salary?.toString() || "" }));
      setAttendance(selectedTeacher.attendance || []);
      setTransactions(selectedTeacher.transactions || []);
    }
  }, [teacherId, teachers, teacher]);

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!showPayForm) {
      setFormData({
        amount: teacher?.salary?.toString() || "",
        description: "Salary",
        date: new Date().toISOString().slice(0, 7),
        status: "Successful",
      });
      setError("");
      setShowPayForm(true);
      return;
    }

    setIsSubmitting(true);
    setError("");

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid positive amount.");
      setIsSubmitting(false);
      toast.error("Please enter a valid positive amount.");
      return;
    }

    const paymentData = {
      teacherId: teacher._id,
      amount,
      description: formData.description,
      paymentMonth: formData.date || new Date().toISOString().slice(0, 7),
    };

    try {
      await recordPayment(paymentData);
      setShowPayForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!teacher) {
    return (
      <div className="error-container">
        <p>Teacher profile not found in database.</p>
      </div>
    );
  }

  const monthlyAttendance = attendance.filter(
    (att) =>
      new Date(att.date).getMonth() === new Date().getMonth() &&
      new Date(att.date).getFullYear() === new Date().getFullYear()
  );
  const presentCount = monthlyAttendance.filter((att) => att.status === "Present" || att.status === "Late").length;
  const absentCount = monthlyAttendance.filter((att) => att.status === "Absent").length;
  const totalDays = presentCount + absentCount;
  const attendancePercentage = totalDays > 0 ? (presentCount / totalDays) * 100 : 0;

  // Format subjects for display
  const formatSubjects = (mappings) => {
    if (!mappings || mappings.length === 0) return "N/A";
    return mappings.map((mapping) => mapping.subject).join(", ");
  };

  return (
    <div className="teacher-profile-container">
      <div className="profile-header">
        <div className="profile-avatar-content">
          <div className="profile-avatar-img">
            <img
              src={teacher.image}
              alt={teacher.name}
              className="avatar-image"
              onError={(e) => (e.target.src = "/default-avatar.png")}
            />
          </div>
          <div className="profile-avatar-name">
            <h1 className="teacher-name">{teacher.name}</h1>
          </div>
          <div className="profile-avatar-teacher-experience">
            <h4 className="teacher-title">{teacher.experience ? `${teacher.experience} years experience` : "N/A"}</h4>
          </div>
        </div>

        <div className="profile-header-info">
          <div className="quick-stats">
            <div className="stat-item">
              <span className="stat-label">Salary</span>
              <span className="stat-value">₹{teacher.salary?.toLocaleString() || "N/A"}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Balance Due</span>
              <span className="stat-value">₹{(teacher?.dueBalance || 0).toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Attendance</span>
              <span className="stat-value">{attendancePercentage.toFixed(2)}%</span>
            </div>
          </div>
        </div>

        <div className="pay-action">
          <button
            className="btn btn-pay"
            onClick={handleRecordPayment}
            disabled={isSubmitting}
          >
            Record Payment
          </button>
        </div>
      </div>

      {showPayForm && (
        <div className="card pay-form-card">
          <h2 className="card-title">Record Payment</h2>
          <div className="card-content">
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleRecordPayment} className="pay-form">
              <div className="form-group">
                <label htmlFor="amount">Payment Amount (₹)</label>
                <input
                  type="text"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  pattern="[0-9]+(\.[0-9]{1,2})?"
                  title="Please enter a valid amount (e.g., 50000 or 50000.00)"
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  id="description" // Fixed ID to match name
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label htmlFor="date">Payment Month (YYYY-MM)</label>
                <input
                  type="month"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-pay" disabled={isSubmitting}>
                  {isSubmitting ? "Recording..." : "Record Payment"}
                </button>
                <button
                  type="button"
                  className="btn btn-cancel"
                  onClick={() => {
                    setShowPayForm(false);
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="profile-nav">
        <ul className="nav-tabs">
          <li className={activeTab === "overview" ? "active" : ""}>
            <button onClick={() => setActiveTab("overview")}>Overview</button>
          </li>
          <li className={activeTab === "attendance" ? "active" : ""}>
            <button onClick={() => setActiveTab("attendance")}>Attendance</button>
          </li>
          <li className={activeTab === "transactions" ? "active" : ""}>
            <button onClick={() => setActiveTab("transactions")}>Transactions</button>
          </li>
          <li className={activeTab === "bank" ? "active" : ""}>
            <button onClick={() => setActiveTab("bank")}>Bank Details</button>
          </li>
        </ul>
      </div>

      <div className="profile-content">
        {activeTab === "overview" && (
          <OverViewTab
            teacher={teacher}
            attendance={attendance}
            monthlyAttendance={monthlyAttendance}
          />
        )}
        {activeTab === "attendance" && (
          <AttendanceTab
            teacher={teacher}
            backendUrl={backendUrl}
            adminToken={adminToken}
            attendance={attendance}
            setAttendance={setAttendance}
            setError={setError}
            setTeacher={setTeacher}
          />
        )}
        {activeTab === "transactions" && (
          <TransactionsTab transactions={transactions} />
        )}
        {activeTab === "bank" && <BankTab teacher={teacher} />}
      </div>
    </div>
  );
};

export default TeacherProfile;
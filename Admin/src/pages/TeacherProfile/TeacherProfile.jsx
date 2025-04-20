import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import "./TeacherProfile.css";
import { TeacherContext } from "../../context/TeacherContext";
import OverViewTab from "./components/OverViewTab";
import TransactionsTab from "./components/TransactionsTab";
import { AdminContext } from "../../context/AdminContext";
import { fetchTeacherData, fetchAttendanceData, fetchTransactions, recordPayment } from "./api";
import AttendanceTab from "./Components/AttendanceTab";

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
  const [isClearingDue, setIsClearingDue] = useState(false);

  useEffect(() => {
    fetchTeacherData(backendUrl, adminToken, teacherId, setTeacher, setFormData, setError);
  }, [teacherId, backendUrl, adminToken]);

  useEffect(() => {
    if (teacher) {
      fetchAttendanceData(backendUrl, adminToken, teacher._id, setAttendance, setError);
      fetchTransactions(backendUrl, adminToken, teacher._id, setTransactions, setError);
    }
  }, [teacher, backendUrl, adminToken]);

  useEffect(() => {
    const selectedTeacher = Array.isArray(teachers)
      ? teachers.find((t) => t._id === teacherId)
      : teachers[teacherId];
    if (selectedTeacher && (!teacher || teacher._id !== selectedTeacher._id)) {
      setTeacher(selectedTeacher);
      setFormData((prev) => ({ ...prev, amount: selectedTeacher.salary || "" }));
    }
  }, [teacherId, teachers, teacher]);

  const handlePaySalary = async (e, selectedPaymentMonth = null) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const description = isClearingDue ? "Due balance" : "Salary";
    const paymentData = {
      teacherId: teacher._id,
      amount: parseFloat(formData.amount),
      description,
      paymentMonth: formData.date || selectedPaymentMonth || new Date().toISOString().slice(0, 7),
    };

    try {
      await recordPayment(backendUrl, adminToken, paymentData, setTransactions, setTeacher, setError);
      setShowPayForm(false);
      setIsClearingDue(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearDue = (e) => {
    e.preventDefault();
    if (teacher.dueBalance > 0) {
      setFormData({
        amount: teacher.dueBalance,
        description: "Due balance",
        date: "",
        status: "Successful",
      });
      setIsClearingDue(true);
      setShowPayForm(true);
    }
  };

  if (!teacher) {
    return (
      <div className="error-container">
        <p>Teacher profile not found in database.</p>
      </div>
    );
  }

  const calculateDueBalance = () => {
    if (!teacher || !teacher.salary || !teacher.createdAt) return 0;
    const currentDate = new Date();
    const startDate = new Date(teacher.createdAt);
    if (isNaN(startDate.getTime())) return 0;

    const monthsSinceStart =
      (currentDate.getFullYear() - startDate.getFullYear()) * 12 +
      (currentDate.getMonth() - startDate.getMonth());
    const salaryPerMonth = teacher.salary || 0;

    const paidMonths = new Set(
      transactions
        .filter((t) => t.status === "Successful" && t.paymentMonth)
        .map((t) => t.paymentMonth)
    );

    let totalDue = 0;
    for (let i = 0; i <= monthsSinceStart; i++) {
      const monthDate = new Date(startDate);
      monthDate.setMonth(startDate.getMonth() + i);
      const monthKey = `${monthDate.getFullYear()}-${(monthDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
      if (!paidMonths.has(monthKey) && monthDate <= currentDate) {
        totalDue += salaryPerMonth;
      }
    }
    return totalDue;
  };

  const monthlyAttendance = attendance.filter(
    (att) =>
      new Date(att.date).getMonth() === new Date().getMonth() &&
      new Date(att.date).getFullYear() === new Date().getFullYear()
  );
  const presentCount = monthlyAttendance.filter((att) => att.status === "Present" || att.status === "Late").length;
  const absentCount = monthlyAttendance.filter((att) => att.status === "Absent").length;
  const totalDays = presentCount + absentCount;
  const attendancePercentage = totalDays > 0 ? (presentCount / totalDays) * 100 : 0;

  return (
    <div className="teacher-profile-container">
      <div className="profile-header">
        <div className="profile-avatar-content">
          <div className="profile-avatar-img">
            <img
              src={`${backendUrl}/${teacher.image}`}
              alt={teacher.name}
              className="avatar-image"
              onError={(e) => (e.target.src = "/default-avatar.png")}
            />
          </div>
          <div className="profile-avatar-name">
            <h1 className="teacher-name">
              {teacher.name}
            </h1>
          </div>
          <div className="profile-avatar-teacher-subject">
            <h3 className="teacher-title">{teacher.subject} Teacher</h3>
          </div>
          <div className="profile-avatar-teacher-experience">
            <h4 className="teacher-title">{teacher.experience} years experience</h4>
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
              <span className="stat-value">₹{calculateDueBalance().toLocaleString()}</span>
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
            onClick={handleClearDue}
            disabled={isSubmitting || calculateDueBalance() === 0}
          >
            Clear Due
          </button>
        </div>
      </div>

      {showPayForm && (
        <div className="card pay-form-card">
          <h2 className="card-title">{isClearingDue ? "Record Due Payment" : "Record Salary Payment"}</h2>
          <div className="card-content">
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handlePaySalary} className="pay-form">
              <div className="form-group">
                <label htmlFor="amount">Payment Amount (₹)</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  min="1"
                  max={isClearingDue ? calculateDueBalance() : undefined}
                />
                {isClearingDue && (
                  <small className="form-hint">
                    Enter an amount up to ₹{calculateDueBalance().toLocaleString()}.
                  </small>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  id="description"
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
                  required={!isClearingDue}
                  disabled={isSubmitting}
                />
                {isClearingDue && (
                  <small className="form-hint">
                    Optional: Specify a month if clearing a specific period.
                  </small>
                )}
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
                    setIsClearingDue(false);
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
        </ul>
      </div>

      <div className="profile-content">
        {activeTab === "overview" && (
          <OverViewTab
            teacher={teacher}
            attendance={attendance}
            transactions={transactions}
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
          />
        )}
        {activeTab === "transactions" && (
          <TransactionsTab
            transactions={transactions}
            setShowPayForm={setShowPayForm}
            setFormData={setFormData}
            teacher={teacher}
          />
        )}
      </div>
    </div>
  );
};

export default TeacherProfile;
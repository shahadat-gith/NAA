import React from "react";

const OverViewTab = ({ teacher, attendance, transactions, monthlyAttendance }) => {
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

  const presentCount = monthlyAttendance.filter((att) => att.status === "Present" || att.status === "Late").length;
  const absentCount = monthlyAttendance.filter((att) => att.status === "Absent").length;
  const lateCount = monthlyAttendance.filter((att) => att.status === "Late").length;
  const totalDays = presentCount + absentCount;
  const attendancePercentage = totalDays > 0 ? (presentCount / totalDays) * 100 : 0;

  const overallPresent = attendance.filter((att) => att.status === "Present" || att.status === "Late").length;
  const overallAbsent = attendance.filter((att) => att.status === "Absent").length;
  const overallLate = attendance.filter((att) => att.status === "Late").length;
  const overallTotal = overallPresent + overallAbsent;
  const overallPercentage = overallTotal > 0 ? (overallPresent / overallTotal) * 100 : 0;

  return (
    <div className="overview-tab">
      <div className="card teacher-info-card">
        <h2 className="card-title">Teacher Information</h2>
        <div className="card-content">
          <div className="info-table">
            <div className="info-row">
              <span className="info-label">Subject</span>
              <span className="info-value">{teacher.subject || "N/A"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Department</span>
              <span className="info-value">{teacher.department || "N/A"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Degree</span>
              <span className="info-value">{teacher.degree || "N/A"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Experience</span>
              <span className="info-value">{teacher.experience || "N/A"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Salary</span>
              <span className="info-value">₹{teacher.salary?.toLocaleString() || "N/A"} per month</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email</span>
              <span className="info-value">{teacher.email || "N/A"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Contact</span>
              <span className="info-value">{teacher.contact || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card bank-info-card">
        <h2 className="card-title">Bank Details</h2>
        <div className="card-content">
          <div className="info-table">
            <div className="info-row">
              <span className="info-label">Bank Name</span>
              <span className="info-value">{teacher.bankName || "Not provided"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Account Number</span>
              <span className="info-value">{teacher.accountNumber || "Not provided"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">IFSC Code</span>
              <span className="info-value">{teacher.ifscCode || "Not provided"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Account Holder</span>
              <span className="info-value">{teacher.accountHolderName || "Not provided"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="card stats-card">
          <span className="stats-card-title">Attendance</span>
          <span className="stats-card-value">{attendancePercentage.toFixed(2)}%</span>
          <span className="stats-card-label">This Month</span>
        </div>
        <div className="card stats-card">
          <span className="stats-card-title">Payments</span>
          <span className="stats-card-value">₹{calculateDueBalance().toLocaleString()}</span>
          <span className="stats-card-label">Balance Due</span>
        </div>
        <div className="card stats-card">
          <span className="stats-card-title">Present Days</span>
          <span className="stats-card-value">{presentCount}</span>
          <span className="stats-card-label">This Month</span>
        </div>
        <div className="card stats-card">
          <span className="stats-card-title">Absent Days</span>
          <span className="stats-card-value">{absentCount}</span>
          <span className="stats-card-label">This Month</span>
        </div>
        <div className="card stats-card">
          <span className="stats-card-title">Late Days</span>
          <span className="stats-card-value">{lateCount}</span>
          <span className="stats-card-label">This Month</span>
        </div>
        <div className="card stats-card">
          <span className="stats-card-title">Overall Attendance</span>
          <span className="stats-card-value">{overallPercentage.toFixed(2)}%</span>
          <span className="stats-card-label">Since Joining</span>
        </div>
      </div>
    </div>
  );
};

export default OverViewTab;
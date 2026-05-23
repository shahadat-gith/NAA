import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard = () => {
  // Grabbing data directly sent down from parent TeacherLayout
  const [teacher] = useOutletContext();
  const [greeting, setGreeting] = useState("Welcome");
  const navigate = useNavigate();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 16) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const paymentHistory = [
    { id: 1, date: "2026-05-20", amount: "Rs 18,500", status: "Paid", note: "April salary" },
    { id: 2, date: "2026-04-20", amount: "Rs 18,500", status: "Paid", note: "March salary" },
    { id: 3, date: "2026-03-20", amount: "Rs 18,500", status: "Paid", note: "February salary" },
  ];

  const attendanceHistory = [
    { id: 1, month: "May 2026", present: 24, absent: 2, late: 1 },
    { id: 2, month: "April 2026", present: 22, absent: 4, late: 0 },
    { id: 3, month: "March 2026", present: 23, absent: 3, late: 0 },
  ];

  const classCount = teacher?.subjectClassMappings?.reduce(
    (sum, mapping) => sum + (mapping.classes?.length || 0),
    0
  );
  const subjectCount = teacher?.subjectClassMappings?.length || 0;

  return (
    <div className="teacher-dashboard-page">
      <div className="teacher-dashboard-header">
        <div className="header-greeting-block">
          <h1 className="teacher-dashboard-title">
            {greeting}!
          </h1>
          <p className="teacher-dashboard-subtitle">
            Here's an overview of your schedule, classes, and statements.
          </p>
        </div>
      </div>
      <div className="teacher-dashboard-grid">
        <section className="teacher-card">
          <div className="teacher-card-header">
            <h2><i className="fa-solid fa-credit-card section-title-icon"></i> Payment History</h2>
          </div>
          <div className="teacher-table-container">
            <table className="teacher-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment) => (
                  <tr key={payment.id}>
                    <td>{payment.date}</td>
                    <td className="payment-amount">{payment.amount}</td>
                    <td>
                      <span className="status-badge paid">
                        {payment.status}
                      </span>
                    </td>
                    <td className="table-note">{payment.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="teacher-card">
          <div className="teacher-card-header">
            <h2><i className="fa-solid fa-clock-rotate-left section-title-icon"></i> Attendance History</h2>
          </div>
          <div className="teacher-table-container">
            <table className="teacher-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Late</th>
                </tr>
              </thead>
              <tbody>
                {attendanceHistory.map((row) => (
                  <tr key={row.id}>
                    <td className="attendance-month">{row.month}</td>
                    <td className="count-present">{row.present} d</td>
                    <td className="count-absent">{row.absent} d</td>
                    <td className="count-late">{row.late} d</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
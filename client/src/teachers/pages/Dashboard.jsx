import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

// Components
import TimetableCard from "../components/TimetableCard";
import SalaryBreakdownCard from "../components/SalaryBreakdownCard";
import AttendanceLogCard from "../components/AttendanceLogCard";
import PaymentsCard from "../components/PaymentsCard";

// Styles
import "../styles/Dashboard.css";

const Dashboard = () => {

  const { dashboard, setDashboard, loading } = useOutletContext();

  const [greeting, setGreeting] = useState("Welcome");

  // Greeting logic
  useEffect(() => {

    const hour = new Date().getHours();

    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 16) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }

  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="db-loading">
        Loading your dashboard data...
      </div>
    );
  }

  // Dashboard data
  const {
    teacher,
    timetable,
    attendance,
    payments,
    dues,
  } = dashboard;

  // Refresh timetable state
  const refreshTimetableState = (newScheduleArray) => {

    setDashboard((prev) => ({
      ...prev,
      timetable: {
        ...prev.timetable,
        schedule: newScheduleArray,
      },
    }));

  };

  return (
    <div className="db-page">

      {/* HEADER */}
      <div className="db-header">

        <div className="db-greeting-block">

          <h1 className="db-title">
            {greeting}, {teacher?.name || "Teacher"}!
          </h1>

          <p className="db-subtitle">
            Here's a live overview of your schedule,
            attendance data, and earnings statements.
          </p>

        </div>

        {/* Salary Overview */}
        <div className="db-metric-card">

          <div className="db-metric-info">

            <span className="db-metric-label">
              Pending Salary (Owed by School)
            </span>

            <h2
              className={`db-metric-value ${
                dues.totalDue > 0
                  ? "db-pending-amount"
                  : "db-settled-amount"
              }`}
            >
              ₹{dues.totalDue.toLocaleString("en-IN")}
            </h2>

          </div>

        </div>

      </div>

      {/* GRID */}
      <div className="db-grid">

        <TimetableCard
          timetableData={timetable}
          onRefreshDashboard={refreshTimetableState}
        />

        <SalaryBreakdownCard
          dues={dues}
        />

        <AttendanceLogCard
          attendance={attendance}
        />
        <PaymentsCard payments={payments}/>

      </div>

    </div>
  );
};

export default Dashboard;
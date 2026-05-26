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

  const { dashboard, setDashboard } = useOutletContext();
  const [greeting, setGreeting] = useState("Welcome");

  // Greeting logic
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 16) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }

  }, []);

  // Dashboard data
  const {teacher,timetable,attendance,payments,dues} = dashboard;

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
            <span style={{color:"#e94560"}}>{greeting}</span>, {teacher?.name || "Teacher"}!
          </h1>
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
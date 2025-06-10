// Home.jsx
import React, { useContext } from "react";
import "./Home.css";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { TeacherContext } from "../../context/TeacherContext";
import { AppContext } from "../../context/AppContext";

const Home = () => {
  const navigate = useNavigate();
  const { teacherCount } = useContext(TeacherContext);
  const { pendingAdmissions, approvedAdmissions } = useContext(AppContext);

  return (
    <div className="admin-dashboard-container">
      <main className="admin-dashboard-content">
        <section className="dashboard-stats-overview">
          <h2>Dashboard Overview</h2>
          <div className="dashboard-stats-cards">
            {[
              {
                title: "Total Teachers",
                value: teacherCount,
                path: "/all-teachers",
                color: "#3b82f6",
                icon: "fas fa-chalkboard-teacher"
              },
              {
                title: "Approved Admissions",
                value: approvedAdmissions,
                path: "/admin/admissions",
                color: "#5CB338",
                icon: "fas fa-check-circle"
              },
              {
                title: "Pending Admissions",
                value: pendingAdmissions,
                path: "/admin/admissions",
                color: "#f59e0b",
                icon: "fas fa-hourglass-half"
              },
              // {
              //   title: "Total Revenue",
              //   value: "0",
              //   path: "/admin/finance",
              //   color: "#10b981",
              //   icon: "fas fa-dollar-sign"
              // }
            ].map((stat, index) => (
              <div key={index} className="dashboard-stat-card" style={{ '--card-color': stat.color }}>
                <i className={`${stat.icon} dashboard-stat-icon`}></i>
                <h3>{stat.title}</h3>
                <p className="dashboard-stat-value" style={{ color: stat.color }}>{stat.value}</p>
                <button
                  className="dashboard-view-btn"
                  onClick={() => navigate(stat.path)}
                  style={{ backgroundColor: stat.color }}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-quick-actions">
          <h2>Quick Actions</h2>
          <div className="dashboard-action-cards">
            {[
              { title: "Add New Teacher", path: "/add-teachers", icon: "fas fa-user-plus" },
              { title: "Process Admission", path: "/admin/admission-form", icon: "fas fa-file-alt" },
              { title: "Generate Reports", path: "/admin/reports", icon: "fas fa-chart-pie" }
            ].map((action, index) => (
              <div
                key={index}
                className="dashboard-action-card"
                onClick={() => navigate(action.path)}
              >
                <i className={action.icon}></i>
                <h3>{action.title}</h3>
                <p>{action.title === "Add New Teacher" ?
                   "Register a new teacher" :
                   action.title === "Process Admission" ?
                   "Handle new admissions" :
                   "View academy analytics"}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
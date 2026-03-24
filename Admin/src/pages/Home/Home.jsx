import { Link } from "react-router-dom";
import "./Home.css";
import { navLinks } from "../../utils/utility";

const Home = () => {
  const hour = new Date().getHours();

  let greeting = "Welcome";
  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 17) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  return (
    <div className="admin-dashboard-container">

      {/* Welcome Card */}
      <div className="dashboard-card welcome-card">
        <span className="greeting-badge">{greeting}</span>

        <h1>
          {greeting}, <span>Admin</span> 👋
        </h1>

        <p>
          Welcome to the Nashib Ali Academy Admin Dashboard.
          Manage students, teachers, academic results, and institutional
          operations seamlessly from one place.
        </p>
      </div>


      {/* Quick Access */}
      <div className="dashboard-card quick-access-card">
        <div className="quick-access-header">
          <h2>Quick Access</h2>
          <p>Jump straight to the most used sections.</p>
        </div>
        <div className="quick-access-grid">
          {navLinks.map((item) => (
            <Link key={item.to} to={item.to} className="quick-access-item">
              <div className="quick-access-icon">
                <i className={item.icon}></i>
              </div>
              <div className="quick-access-label">{item.label}</div>
              <div className="quick-access-arrow">
                <i className="fas fa-arrow-right"></i>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Home;

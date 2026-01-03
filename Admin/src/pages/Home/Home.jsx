import "./Home.css";

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

      {/* About Section */}
      <div className="dashboard-card">
        <h2>About Nashib Ali Academy</h2>
        <p>
          Nashib Ali Academy is dedicated to delivering quality education with
          a strong foundation in discipline, moral values, and academic
          excellence. The institution strives to create a nurturing environment
          for holistic student development.
        </p>
        <p>
          Through experienced faculty, structured academic planning, and
          transparent administration, the academy continues to shape
          responsible and confident future leaders.
        </p>
      </div>

      {/* Motivation Card */}
      <div className="dashboard-card highlight-card">
        <h2>Have a Productive Day</h2>
        <p>
          Your leadership ensures smooth academic operations and transparency.
          Every decision you make contributes to the growth and success of our
          students.
        </p>
        <p>
          Let us continue working together towards excellence in education.
        </p>
      </div>

    </div>
  );
};

export default Home;

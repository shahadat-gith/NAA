import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apis } from "../services/api";
import { useAppContext } from "../context/Context";
import Loader from "../components/common/Loader";
import TodaySchedule from "../components/home/TodaySchedule";
import RecentAttendance from "../components/home/RecentAttendance";
import Alert from "../components/common/Alert";

const emptyScheduleStructure = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
};

const Home = () => {
  const navigate = useNavigate();
  const { staff, setStaff } = useAppContext();
  const [dashboard, setDashboard] = useState({
    profile: staff,
    timetable: { schedule: emptyScheduleStructure },
    attendance: [],
  });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(""); // Dynamic state for managing error modal text

  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 16) return "Good Afternoon";
    return "Good Evening";
  });

  useEffect(() => {
    // Structural session safety check for web route guards
    if (!staff) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchDashboardData = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const data = await apis.getDashboard();
        if (data?.success) setDashboard(data.dashboard);
      } catch (error) {
        if (error?.response?.status === 401) {
          localStorage.removeItem("staff-token");
          setStaff(null);
          navigate("/login", { replace: true });
          return;
        }
        // Gracefully trap the layout sync failure in state instead of freezing the UI with alert()
        setErrorMsg(
          error?.response?.data?.message || "Unable to load workspace records.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [staff, navigate, setStaff]);

  if (loading) return <Loader fullScreen={true} size="medium" />;

  const profile = dashboard?.profile || staff;
  const timetable = dashboard?.timetable;
  const attendance = dashboard?.attendance || [];

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Header Section */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-text-primary">
            <span className="text-accent">{greeting}</span>,{" "}
            {profile?.name || "Staff Member"}!
          </h1>
          <p className="text-sm font-medium text-text-secondary mt-1.5">
            Welcome back to your academy administration panel.
          </p>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Timetable Section */}
        <div
          className={
            profile?.staffType === "Teaching" ? "lg:col-span-2" : "lg:col-span-3"
          }
        >
          {profile?.staffType === "Teaching" && timetable ? (
            <TodaySchedule timetableData={timetable} />
          ) : (
            <div className="text-sm font-medium text-text-secondary text-center p-8 bg-card border border-border rounded-2xl">
              Non-Teaching profile dashboard layer. Academic timetable mapping disabled.
            </div>
          )}
        </div>

        {/* Attendance Section */}
        {profile?.staffType === "Teaching" && (
          <div className="lg:col-span-1 lg:sticky lg:top-24">
            <RecentAttendance attendance={attendance} />
          </div>
        )}
      </div>

      {/* Modern React Native Pop-Up Alert Modal Fallback */}
      <Alert
        visible={!!errorMsg}
        title="Sync Error"
        message={errorMsg}
        variant="danger"
        onClose={() => setErrorMsg("")}
        buttons={[
          {
            text: "Acknowledge",
            variant: "outline",
            onClick: () => setErrorMsg(""),
          },
        ]}
      />
    </main>
  );
};

export default Home;
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
  const [errorMsg, setErrorMsg] = useState("");

  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 16) return "Good Afternoon";
    return "Good Evening";
  });

  useEffect(() => {
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
    <main className="w-full px-4 py-6 space-y-6 max-w-md mx-auto animate-fade-in">
      
      {/* ================= MOBILE STREAMLINED HERO HEADER ================= */}
      <div className="bg-linear-to-br from-card to-background border border-border p-5 rounded-2xl shadow-xs select-none">
        <h1 className="text-xl font-black tracking-tight text-text-primary">
          <span className="text-primary">{greeting}</span>, {" "}
          {profile?.name || "Staff Member"}
        </h1>
        <p className="text-[11px] font-medium text-text-secondary mt-1 leading-normal">
          Welcome back to your academy administration workspace panel.
        </p>
      </div>

      {/* ================= VERTICAL MOBILE CONTENT LAYOUT STACK ================= */}
      <div className="space-y-6">
        
        {/* Academic Timetable Section Row */}
        <div>
          {profile?.staffType === "Teaching" && timetable ? (
            <TodaySchedule timetableData={timetable} />
          ) : (
            null
          )}
        </div>

        {/* Attendance Activity Logger Section */}
        {profile?.staffType === "Teaching" && (
          <RecentAttendance attendance={attendance} />
        )}
        
      </div>

      {/* Shared Interceptor Structural Alert Modal */}
      <Alert
        visible={!!errorMsg}
        title="Sync Error"
        message={errorMsg}
        variant="danger"
        onClose={() => setErrorMsg("")}
        buttons={[
          {
            text: "Acknowledge",
            variant: "accent",
            onClick: () => setErrorMsg(""),
          },
        ]}
      />
    </main>
  );
};

export default Home;
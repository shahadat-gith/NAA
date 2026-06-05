import { Routes, Route, Navigate } from "react-router-dom";
import { useAppContext } from './context/Context';
import Login from './pages/Login';
import Loader from './components/common/Loader';
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Attendance from "./pages/Attendance";
import Timetable from "./pages/Timetable";
import TimetableUpdate from "./pages/TimeTableUpdate";
import Settings from "./pages/Settings";
import Developer from "./pages/Developer";
import BottomTabs from "./components/common/BottomTabs";

const App = () => {
  const { staff, sessionChecking } = useAppContext();

  if (sessionChecking) {
    return <Loader fullScreen={true} size="large" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      {/* Global Desktop/Mobile Navigation Header */}
      {staff && <Navbar />}
      
      {/* Main Page Workspace Shell 
        CRITICAL WEB PARADIGM: 'pb-16' adds layout defensive cushioning on mobile browsers 
        so floating sticky navigation bars won't overlap your form submission controls.
      */}
      <div className={`flex-1 flex flex-col ${staff ? "pb-16 sm:pb-0" : ""}`}>
        <Routes>
          <Route 
            path="/login" 
            element={!staff ? <Login /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/*" 
            element={staff ? (
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/edit" element={<EditProfile />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/timetable" element={<Timetable />} />
                <Route path="/timetable/update" element={<TimetableUpdate />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/developer" element={<Developer />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            ) : (
              <Navigate to="/login" replace />
            )} 
          />
        </Routes>
      </div>

      {/* Render mobile-only sticky bottom tabs if the user is authenticated */}
      {staff && <BottomTabs />}
    </div>
  );
};

export default App;
import { Routes, Route, Navigate } from "react-router-dom";
import { useAppContext } from "./context/Context";
import { useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Header from "./components/Header/Header";
import Loader from "./components/common/Loader";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Attendance from "./pages/Attendance";
import Timetable from "./pages/Timetable";
import TimetableUpdate from "./pages/TimetableUpdate";
import Settings from "./pages/Settings";
import Developer from "./pages/Developer";
import BottomTabs from "./components/common/BottomTabs";
import AcademicRules from "./pages/AcademicRules";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import MobileAccessOnly from "./components/common/MobileAccessOnly";

import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";

const App = () => {
  const { staff, sessionChecking } = useAppContext();

  const location = useLocation();

  if (sessionChecking) {
    return <Loader fullScreen={true} size="large" />;
  }

  useEffect(() => {
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    } catch (error) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);
  return (
    <>
      {/* ================= DESKTOP & TABLET BLOCKER SCREEN ================= */}
      {/* This layer activates whenever the window viewport width crosses 640px (sm) or greater */}
      <MobileAccessOnly />

      <div className="min-h-screen sm:hidden flex flex-col bg-background text-text-primary">
        {staff && <Header />}

        {/* Main Page Workspace Shell */}
        <div className={`flex-1 flex flex-col ${staff ? "pb-16" : ""}`}>
         <AnimatePresence mode="wait">
           <Routes>
            <Route
              path="/login"
              element={!staff ? <Login /> : <Navigate to="/" replace />}
            />
            <Route
              path="/*"
              element={
                staff ? (
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/attendance" element={<Attendance />} />
                    <Route path="/timetable" element={<Timetable />} />
                    <Route
                      path="/timetable/update"
                      element={<TimetableUpdate />}
                    />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/developer" element={<Developer />} />
                    <Route path="/academic-rules" element={<AcademicRules />} />
                    <Route
                      path="/terms-conditions"
                      element={<TermsAndConditions />}
                    />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
         </AnimatePresence>
        </div>

        {staff && <BottomTabs />}
      </div>
    </>
  );
};

export default App;

import React, { useEffect, useContext } from "react";
import {
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import PageStartLoader from "./components/PageStartLoader/PageStartLoader";
import { Toaster } from "react-hot-toast";

import { AppContext } from "./context/AppContext";

/* ===== Public Pages ===== */
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Staffs from "./pages/Staffs/Staffs";
import Academics from "./pages/Academics/Academics";
import Contact from "./pages/Contact/Contact";
import Developer from "./pages/Developer/Developer";
import Gallery from "./pages/Gallery/Gallery";
import CurriculumDetails from "./pages/CurriculumDetails/CurriculumDetails";

/* Legal pages */
import Legal from "./pages/Legal/Legal";

/* ===== Portal pages ===== */
import Portal from "./pages/Student/Portal/Portal";
import Admission from "./pages/Admission/Admission";

import Result from "./pages/Student/Portal/Result/Result";
import ResultDownload from "./pages/Student/Portal/Result/ResultDownload";

import AdmitCard from "./pages/Student/Portal/AdmitCard/AdmitCard";
import AdmitCardDownload from "./pages/Student/Portal/AdmitCard/AdmitCardDownload";

import IdCard from "./pages/Student/Portal/IdCard/IdCard";
import IdCardDownload from "./pages/Student/Portal/IdCard/IdCardDownload";

/* ===== Student pages ===== */
import ToppersList from "./pages/Student/ToppersList/ToppersList";
import Profile from "./pages/Student/Profile/Profile";

import PageNotFound from "./components/404/PageNotFound";
import Notices from "./pages/Notices/Notices";

/* ===== Teacher Dashboard ===== */
import TeacherLayout from "./teachers/pages/TeacherLayout";
import Dashboard from "./teachers/pages/Dashboard";
import TeacherLogin from "./teachers/pages/TeacherLogin";
import TeacherProfile from "./teachers/pages/TeacherProfile";
import Payments from "./teachers/pages/Payments";
import Attendance from "./teachers/pages/Attendance";

const App = () => {
  const location = useLocation();
  const { loading } = useContext(AppContext);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location.pathname]);

  const teacherToken = localStorage.getItem("teacher-token");

  /* ===== TEACHER APP ===== */
  if (location.pathname.startsWith("/teacher")) {
    return (
      <>
        <Toaster position="top-center" />

        <Routes>
          {/* Login route */}
          <Route
            path="/teacher/login"
            element={teacherToken ? (<Navigate to="/teacher" replace />) : (<TeacherLogin />)}
          />

          {/* Protected Teacher Routes */}
          <Route
            path="/teacher/*"
            element={teacherToken ? (<TeacherLayout />) : (<Navigate to="/teacher/login" replace />)}
          >
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<TeacherProfile />} />
            <Route path="payments" element={<Payments />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </>
    );
  }

  /* ===== FULL PAGE LOADER ===== */
  if (loading) {
    return <PageStartLoader />;
  }

  /* ===== CLIENT APP ===== */
  return (
    <div className="app-layout">
      <Navbar />
      <Toaster position="top-center" />

      <main className="app-content">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/staffs" element={<Staffs />} />
          <Route path="/curriculum" element={<CurriculumDetails />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/developer" element={<Developer />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/legal/:page" element={<Legal />} />
          <Route path="/admission" element={<Admission />} />
          <Route path="/notices" element={<Notices />} />

          {/* Portal */}
          <Route path="/student/toppers" element={<ToppersList />} />
          <Route path="/student/profile" element={<Profile />} />
          <Route path="/student/portal" element={<Portal />} />

          <Route path="/student/portal/result" element={<Result />} />
          <Route
            path="/student/portal/result/download"
            element={<ResultDownload />}
          />

          <Route path="/student/portal/admit-card" element={<AdmitCard />} />
          <Route
            path="/student/portal/admit-card/download"
            element={<AdmitCardDownload />}
          />

          <Route path="/student/portal/id-card" element={<IdCard />} />
          <Route
            path="/student/portal/id-card/download"
            element={<IdCardDownload />}
          />

          {/* Fallback */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
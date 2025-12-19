import React, { useEffect, useContext } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import PageStartLoader from "./components/PageStartLoader/PageStartLoader";

import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";

import { AppContext } from "./context/AppContext";

/* ===== Public Pages ===== */
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Staff from "./pages/Staff/Staff";
import Academics from "./pages/Academics/Academics";
import Contact from "./pages/Contact/Contact";
import Gallery from "./pages/Gallery/Gallery";
import TeacherDetails from "./pages/Staff/TeacherDetails/TeacherDetails";
import CurriculumDetails from "./components/Curriculum/CurriculumDetails";
import Login from "./components/Login/Login";

/* ===== Portal Pages ===== */
import Portal from "./pages/Portal/Portal";
import ResultDownload from "./pages/Portal/Result/ResultDownload";
import StudentDetails from "./pages/Portal/StudentDetails/StudentDetails";
import Search from "./pages/Portal/Search/Search";

/* ===== Not Found ===== */
import PageNotFound from "./components/404/PageNotFound";
import Result from "./pages/Portal/Result/Result";

const App = () => {
  const location = useLocation();
  const { loading } = useContext(AppContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  /* ===== FULL PAGE LOADER ===== */
  if (loading) {
    return <PageStartLoader />;
  }

  return (
    <div className="app-layout">
      <Navbar />

      <ToastContainer />
      <Toaster position="top-center" />

      {/* 🔑 MAIN CONTENT */}
      <main className="app-content">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/staffs" element={<Staff />} />
          <Route path="/staffs/teacher" element={<TeacherDetails />} />
          <Route path="/curriculum" element={<CurriculumDetails />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />

          {/* Portal */}
          <Route path="/portal" element={<Portal />} />
          <Route path="/portal/search" element={<Search />} />
          <Route path="/portal/student/:id" element={<StudentDetails />} />
          <Route path="/portal/result" element={<Result />} />
          <Route
            path="/portal/result/download"
            element={<ResultDownload />}
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

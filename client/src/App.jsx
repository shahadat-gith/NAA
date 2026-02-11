import React, { useEffect, useContext } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import PageStartLoader from "./components/PageStartLoader/PageStartLoader";
import { Toaster } from "react-hot-toast";

import { AppContext } from "./context/AppContext";

/* ===== Public Pages ===== */
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Teachers from "./pages/Teachers/Teachers";
import Academics from "./pages/Academics/Academics";
import Contact from "./pages/Contact/Contact";
import Gallery from "./pages/Gallery/Gallery";
import CurriculumDetails from "./pages/CurriculumDetails/CurriculumDetails";

/* ===== Student Pages ===== */
import StudentSearch from "./pages/Student/Pages/Search/StudentSearch";
import Dashboard from "./pages/Student/Pages/Dashboard/Dashboard";

/* ===== Not Found ===== */
import PageNotFound from "./components/404/PageNotFound";
import Admission from "./pages/Admission/Admission";
import AdmitCard from "./pages/Student/Pages/AdmitCard/AdmitCard";



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
      <Toaster position="top-center" />

      {/*MAIN CONTENT */}
      <main className="app-content">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/curriculum" element={<CurriculumDetails />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
           <Route path="/admission" element={<Admission />} />

          {/* Portal */}

          <Route path="/student" element={<StudentSearch />} />
          <Route path="/student/dashboard/:studentId" element={<Dashboard />} />
          <Route path="/student/dashboard/admitcard" element={<AdmitCard />} />
          {/* Fallback */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;

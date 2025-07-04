import React, { useContext, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from 'react-hot-toast';
import AdminLayout from "./components/AdminLayout/AdminLayout";
import Result from "./pages/Result/Result";
import { AdminContext } from "./context/AdminContext";
import Teacher from "./pages/Teacher/Teacher";
import Home from "./pages/Home/Home";
import Loader from "./components/Loader/Loader";
import Student from "./pages/Student/Student";
import Hostel from "./pages/Hostel/Hostel";
import Settings from "./pages/Settings/Settings";
import Gallery from "./pages/Gallery/Gallery";
import Achievers from "./pages/Achievers/Achievers";
import TeacherProfile from "./pages/Teacher/TeacherProfile/TeacherProfile";
import StudentDetails from "./pages/Student/StudentDetails/StudentDetails";

const App = () => {
  const { adminToken, setAdminToken } = useContext(AdminContext);
  const [isInitializing, setIsInitializing] = useState(true);

  // Function to get query parameter from URL
  const getQueryParam = (param) => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(param);
  };

  useEffect(() => {
    // Check for token in URL on initial load
    const tokenFromUrl = getQueryParam("token");
    if (tokenFromUrl && !adminToken) {
      setAdminToken(tokenFromUrl);
      localStorage.setItem("adminToken", tokenFromUrl);
      window.history.replaceState({}, document.title, window.location.pathname); // Clean up URL
    }
    setIsInitializing(false); // Mark initialization as complete
  }, [adminToken, setAdminToken]);

  // While initializing, show the Loader component
  if (isInitializing) {
    return <Loader message="Initializing Admin Dashboard..." />;
  }

  // If no adminToken after initialization, redirect to frontend
  if (!adminToken) {
    window.location.href = import.meta.env.VITE_CLIENT_URL || "http://localhost:5173";
    return null;
  }

  // If adminToken exists, render the admin dashboard with AdminLayout
  return (
    <>
      <ToastContainer />
      <Toaster position="top-center" toastOptions={{ style: { background: '#253650', color: '#e2e5e9' } }} />
      <AdminLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<Result />} />
          <Route path="/teachers" element={<Teacher />} />
          <Route path = "/students" element = {<Student/>}/>
          <Route path = "/students/:id" element = {<StudentDetails/>}/>
          <Route path="/teachers/:teacherId" element ={<TeacherProfile/>} />
          <Route path = "/settings" element = {<Settings/>}/>
          <Route path = "/hostel" element = {<Hostel/>}/>
          <Route path="/gallery" element = {<Gallery/>}/>
          <Route path="/achievers" element = {<Achievers/>}/>
        </Routes>
      </AdminLayout>
    </>
  );
};

export default App;
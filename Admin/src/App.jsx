import React, { useContext, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLayout from "./components/AdminLayout/AdminLayout";
import Result from "./pages/Result/Result";
import Teacher from "./pages/Teacher/Teacher";
import Notice from "./pages/Notice/Notice";
import Admission from "./pages/Admission/Admission";
import { AdminContext } from "./context/AdminContext";
import ListAllTeacher from "./pages/ListTeacher/ListAllTeacher";
import TeacherProfile from "./pages/TeacherProfile/TeacherProfile";
import Home from "./pages/Home/Home";
import ContactQuery from "./pages/ContactQuery/ContactQuery";
import AdmissionQuery from "./pages/AdmissionQuery/AdmissionQuery";
import Admissions from "./pages/Admission/Admission";
import Loader from "./components/Loader/Loader";
import Newsletter from "./pages/Newsletter/Newsletter";
import StudentList from "./pages/StudentList/StudentList";
import AddStudents from "./pages/AddStudents/AddStudents";
import Hostel from "./pages/Hostel/Hostel";
import AdmissionProfile from "./pages/AdmissionProfile/AdmissionProfile";
import Settings from "./pages/Settings/Settings";

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
      <AdminLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<Result />} />
          <Route path="/notices" element={<Notice />} />
          <Route path="/add-teachers" element={<Teacher />} />
          <Route path="/admission" element={<Admission />} />
          <Route path="/all-teachers" element={<ListAllTeacher />} />
          <Route path="/add-students" element = {<AddStudents/>}/>
          <Route path = "/student-list" element = {<StudentList/>}/>
          <Route path="/teacher/:teacherId" element={<TeacherProfile />} />
          <Route path="/contact-queries" element={<ContactQuery />} />
          <Route path="/admission-queries" element={<AdmissionQuery />} />
          <Route path="/admin/admissions" element={<Admissions />} />
          <Route path="/admin/admission/:id" element={<AdmissionProfile />} />
          <Route path="/newsletters" element={<Newsletter />} />
          <Route path = "/settings" element = {<Settings/>}/>
          <Route path = "/hostel" element = {<Hostel/>}/>
        </Routes>
      </AdminLayout>
    </>
  );
};

export default App;
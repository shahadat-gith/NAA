import React, { useContext, useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast";

import { AdminContext } from "./context/AdminContext";

import AdminLayout from "./components/AdminLayout/AdminLayout";
import Loader from "./components/Loader/Loader";

import Home from "./pages/Home/Home";
import Teacher from "./pages/Teacher/Teacher";
import Student from "./pages/Student/Student";
import Settings from "./pages/Settings/Settings";
import Gallery from "./pages/Gallery/Gallery";
import Achievers from "./pages/Achievers/Achievers";
import TeacherProfile from "./pages/Teacher/TeacherProfile/TeacherProfile";
import StudentDetails from "./pages/Student/StudentDetails/StudentDetails";
import Login from "./pages/Login/Login";
import Result from "./pages/Result/Result";
import Admissions from "./pages/Admissions/Admissions";
import AdmissionDetails from "./pages/Admissions/AdmissionDetails";

/* ===============================
   PROTECTED ADMIN ROUTE
   =============================== */
const ProtectedAdminRoute = ({ children }) => {
  const { adminToken } = useContext(AdminContext);

  if (!adminToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  const { adminToken } = useContext(AdminContext);
  const [isInitializing, setIsInitializing] = useState(true);

  /* ===============================
     INITIAL AUTH CHECK
     =============================== */
  useEffect(() => {
    // small delay to allow context hydration
    setIsInitializing(false);
  }, []);

  /* ===============================
     GLOBAL LOADER
     =============================== */
  if (isInitializing) {
    return <Loader message="Initializing Admin Dashboard..." />;
  }

  return (
    <>
      <ToastContainer />
      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: "#253650", color: "#e2e5e9" },
        }}
      />

      <Routes>
        {/* ================= LOGIN ================= */}
        <Route
          path="/login"
          element={adminToken ? <Navigate to="/" replace /> : <Login />}
        />

        {/* ================= PROTECTED ADMIN ================= */}
        <Route
          path="/*"
          element={
            <ProtectedAdminRoute>
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/teachers" element={<Teacher />} />
                  <Route path="/teachers/:teacherId" element={<TeacherProfile />} />

                  <Route path="/students" element={<Student />} />
                  <Route path="/students/:id" element={<StudentDetails />} />
                  <Route path="/result" element={<Result/>}/>


                  <Route path="/admissions" element={<Admissions/>}/>
                  <Route path="/admissions/:id" element={<AdmissionDetails/>}/>

                  <Route path="/settings" element={<Settings />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/achievers" element={<Achievers />} />
                </Routes>
              </AdminLayout>
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;

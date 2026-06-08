import React, { useContext, useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast";

import { AdminContext } from "./context/AdminContext";

import Layout from "./components/layout/Layout";
import Loader from "./components/common/Loader";

import Login from "./pages/Login/Login";
import Home from "./pages/Home";

import Student from "./pages/Student/Student";
import StudentDetails from "./pages/Student/StudentDetails";
import Admissions from "./pages/Admissions/Admissions";
import AdmissionDetails from "./pages/Admissions/AdmissionDetails";
import Exams from "./pages/Exams";
import Result from "./pages/Result/Result";
import ResultDetails from "./pages/Result/ResultDetails";

import Settings from "./pages/Settings";
import Gallery from "./pages/Gallery";
import Achievers from "./pages//Achievers";
import Notices from "./pages/Notices/Notices";


import Staffs from "./pages/Staffs/Staffs";
import StaffDetails from "./pages/Staffs/StaffDetails";
import Attendance from "./pages/Attendance/Attendance";
import AttendanceDashboard from "./pages/Attendance/AttendanceDashboard";
import AttendanceHistory from "./pages/Attendance/AttendanceHistory";
import Test from "./pages/Test";
import Action from "./pages/Action";


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
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/actions" element={<Action />} />


                  {/* Staffs  */}
                  <Route path="/staffs" element={<Staffs />} />
                  <Route path="/staffs/:staffId" element={<StaffDetails/>} />
                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="/attendance/dashboard" element={<AttendanceDashboard />} />
                  <Route path="/attendance/dashboard/history" element={<AttendanceHistory />} />
                 
                  {/* Students */}
                  <Route path="/students" element={<Student />} />
                  <Route path="/students/:id" element={<StudentDetails />} />
                  <Route path="/exams" element={<Exams />} />
                  <Route path="/result" element={<Result />} />
                  <Route path="/result/:registrationNo" element={<ResultDetails />} />

                  <Route path="/admissions" element={<Admissions/>}/>
                  <Route path="/admissions/:id" element={<AdmissionDetails/>}/>


                  {/* System  */}
                  <Route path="/notices" element={<Notices/>}/>
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/achievers" element={<Achievers />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </Layout>
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;

import React, { useEffect } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { useUserContext } from './context/UserContext';
import Navbar from './components/Navbar/Navbar';
import TeacherNavbar from './Teacher Dashboard/TeacherNavbar/TeacherNavbar';
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';

// Public Pages
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Staff from './pages/Staff/Staff';
import Academics from './pages/Academics/Academics';
import Contact from './pages/Contact/Contact';
import Footer from './components/Footer/Footer';
import TeacherDetails from './pages/Staff/TeacherDetails/TeacherDetails';
import CurriculumDetails from './components/Curriculum/CurriculumDetails';
import Login from './components/Login/Login';

// Portal Pages
import Portal from './pages/Portal/Portal';
import Payment from './pages/Portal/Payment';
import Services from './pages/Portal/Services';
import StudentDetails from './pages/Portal/Components/StudentDetails/StudentDetails';
import PaymentDetails from './pages/Portal/Components/PaymentDetails/PaymentDetails';
import ResultDownload from './pages/Portal/Result/ResultDownload';

// Teacher Dashboard
import TeacherHome from './Teacher Dashboard/Pages/Home/Home';
import TeacherAttendance from './Teacher Dashboard/Pages/Attendance/Attendance';
import TeacherSalary from './Teacher Dashboard/Pages/Salary/Salary';

// Not Found Page
import PageNotFound from './components/404/PageNotFound';
import Gallery from './pages/Gallery/Gallery';

const App = () => {
  const location = useLocation();
  const { teacherToken } = useUserContext();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isTeacherLoggedIn = !!teacherToken;

  return (
    <div>
      {isTeacherLoggedIn ? <TeacherNavbar /> : <Navbar />}
      <ToastContainer />
      <Toaster position="top-center" />

      <Routes>
        {isTeacherLoggedIn ? (
          <>
            <Route path="/" element={<TeacherHome />} />
            <Route path="/teacher/attendance" element={<TeacherAttendance />} />
            <Route path="/teacher/salary" element={<TeacherSalary />} />
            <Route path="*" element={<PageNotFound />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/staffs" element={<Staff />} />
            <Route path="/staffs/teacher" element={<TeacherDetails />} />
            <Route path="/curriculum" element={<CurriculumDetails />} />
            <Route path="/academics" element={<Academics />} />
            <Route path='/gallery' element = {<Gallery/>} />
            <Route path="/contact" element={<Contact />} />

            {/* Portal */}
            <Route path="/portal" element={<Portal />} />
            <Route path="/portal/fee/:type" element={<Payment />} />
            <Route path="/portal/services/:type" element={<Services />} />
            <Route path="/portal/services/:type/:id" element={<StudentDetails />} />
            <Route path="/portal/services/result/download" element={<ResultDownload />} />
            <Route path="/portal/fee/:type/:id" element={<StudentDetails />} />
            <Route path="/portal/fee/:type/:id/payment/:paymentId" element={<PaymentDetails />} />

            <Route path="*" element={<PageNotFound />} />
          </>
        )}
      </Routes>

      <Footer />
    </div>
  );
};

export default App;

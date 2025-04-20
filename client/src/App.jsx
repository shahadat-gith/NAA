import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from './components/Navbar/Navbar';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Admission from './pages/Admission/Admission';
import Staff from './pages/Staff/Staff';
import Academics from './pages/Academics/Academics';
import Contact from './pages/Contact/Contact';
import Login from './pages/Login/Login';
import Footer from './components/Footer/Footer';
import AdmissionForm from './pages/AdmissionForm/AdmissionForm';
import PaymentFailed from './pages/PaymentFailed/PaymentFailed '
import PaymentSuccess from './pages/PaymentSucess/PaymentSuccess';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import StudentProfileCard from './pages/StudentProfileCard/StudentProfileCard';
import TeacherProfile from './pages/TeacherProfile/TeacherProfile';
import Notices from './pages/Notices/Notices';
import StudentPortal from './pages/StudentPortal/StudentPortal';
import FeePayment from './pages/StudentPortal/Payments/FeePayment';
import StudentServices from './pages/StudentPortal/Services/StudentServices';
import TeacherDetails from './pages/Staff/TeacherDetails/TeacherDetails';

const App = () => {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return (
    <div>
      <Navbar />
      
      <ToastContainer />
      
      <Routes>
        <Route path="/login/:tab" element={<Login />} />
        <Route path="/student-login" element={<Login />} />
        <Route path="/teacher-login" element={<Login />} />
        <Route path="/admin-login" element={<Login />} />
        <Route path="/register" element={<Login />} />
        
        <Route path="/forgot-password/:tab" element={<ForgotPassword />} />
        <Route path="/student" element={<ForgotPassword />} />
        <Route path="/teacher" element={<ForgotPassword />} />
        
        <Route path="/student/profile" element={<StudentProfileCard />} />
        <Route path="/teacher/profile" element={<TeacherProfile />} />
        
        <Route path="/" element={<Home />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/about" element={<About />} />
        <Route path="/admission-portal" element={<Admission />} />
        <Route path="/admission-portal/admission-form" element={<AdmissionForm />} />
        <Route path="/staffs" element={<Staff />} />
        <Route path="/staffs/teacher" element={<TeacherDetails />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/student-portal" element={<StudentPortal />} />
        
        {/* Student Services Routes */}
        <Route path="/student-portal/student-services" element={<StudentServices defaultTab="result" />} />
        <Route path="/student-portal/student-services/:tab" element={<StudentServices />} />
       
        
        {/* Updated Fee Payment Routes */}
        <Route path="/student-portal/fee-payment" element={<FeePayment defaultTab="monthly" />} />
        <Route path="/student-portal/fee-payment/:tab" element={<FeePayment />} />
      </Routes>
      
      <Footer />
    </div>
  );
};

export default App;
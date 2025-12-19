import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import PageStartLoader from './components/PageStartLoader/PageStartLoader';

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
import Services from './pages/Portal/Services';
import ResultDownload from './pages/Portal/Result/ResultDownload';


// Not Found Page
import PageNotFound from './components/404/PageNotFound';
import Gallery from './pages/Gallery/Gallery';
import StudentDetails from './pages/Portal/StudentDetails/StudentDetails';
import Search from './pages/Portal/Search/Search';
import { useContext } from 'react';
import { AppContext } from './context/AppContext';

const App = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const {loading} = useContext(AppContext)

  if(loading){
    return <PageStartLoader/>
  }

  return (
    <div>
      <Navbar/>
      <ToastContainer />
      <Toaster position="top-center" />

      <Routes>
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
            <Route path="/portal/search" element={<Search />} />
            <Route path='/portal/student/:id' element={<StudentDetails/>}/>
            <Route path="/portal/services/:type" element={<Services />} />
            <Route path="/portal/services/result/download" element={<ResultDownload />} />
            <Route path="*" element={<PageNotFound />} />
          </>
      </Routes>

      <Footer />
    </div>
  );
};

export default App;

import { Routes, Route, Navigate } from "react-router-dom";
import { useAppContext } from './context/Context';
import Login from './pages/Login';
import Loader from './components/common/Loader';
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";

const App = () => {
  const { staff, sessionChecking } = useAppContext();

  if (sessionChecking) {
    return <Loader fullScreen={true} size="large" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      {/* Render Navbar globally only if the staff session exists */}
      {staff && <Navbar />}
      
      <div className="flex-1 flex flex-col">
        <Routes>
          <Route 
            path="/login" 
            element={!staff ? <Login /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/*" 
            element={staff ? (
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            ) : (
              <Navigate to="/login" replace />
            )} 
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
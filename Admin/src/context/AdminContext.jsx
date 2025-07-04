import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const AdminContext = createContext();

export const AdminContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [adminToken, setAdminToken] = useState(localStorage.getItem("adminToken") || ""); // Default to empty string
  const [attendanceReport, setAttendanceReport] = useState(null);

  // Function to get query parameter from URL
  const getQueryParam = (param) => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(param);
  };


  // Handle token initialization and fetching queries
  useEffect(() => {
    // Check for token in URL (from redirect)
    const tokenFromUrl = getQueryParam("token");
    if (tokenFromUrl) {
      setAdminToken(tokenFromUrl);
      localStorage.setItem("adminToken", tokenFromUrl); // Save to localStorage
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

  }, [adminToken, backendUrl]);

  const value = {
    backendUrl,
    adminToken,
    setAdminToken,
    attendanceReport,
    setAttendanceReport,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

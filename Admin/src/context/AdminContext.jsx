import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const AdminContext = createContext();

export const AdminContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [adminToken, setAdminToken] = useState(localStorage.getItem("adminToken") || ""); // Default to empty string
  const [pendingContactQueries, setPendingContactQueries] = useState("");
  const [pendingAdmissionQueries, setPendingAdmissionQueries] = useState("");
  const [attendanceReport, setAttendanceReport] = useState(null);

  // Function to get query parameter from URL
  const getQueryParam = (param) => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(param);
  };

  // Fetch pending queries from backend
  const fetchPendingQueries = async () => {
    try {
      if (!adminToken) return; // Skip if no token

      const config = {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      };

      // Fetch Contact Queries
      const contactRes = await axios.get(`${backendUrl}/api/query/get-contact-queries`, config);
      if (contactRes.data.success) {
        const pendingContacts = contactRes.data.queries.filter((query) => !query.isReplied).length;
        setPendingContactQueries(pendingContacts);
      }

      // Fetch Admission Queries
      const admissionRes = await axios.get(`${backendUrl}/api/query/get-admission-queries`, config);
      if (admissionRes.data.success) {
        const pendingAdmissions = admissionRes.data.queries.filter((query) => !query.isReplied).length;
        setPendingAdmissionQueries(pendingAdmissions);
      }
    } catch (error) {
      console.error("Error fetching queries:", error);
    }
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

    // If token exists (from URL or localStorage), fetch queries
    if (adminToken) {
      fetchPendingQueries();
    }
  }, [adminToken, backendUrl]);

  const value = {
    backendUrl,
    adminToken,
    setAdminToken,
    pendingContactQueries,
    pendingAdmissionQueries,
    fetchPendingQueries,
    attendanceReport,
    setAttendanceReport,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

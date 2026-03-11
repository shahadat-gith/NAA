import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { AdminContext } from "./AdminContext";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const { backendUrl, adminToken } = useContext(AdminContext);
  /* ================= CONTEXT VALUE ================= */
  const [students, setStudents] = useState([]);
  const [fetchingStudents, setFetchingStudents] = useState(true);
  const [fetchingSettings, setFetchingSettings] = useState(true);
  const [settings, setSettings] = useState(null);


  /* ================= FETCH STUDENTS ================= */
  const fetchStudents = async () => {
    if (!adminToken) return;
    setFetchingStudents(true);
    try {
      const response = await axios.get(`${backendUrl}/api/student/list`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });


      if (response.data.success) {
        setStudents(response.data.students || []);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load students");
    } finally {
      setFetchingStudents(false);
    }
  };



  /* ================= FETCH SETTINGS ================= */
  const fetchSettings = async () => {
    if (!adminToken) return;
    setFetchingSettings(true);
    try {
      const response = await axios.get(`${backendUrl}/api/settings/`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      if (response.data.success) {
        const data = response.data.data || {};
        setSettings(data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setFetchingSettings(false);
    }
  };

  /* ================= LOAD ON MOUNT ================= */
  useEffect(() => {
    fetchSettings();
  }, [adminToken]);


  /* ================= LOAD ON MOUNT ================= */
  useEffect(() => {
    fetchStudents();
  }, []);

  const value = {
    students, fetchingStudents,
    settings, fetchingSettings
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () =>
  useContext(AppContext);

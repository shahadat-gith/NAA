import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("adminToken");

  /* ================= INITIAL DATA LOADING ================= */
  const [loading, setLoading] = useState(false);

  /* ================= STATE VARIABLES ================= */
  const [students, setStudents] = useState([]);
  const [settings, setSettings] = useState(null);
  const [gallerImages, setGallerImages] = useState([]);
  const [achievers, setAchievers] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [results, setResults] = useState([]);
  const [teachers, setTeachers] = useState([]);

  /* ================= FETCH ALL INITIAL DATA ================= */
  const fetchInitialData = async (refresh) => {
    if (!token) return;
    if(refresh) setLoading(true);

    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/initial-data`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        const {
          students: fetchedStudents,
          admissions: fetchedAdmissions,
          results: fetchedResults,
          teachers: fetchedTeachers,
          achievers: fetchedAchievers,
          galleries: fetchedGalleries,
          serviceSettings: fetchedServiceSettings,
          feesSettings: fetchedFeesSettings,
          authorities: fetchedAuthorities,
          admitCards: fetchedAdmitCards,
          exams: fetchedExams,
          heroImages: fetchedHeroImages,
        } = data.data;

        setStudents(fetchedStudents || []);
        setAdmissions(fetchedAdmissions || []);
        setResults(fetchedResults || []);
        setTeachers(fetchedTeachers || []);
        setAchievers(fetchedAchievers || []);
        setGallerImages(fetchedGalleries || []);
        setSettings({
          serviceSettings: fetchedServiceSettings?.[0] || null,
          feesSettings: fetchedFeesSettings?.[0] || null,
          authorities: fetchedAuthorities || [],
          admitCards: fetchedAdmitCards || [],
          exams: fetchedExams || [],
          heroImages: fetchedHeroImages || [],
        });
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
      toast.error("Failed to load initial data");
    } finally {
      setLoading(false);
    }
  };


  /* ================= AUTO LOAD ================= */

  useEffect(() => {
    if (!token) return;

    fetchInitialData();
  }, [token]);

  /* ================= CONTEXT VALUE ================= */

  const value = {
    // Initial Data
    loading,
    setLoading,
    fetchInitialData,
    fetchingSettings: loading,
    loadingInitialData: loading,

    // Data States
    students,
    setStudents,
    settings,
    setSettings,
    gallerImages,
    setGallerImages,
    achievers,
    setAchievers,
    admissions,
    setAdmissions,
    results,
    setResults,
    teachers,
    setTeachers,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () =>
  useContext(AppContext);

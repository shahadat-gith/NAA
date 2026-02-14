import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("adminToken");

  /* ================= STUDENTS ================= */

  const [students, setStudents] = useState([]);
  const [fetchingStudents, setFetchingStudents] = useState(false);

  const fetchStudents = async () => {
    if (!token) return;
    setFetchingStudents(true);

    try {
      const res = await axios.get(
        `${backendUrl}/api/student/list`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStudents(res.data?.students || []);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setFetchingStudents(false);
    }
  };

  /* ================= SETTINGS ================= */

  const [settings, setSettings] = useState(null);
  const [fetchingSettings, setFetchingSettings] =
    useState(false);

  const getSettings = async (showLoader = true) => {
    if(showLoader) setFetchingSettings(true);
    if (!token) return;
    

    try {
      const { data } = await axios.get(
        `${backendUrl}/api/settings`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        setSettings(data.data);
      }
    } catch (err) {
      console.error(
        "Settings fetch error:",
        err
      );
    } finally {
      setFetchingSettings(false);
    }
  };

  /* ================= GALLERY ================= */

  const [gallerImages, setGallerImages] =
    useState([]);
  const [fetchingImages, setFetchingImages] =
    useState(false);

  const fetchGalleryImages = async () => {
    if (!token) return;
    setFetchingImages(true);

    try {
      const response = await axios.get(
        `${backendUrl}/api/gallery`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setGallerImages(
          response.data.images
        );
      }
    } catch (error) {
      console.error(
        "Fetch images error:",
        error
      );
      toast.error(
        error.response?.data?.message ||
        "Failed to fetch images"
      );
    } finally {
      setFetchingImages(false);
    }
  };

  /* ================= ACHIEVERS ================= */

  const [achievers, setAchievers] =
    useState([]);
  const [fetchingAchievers, setFetchingAchievers] =
    useState(false);

  const fetchAchievers = async () => {
    if (!token) return;
    setFetchingAchievers(true);

    try {
      const response = await axios.get(
        `${backendUrl}/api/achievers/get-achievers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAchievers(
        response.data.achievers || []
      );
    } catch (error) {
      console.error(
        "Fetch achievers error:",
        error
      );
      toast.error(
        error.response?.data?.message ||
        "Failed to fetch achievers"
      );
    } finally {
      setFetchingAchievers(false);
    }
  };

  /* ================= ADMISSIONS ================= */

  const [admissions, setAdmissions] =
    useState([]);
  const [fetchingAdmissions, setFetchingAdmissions] =
    useState(false);

  const fetchAdmissions = async () => {
    if (!token) return;
    setFetchingAdmissions(true);

    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admission/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setAdmissions(data.admissions);
      }


    } catch (error) {
      console.error(error);
    } finally {
      setFetchingAdmissions(false);
    }
  };

  /* ============ Result ==================== */

  const [results, setResults] = useState([]);
  const [fetchingResults, setFetchingResults] = useState(false)

  /* ================= FETCH RESULTS ================= */
  const fetchResults = async () => {
    try {
      setFetchingResults(true);

      const res = await axios.post(
        `${backendUrl}/api/results/all`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setResults(res.data.results || []);
      }
    } catch (err) {
      console.error("Error fetching results", err);
    } finally {
      setFetchingResults(false);
    }
  };


  /* ============= Teachers ================= */
  const [teachers, setTeachers] = useState([]);
  const [fetchingTeachers, setfetchingTeachers] = useState(false)

  const fetchTeachers = async () => {
    setfetchingTeachers(true)
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/teacher/all-teachers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setTeachers(data.teachers || []);
      } else {
        toast.error("Failed to fetch teachers");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Something went wrong while fetching teachers");
    } finally {
      setfetchingTeachers(false)
    }
  };


  /* ================= AUTO LOAD ================= */

  useEffect(() => {
    if (!token) return;

    fetchStudents();
    getSettings(true);
    fetchGalleryImages();
    fetchAchievers();
    fetchAdmissions();
    fetchResults();
    fetchTeachers();
  }, [token]);

  /* ================= CONTEXT VALUE ================= */

  const value = {
    // Students
    students,
    setStudents,
    fetchStudents,
    fetchingStudents,

    // Settings
    settings,
    setSettings,
    fetchingSettings,
    getSettings,

    // Gallery
    gallerImages,
    fetchGalleryImages,
    fetchingImages,

    // Achievers
    achievers,
    setAchievers,
    fetchAchievers,
    fetchingAchievers,

    // Admissions
    admissions,
    setAdmissions,
    fetchAdmissions,
    fetchingAdmissions,

    //Results
    results,
    setResults,
    fetchingResults,
    fetchResults,

    //Teachers
    teachers,
    setTeachers,
    fetchTeachers,
    fetchingTeachers,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () =>
  useContext(AppContext);

import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const adminUrl = import.meta.env.VITE_ADMIN_URL;

  const [teachers, setTeachers] = useState([]);
  const [authorities, setAuthorities] = useState([]);
  const [heroImages, setHeroImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHomeData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/home-data`);

      if (res.data.success) {
        const { teachers, authorities, heroImages } = res.data.data;

        setTeachers(teachers || []);
        setAuthorities(authorities || []);
        setHeroImages(heroImages || []);
      }
    } catch (error) {
      console.error("Error fetching home data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, [backendUrl]);

  const value = {
    backendUrl,
    adminUrl,
    teachers,
    authorities,
    heroImages,
    loading,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

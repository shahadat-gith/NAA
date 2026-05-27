import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const adminUrl = import.meta.env.VITE_ADMIN_URL;
  const [authorities, setAuthorities] = useState([]);
  const [heroImages, setHeroImages] = useState([]);
  const [serviceSettings, setServiceSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notices, setNotices] = useState([])


  const fetchHomeData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/home-data`);

      if (res.data.success) {
        const { authorities, heroImages, serviceSettings, notices} = res.data.data;

        setAuthorities(authorities || []);
        setHeroImages(heroImages || []);
        setServiceSettings(serviceSettings || [])
        setNotices(notices || [])
      }
    } catch (error) {
      console.error("Error fetching home data:", error);
      if (error.response) {
        console.error("Backend response:", error.response.status, error.response.data);
      }
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
    authorities,
    heroImages,
    serviceSettings,
    notices,
    loading,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

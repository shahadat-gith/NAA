import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"

export const AdminContext = createContext();

export const AdminContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("adminToken") || ""
  );

  const navigate = useNavigate()

  useEffect(() => {
    if (adminToken) {
      localStorage.setItem("adminToken", adminToken);
    } else {
      localStorage.removeItem("adminToken");
    }
  }, [adminToken]);

  return (
    <AdminContext.Provider
      value={{
        backendUrl,
        adminToken,
        setAdminToken,
        navigate,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

import { createContext, useEffect, useState } from "react";

export const AdminContext = createContext();

export const AdminContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("adminToken") || ""
  );

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
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

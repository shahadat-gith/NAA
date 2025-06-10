import { createContext, useState, useEffect, useContext } from "react";
import { AdminContext } from "./AdminContext";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [admissions, setAdmissions] = useState([]);
  const [pendingAdmissions, setPendingAdmissions] = useState(0);
  const [approvedAdmissions, setApprovedAdmissions] = useState(0);

  const { adminToken ,backendUrl} = useContext(AdminContext);

  const value = {
    admissions,
    setAdmissions,
    pendingAdmissions,
    setPendingAdmissions,
    approvedAdmissions,
    setApprovedAdmissions,
    backendUrl,
    
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext); // Optional utility hook

import { createContext, useContext } from "react";

export const AppContext = createContext({
  backendUrl: "",
  staff: null,
  setStaff: () => {},
  sessionChecking: true,
  setSessionChecking: () => {},
  loadStaff: async () => {},
  logout: async () => {},
  lastUpdated: "",
});


export const useAppContext = () => {
  return useContext(AppContext);
};

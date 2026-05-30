import { createContext } from "react";

export const AppContext = createContext({
  backendUrl: "",
  teacher: null,
  setTeacher: () => {},
  loading: true,
  loadTeacher: () => {},
});
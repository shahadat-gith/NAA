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

export const ThemeContext = createContext({
  activeTheme: "light",
  COLORS: {
    primary: "#ff4d2d",
    background: "#f5f5f5",
    card: "#ffffff",
    textPrimary: "#1f2937",
    textSecondary: "#6b7280",
    border: "#e5e7eb",
    success: "#16a34a",
    danger: "#ef4444",
    white: "#ffffff",
    inactive: "#9ca3af",
  },
});

export const useAppContext = () => {
  return useContext(AppContext);
};

export const useThemeContext = () => {
  return useContext(ThemeContext);
};
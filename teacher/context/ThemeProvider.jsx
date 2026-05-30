import React, { createContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import * as SecureStore from "expo-secure-store";

export const ThemeContext = createContext();

const lightColors = {
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
};

const darkColors = {
  primary: "#ff6b4a",
  background: "#111827",
  card: "#1f2937",
  textPrimary: "#f9fafb",
  textSecondary: "#9ca3af",
  border: "#374151",
  success: "#22c55e",
  danger: "#ef4444",
  white: "#ffffff",
  inactive: "#6b7280",
};

export const ThemeProvider = ({ children }) => {
  const systemTheme = useColorScheme();

  // Explicit default value set to "system"
  const [themeMode, setThemeMode] = useState("system");

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await SecureStore.getItemAsync("theme-mode");
        if (savedTheme) {
          setThemeMode(savedTheme);
        }
      } catch (error) {
        // Fallback safety to keep "system" if storage fails
        setThemeMode("system");
      }
    };

    loadTheme();
  }, []);

  const activeTheme = themeMode === "system" ? systemTheme || "light" : themeMode;
  const COLORS = activeTheme === "dark" ? darkColors : lightColors;

  const updateThemeMode = async (mode) => {
    setThemeMode(mode);
    try {
      await SecureStore.setItemAsync("theme-mode", mode);
    } catch (error) {
      console.warn("Could not save theme preference securely:", error);
    }
  };

  const value = useMemo(
    () => ({
      themeMode,
      activeTheme,
      COLORS,
      updateThemeMode,
    }),
    [COLORS, themeMode, activeTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
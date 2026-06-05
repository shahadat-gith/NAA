import { useEffect, useMemo, useState } from "react";
import { ThemeContext } from "./Context";

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

const ThemeProvider = ({ children }) => {
  const [activeTheme, setActiveTheme] = useState(
    window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
      ? "dark"
      : "light"
  );

  useEffect(() => {
    if (!window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    const handleChange = (e) => {
      setActiveTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const COLORS = activeTheme === "dark" ? darkColors : lightColors;

  const value = useMemo(
    () => ({
      activeTheme,
      COLORS,
    }),
    [COLORS, activeTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;
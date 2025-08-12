import React, { createContext, useContext, useState, useEffect } from "react";

export type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("light");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("theme", theme);
    }
  }, [theme, isHydrated]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

const lightTheme = {
  primary: "#3b82f6",
  primaryDark: "#1d4ed8",
  primaryLight: "#93c5fd",
  success: "#10b981",
  successDark: "#059669",
  danger: "#ef4444",
  dangerDark: "#dc2626",
  warning: "#f59e0b",
  purple: "#8b5cf6",
  background: "#ffffff",
  backgroundSecondary: "#f9fafb",
  backgroundTertiary: "#f3f4f6",
  surface: "#ffffff",
  surfaceSecondary: "rgba(250, 250, 250, 0.5)",
  surfaceTertiary: "rgba(250, 250, 250, 0.3)",
  text: "#1a1a1a",
  textSecondary: "#4a4a4a",
  textTertiary: "#6a6a6a",
  textMuted: "#9ca3af",
  border: "#e5e7eb",
  borderSecondary: "rgba(0, 0, 0, 0.05)",
  borderTertiary: "rgba(0, 0, 0, 0.08)",
  shadow: "rgba(0, 0, 0, 0.08)",
  shadowSecondary: "rgba(0, 0, 0, 0.04)",
  shadowHover: "rgba(0, 0, 0, 0.12)",
};

const darkTheme = {
  primary: "#60a5fa",
  primaryDark: "#3b82f6",
  primaryLight: "#93c5fd",
  success: "#34d399",
  successDark: "#10b981",
  danger: "#f87171",
  dangerDark: "#ef4444",
  warning: "#fbbf24",
  purple: "#a78bfa",
  background: "#0f172a",
  backgroundSecondary: "#1e293b",
  backgroundTertiary: "#334155",
  surface: "#1e293b",
  surfaceSecondary: "rgba(51, 65, 85, 0.5)",
  surfaceTertiary: "rgba(51, 65, 85, 0.3)",
  text: "#f1f5f9",
  textSecondary: "#cbd5e1",
  textTertiary: "#94a3b8",
  textMuted: "#64748b",
  border: "#334155",
  borderSecondary: "rgba(255, 255, 255, 0.05)",
  borderTertiary: "rgba(255, 255, 255, 0.08)",
  shadow: "rgba(0, 0, 0, 0.25)",
  shadowSecondary: "rgba(0, 0, 0, 0.15)",
  shadowHover: "rgba(0, 0, 0, 0.35)",
};

export const colors = {
  light: lightTheme,
  dark: darkTheme,
};

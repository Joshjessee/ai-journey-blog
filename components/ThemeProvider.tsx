"use client";
/*
  Theme Provider Component

  "use client" directive tells Next.js this component runs in the browser
  (not on the server). We need this because:
  1. We're using React hooks (useState, useEffect)
  2. We're accessing browser APIs (localStorage, document)

  This component:
  - Manages dark/light mode state
  - Persists the user's preference to localStorage
  - Respects system preferences as default
  - Provides theme context to all child components
*/

import { createContext, useContext, useEffect, useState } from "react";

// Define the shape of our theme context
type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark"; // The actual theme being displayed
}

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom hook to use the theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // State for the user's theme preference
  const [theme, setThemeState] = useState<Theme>("system");

  // State for the actual resolved theme (what's being displayed)
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  // State to track if we've loaded from localStorage yet
  const [mounted, setMounted] = useState(false);

  // On mount, check localStorage and system preference
  useEffect(() => {
    // Get saved theme from localStorage
    const savedTheme = localStorage.getItem("theme") as Theme | null;

    if (savedTheme) {
      setThemeState(savedTheme);
    }

    setMounted(true);
  }, []);

  // Update the actual theme whenever theme preference changes
  useEffect(() => {
    if (!mounted) return;

    // Determine what theme to actually show
    let resolvedValue: "light" | "dark";

    if (theme === "system") {
      // Check system preference
      resolvedValue = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } else {
      resolvedValue = theme;
    }

    setResolvedTheme(resolvedValue);

    // Apply the theme to the document
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedValue);
  }, [theme, mounted]);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted || theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      setResolvedTheme(e.matches ? "dark" : "light");
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, mounted]);

  // Function to update theme (saves to localStorage too)
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Always provide the context, but hide content until mounted
  // to prevent flash of wrong theme
  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {mounted ? children : <div style={{ visibility: "hidden" }}>{children}</div>}
    </ThemeContext.Provider>
  );
}

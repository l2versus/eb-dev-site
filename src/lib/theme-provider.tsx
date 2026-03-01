// ══════════════════════════════════════════════════════════════════════════════
// 🎨 Theme Provider — Dark/Light Mode
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // Carregar tema do localStorage
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("eb-theme") as Theme;
    if (saved) {
      setTheme(saved);
    }
  }, []);

  // Aplicar classe no documento
  useEffect(() => {
    if (!mounted) return;
    
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light-mode");
      root.classList.remove("dark-mode");
    } else {
      root.classList.add("dark-mode");
      root.classList.remove("light-mode");
    }
    
    localStorage.setItem("eb-theme", theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Evitar flash de tema errado
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

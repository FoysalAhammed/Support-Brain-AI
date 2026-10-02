"use client";

import * as React from "react";

export type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "supportbrain.theme";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggle: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function systemPrefersDark() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function resolve(theme: Theme): "light" | "dark" {
  if (theme === "system") return systemPrefersDark() ? "dark" : "light";
  return theme;
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const resolved = resolve(theme);
  document.documentElement.classList.toggle("dark", resolved === "dark");
  document.documentElement.style.colorScheme = resolved;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">("light");

  React.useEffect(() => {
    const stored = (window.localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "system";
    setThemeState(stored);
    setResolvedTheme(resolve(stored));
    applyTheme(stored);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const current = (window.localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "system";
      if (current === "system") {
        setResolvedTheme(resolve("system"));
        applyTheme("system");
      }
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const setTheme = React.useCallback((next: Theme) => {
    setThemeState(next);
    setResolvedTheme(resolve(next));
    window.localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }, []);

  const toggle = React.useCallback(() => {
    setThemeState((current) => {
      const nextResolved = resolve(current) === "dark" ? "light" : "dark";
      window.localStorage.setItem(STORAGE_KEY, nextResolved);
      applyTheme(nextResolved);
      setResolvedTheme(nextResolved);
      return nextResolved;
    });
  }, []);

  const value = React.useMemo(
    () => ({ theme, resolvedTheme, setTheme, toggle }),
    [theme, resolvedTheme, setTheme, toggle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export function ThemeScript() {
  const script = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}')||'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var e=document.documentElement;if(d){e.classList.add('dark');}e.style.colorScheme=d?'dark':'light';}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

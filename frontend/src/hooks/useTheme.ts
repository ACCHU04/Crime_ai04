import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>("cip-theme", "dark");

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      return next;
    });
  }, [setTheme]);

  const setThemeMode = useCallback(
    (mode: Theme) => {
      setTheme(mode);
      document.documentElement.classList.toggle("dark", mode === "dark");
    },
    [setTheme],
  );

  return { theme, toggleTheme, setTheme: setThemeMode };
}

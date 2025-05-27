// src/hooks/useTheme.js
import { useEffect, useState } from "react";

export const themes = [
  { id: "clair", label: "Clair", icon: "🌞" },
  { id: "sombre", label: "Sombre", icon: "🌙" },
  { id: "nature", label: "Nature", icon: "🌿" },
];

const THEME_KEY = "theme";

export function getTheme() {
  return localStorage.getItem(THEME_KEY) || "clair";
}

export function applyTheme(themeId) {
  const html = document.documentElement;
  themes.forEach(({ id }) => html.classList.remove(`theme-${id}`));
  html.classList.add(`theme-${themeId}`);
  localStorage.setItem(THEME_KEY, themeId);
}

export default function useTheme() {
  const [theme, setThemeState] = useState(getTheme());

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  useEffect(() => {
    applyTheme(theme);
  }, []);

  return { theme, setTheme, themes };
}

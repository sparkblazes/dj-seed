// src/assets/js/config.ts
import "primereact/resources/themes/lara-light-blue/theme.css"; // light theme
import "primereact/resources/themes/lara-dark-blue/theme.css"; // dark theme

export type ThemeType = "light" | "dark";
export type TopbarColor = "light" | "dark";
export type MenuSize =
  | "default"
  | "sm-hover-active"
  | "condensed"
  | "full"
  | "hidden";
export type MenuColor = "light" | "dark";

interface Config {
  theme: ThemeType;
  topbar: { color: TopbarColor };
  menu: { size: MenuSize; color: MenuColor };
}

const defaultConfig: Config = {
  theme: "light",
  topbar: { color: "light" },
  menu: { size: "sm-hover-active", color: "dark" },
};

const html = document.documentElement;

let savedConfig = sessionStorage.getItem("__LARKON_CONFIG__");
let config: Config = savedConfig
  ? JSON.parse(savedConfig)
  : { ...defaultConfig };

// Apply from HTML attributes if present
config.theme =
  (html.getAttribute("data-bs-theme") as ThemeType) || config.theme;
config.topbar.color =
  (html.getAttribute("data-topbar-color") as TopbarColor) ||
  config.topbar.color;
config.menu.color =
  (html.getAttribute("data-menu-color") as MenuColor) || config.menu.color;
config.menu.size =
  (html.getAttribute("data-menu-size") as MenuSize) || config.menu.size;

// Save default
(window as any).defaultConfig = { ...config };
(window as any).config = config;

/**
 * Load PrimeReact theme dynamically
 */
export const applyTheme = (theme: string): void => {
  const head = document.head;
  const existingLink = document.getElementById("prime-theme") as HTMLLinkElement | null;

  const newHref =
    theme === "dark"
      ? "https://unpkg.com/primereact/resources/themes/lara-dark-blue/theme.css"
      : "https://unpkg.com/primereact/resources/themes/lara-light-blue/theme.css";

  if (existingLink) {
    existingLink.href = newHref;
  } else {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.id = "prime-theme";
    link.href = newHref;
    head.appendChild(link);
  }

  localStorage.setItem("theme", theme);
};

/**
 * Apply config to <html> and PrimeReact
 */
function applyConfig(cfg: Config) {
  html.setAttribute("data-bs-theme", cfg.theme);
  html.setAttribute("data-topbar-color", cfg.topbar.color);
  html.setAttribute("data-menu-color", cfg.menu.color);

  if (window.innerWidth <= 1140) {
    html.setAttribute("data-menu-size", "hidden");
  } else {
    html.setAttribute("data-menu-size", cfg.menu.size);
  }

  sessionStorage.setItem("__LARKON_CONFIG__", JSON.stringify(cfg));

  // ✅ apply PrimeReact theme
  applyTheme(cfg.theme);
}

// First run
applyConfig(config);

export function setTheme(theme: ThemeType) {
  config.theme = theme;
  applyConfig(config);
}

export function toggleTheme() {
  config.theme = config.theme === "light" ? "dark" : "light";
  applyConfig(config);
}

export function getTheme(): ThemeType {
  return config.theme;
}

// components/ThemeToggle.tsx
"use client";
import React from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = React.useState<"light"|"dark">("light");

  React.useEffect(() => {
    // đọc theme từ localStorage hoặc prefers-color-scheme
    const saved = typeof window !== "undefined" ? localStorage.getItem("theme") as "light"|"dark"|null : null;
    const pref = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const t = saved ?? pref;
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  return (
    <button className="btn" onClick={toggle} aria-pressed={theme==="dark"} aria-label="Toggle theme">
      {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}

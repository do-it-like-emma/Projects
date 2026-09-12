"use client";

import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";

function readStored(): Theme | null {
  try {
    const v = localStorage.getItem("theme");
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

function systemTheme(): Theme {
  return typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeToggle() {
  // Rendered only after mount: before that the server and client disagree
  // about which theme is active, and guessing causes a hydration mismatch.
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(readStored() ?? systemTheme());
  }, []);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch {
        // Private windows and blocked site data: the choice just won't persist.
      }
      return next;
    });
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        theme === null
          ? "Toggle colour theme"
          : `Switch to ${theme === "dark" ? "light" : "dark"} theme`
      }
      className="h-8 w-8 grid place-items-center rounded border border-[var(--border)] hover:bg-[var(--bg-hover)] transition-colors"
    >
      <span aria-hidden="true" className="text-[13px]">
        {theme === "dark" ? "☀" : "☾"}
      </span>
    </button>
  );
}

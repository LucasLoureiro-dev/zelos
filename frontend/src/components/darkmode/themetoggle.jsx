// app/components/ThemeToggle.js
"use client";

import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from '../../app/contexts/ThemeContext'; 

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle align-items-center ${isDarkMode ? "dark" : ""}`}
    >
      <span className="icon sun mb-1">
        <FaSun />
      </span>
      <span className="icon moon mb-1">
        <FaMoon />
      </span>
      <span className="ball"></span>
    </button>
  );
}
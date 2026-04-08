import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import Button from "./components/ui/Button";

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) {
      return stored === "dark";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={() => setIsDarkMode((value) => !value)}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      className="text-muted-foreground hover:text-foreground"
    >
      {isDarkMode ? <Sun /> : <Moon />}
    </Button>
  );
};

export default ThemeToggle;

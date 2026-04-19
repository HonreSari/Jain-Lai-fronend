import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/stores/useThemeStore";

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="relative group">
      <button
        onClick={toggleTheme}
        className="p-2.5 rounded-lg border border-[var(--color-border)] 
                   bg-[var(--color-card)] hover:bg-[var(--color-secondary)] 
                   hover:border-[var(--color-primary)] transition-all duration-200
                   active:scale-95 cursor-pointer"
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5 text-[var(--color-accent)]" />
        ) : (
          <Moon className="w-5 h-5 text-[var(--color-primary)]" />
        )}
      </button>
      
      {/* Tooltip */}
      <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 
                       text-xs font-medium text-white bg-[var(--color-primary)] 
                       rounded-md opacity-0 group-hover:opacity-100 transition-opacity
                       whitespace-nowrap pointer-events-none z-50">
        {theme === "dark" ? "Light Mode" : "Jian Lai Night"}
      </span>
    </div>
  );
}

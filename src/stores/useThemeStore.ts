import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark";

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "dark", // Default: Jian Lai Night
      
      toggleTheme: () => {
        const newTheme = get().theme === "dark" ? "light" : "dark";
        
        // ✅ Apply to HTML element for CSS variable switching
        document.documentElement.setAttribute("data-theme", newTheme);
        
        // ✅ Update color-scheme for native UI elements
        document.documentElement.style.colorScheme = newTheme;
        
        set({ theme: newTheme });
      },
    }),
    {
      name: "theme-preference", // localStorage key
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);

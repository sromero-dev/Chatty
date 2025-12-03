import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "cupcake",

  setTheme: (theme) => {
    // First save the theme in localStorage
    localStorage.setItem("chat-theme", theme);
    // Then update the state
    set({ theme });
  },
}));

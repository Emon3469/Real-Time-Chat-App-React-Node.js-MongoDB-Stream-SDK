import { create } from "zustand";

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("Necho-theme") || "coffee",
    setTheme: (theme) => {
        localStorage.setItem("Necho-theme", theme);
        set({theme});
    },
}))
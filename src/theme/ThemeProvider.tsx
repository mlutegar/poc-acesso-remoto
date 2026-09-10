import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { presets, defaultPreset, type ThemePreset } from "./tokens";

type Mode = "light" | "dark";

interface ThemeCtx {
  preset: ThemePreset;
  setPreset: (id: string) => void;
  presets: ThemePreset[];
  mode: Mode;
  toggleMode: () => void;
}

const Ctx = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preset, setPresetState] = useState<ThemePreset>(() => {
    const saved = localStorage.getItem("brand");
    return presets.find((p) => p.id === saved) ?? defaultPreset;
  });
  const [mode, setMode] = useState<Mode>(
    () => (localStorage.getItem("mode") as Mode) ?? "light"
  );

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--c-navy", preset.navy);
    root.style.setProperty("--c-blue", preset.blue);
    localStorage.setItem("brand", preset.id);
  }, [preset]);

  useEffect(() => {
    document.documentElement.setAttribute("data-mode", mode);
    localStorage.setItem("mode", mode);
  }, [mode]);

  return (
    <Ctx.Provider
      value={{
        preset,
        setPreset: (id) => setPresetState(presets.find((p) => p.id === id) ?? defaultPreset),
        presets,
        mode,
        toggleMode: () => setMode((m) => (m === "light" ? "dark" : "light")),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme deve ser usado dentro de ThemeProvider");
  return ctx;
}

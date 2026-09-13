import { useTheme } from "../theme/ThemeProvider";

/** Prova o conceito white-label: troca marca + paleta em runtime. */
export default function ThemeSwitcher() {
  const { preset, setPreset, presets, mode, toggleMode } = useTheme();

  return (
    <div className="flex items-center gap-2">
      {presets.length > 1 && (
        <>
          <label className="sr-only" htmlFor="brand-select">
            Marca
          </label>
          <select
            id="brand-select"
            value={preset.id}
            onChange={(e) => setPreset(e.target.value)}
            className="h-8 rounded border border-line bg-card px-2 text-xs text-ink outline-none focus:border-blue"
            title="Trocar marca (white-label)"
          >
            {presets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </>
      )}
      <button
        onClick={toggleMode}
        aria-label={mode === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
        title={mode === "light" ? "Modo escuro" : "Modo claro"}
        className="flex h-8 w-8 items-center justify-center rounded border border-line bg-card text-xs font-bold text-ink hover:border-blue"
      >
        {mode === "light" ? "E" : "C"}
      </button>
    </div>
  );
}

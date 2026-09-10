import { useTheme } from "../theme/ThemeProvider";

/** Logo trocável (white-label). Usa a inicial do preset ativo. */
export default function BrandMark({ size = 40 }: { size?: number }) {
  const { preset } = useTheme();
  return (
    <div
      className="flex items-center justify-center rounded-full border-2 border-white/80 bg-blue font-extrabold text-white"
      style={{ width: size, height: size, fontSize: size * 0.45 }}
      aria-label={`Logo ${preset.name}`}
    >
      {preset.initials}
    </div>
  );
}

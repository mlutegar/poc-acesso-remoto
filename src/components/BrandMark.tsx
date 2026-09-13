import { useTheme } from "../theme/ThemeProvider";

/** Logo do produto. Usa a imagem de public/ quando existir; senão, o monograma. */
export default function BrandMark({ size = 36 }: { size?: number }) {
  const { preset } = useTheme();
  if (preset.logo) {
    return (
      <img
        src={preset.logo}
        alt={`Logo ${preset.name}`}
        style={{ height: size, width: "auto", display: "block" }}
      />
    );
  }
  return (
    <div
      className="flex items-center justify-center rounded-[2px] bg-blue font-semibold text-white"
      style={{ width: size, height: size, fontSize: size * 0.5 }}
      aria-label={`Logo ${preset.name}`}
    >
      {preset.initials}
    </div>
  );
}

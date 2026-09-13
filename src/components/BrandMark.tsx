import { useTheme } from "../theme/ThemeProvider";

/**
 * Logo do produto. "mark" é a marca sem o slogan, para o cabeçalho; "full" é a
 * logo completa, para o login. Sem imagem configurada, cai no monograma.
 */
export default function BrandMark({
  size = 40,
  variant = "mark",
}: {
  size?: number;
  variant?: "mark" | "full";
}) {
  const { preset } = useTheme();
  const src = variant === "full" ? preset.logo : preset.logoMark || preset.logo;
  if (src) {
    return (
      <img
        className="sh-logo"
        src={src}
        alt={`Logo ${preset.name}`}
        style={{ height: size, width: "auto" }}
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

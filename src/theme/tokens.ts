// Identidade do produto. A paleta vem da logo; os canais RGB "R G B"
// permitem opacidade nas classes do Tailwind.

export interface ThemePreset {
  id: string;
  name: string;
  tagline: string;
  initials: string;
  /** Caminho da logo em public/, quando houver. Sem ela, usa o monograma. */
  logo: string;
  // canais RGB "R G B"
  navy: string;
  blue: string;
}

export const presets: ThemePreset[] = [
  {
    id: "atrio",
    name: "Átrio",
    tagline: "Controle de Acesso & Portaria Remota",
    initials: "A",
    logo: "",
    navy: "11 31 58",
    blue: "20 110 245",
  },
];

export const defaultPreset = presets[0];

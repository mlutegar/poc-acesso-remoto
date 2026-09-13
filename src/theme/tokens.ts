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
    tagline: "Seu condomínio sob controle",
    initials: "A",
    logo: "/logo-atrio.png",
    // medidas na própria logo: #182838 no nome, #405870 no "A"
    navy: "24 40 56",
    blue: "64 88 112",
  },
];

export const defaultPreset = presets[0];

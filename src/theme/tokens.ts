// Branding white-label. Cada preset é uma "marca" revendável.
// Status (success/danger/warning) ficam fixos por clareza semântica; variam navy + blue.
// Ver Obsidian: 06-Nome-do-Produto / 07-Paleta-de-Cor

export interface ThemePreset {
  id: string;
  name: string;
  tagline: string;
  initials: string;
  // canais RGB "R G B"
  navy: string;
  blue: string;
}

export const presets: ThemePreset[] = [
  {
    id: "portaris",
    name: "Portaris",
    tagline: "Controle de Acesso & Portaria Remota",
    initials: "P",
    navy: "11 31 58",
    blue: "20 110 245",
  },
  {
    id: "vigio",
    name: "Vigio",
    tagline: "Monitoramento & Portaria Inteligente",
    initials: "V",
    navy: "8 43 40",
    blue: "13 148 136",
  },
  {
    id: "sentric",
    name: "Sentric",
    tagline: "Segurança & Acesso Corporativo",
    initials: "S",
    navy: "34 27 66",
    blue: "124 58 237",
  },
];

export const defaultPreset = presets[0];

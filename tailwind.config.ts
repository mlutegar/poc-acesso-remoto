import type { Config } from "tailwindcss";

// Cores via CSS variables (canais RGB) → habilita white-label em runtime + dark mode.
// Ver Obsidian: 07-Paleta-de-Cor
const c = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

export default {
  darkMode: ["selector", '[data-mode="dark"]'],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: c("--c-navy"),
        blue: c("--c-blue"),
        bg: c("--c-bg"),
        card: c("--c-card"),
        success: c("--c-success"),
        danger: c("--c-danger"),
        warning: c("--c-warning"),
        ink: c("--c-ink"),
        line: c("--c-line"),
        stripe: c("--c-stripe"),
        head: c("--c-head"),
      },
      fontFamily: {
        sans: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgb(var(--c-ink) / 0.08), 0 1px 2px rgb(var(--c-ink) / 0.04)",
      },
      keyframes: {
        "slide-in": {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "slide-in": "slide-in 0.35s ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;

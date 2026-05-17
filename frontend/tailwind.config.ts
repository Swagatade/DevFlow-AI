import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./sections/**/*.{ts,tsx}",
    "./providers/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "2.5rem",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: {
          50: "hsl(var(--surface-50))",
          100: "hsl(var(--surface-100))",
          200: "hsl(var(--surface-200))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        accent: {
          cyan: "hsl(var(--accent-cyan))",
          mint: "hsl(var(--accent-mint))",
          violet: "hsl(var(--accent-violet))",
          amber: "hsl(var(--accent-amber))",
          rose: "hsl(var(--accent-rose))",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-space)", "var(--font-geist)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        glow: "0 0 60px hsl(var(--accent-cyan) / 0.18)",
        "glow-violet": "0 0 80px hsl(var(--accent-violet) / 0.22)",
        "inner-line": "inset 0 1px 0 hsl(0 0% 100% / 0.08)",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to right, hsl(var(--foreground) / 0.07) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground) / 0.07) 1px, transparent 1px)",
        "aurora-mesh":
          "radial-gradient(circle at 18% 18%, hsl(var(--accent-cyan) / 0.24), transparent 28%), radial-gradient(circle at 72% 0%, hsl(var(--accent-violet) / 0.2), transparent 28%), radial-gradient(circle at 88% 68%, hsl(var(--accent-mint) / 0.18), transparent 32%), linear-gradient(135deg, hsl(218 55% 5%), hsl(228 43% 7%) 45%, hsl(210 55% 4%))",
        "button-shine":
          "linear-gradient(110deg, transparent 0%, hsl(0 0% 100% / 0.18) 35%, transparent 70%)",
      },
      keyframes: {
        aurora: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(2%, -2%, 0) scale(1.04)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-220% 0" },
          "100%": { backgroundPosition: "220% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "grid-pulse": {
          "0%, 100%": { opacity: "0.32" },
          "50%": { opacity: "0.56" },
        },
      },
      animation: {
        aurora: "aurora 18s ease-in-out infinite",
        shimmer: "shimmer 2.8s linear infinite",
        float: "float 7s ease-in-out infinite",
        "grid-pulse": "grid-pulse 5s ease-in-out infinite",
      },
      borderRadius: {
        card: "0.5rem",
      },
    },
  },
  plugins: [forms, typography],
};

export default config;

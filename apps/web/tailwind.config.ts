import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // Peec AI design tokens
        "peec-red": "#d80027",          // rgb(216,0,39) — accent red
        "peec-dark": "#171717",         // rgb(23,23,23) — primary dark / black
        "peec-light": "#f7f7f7",        // rgb(247,247,247) — page background
        "peec-warm": "#e8e4e2",         // rgb(232,228,226) — dark section text
        "peec-border-light": "#e5e5e5", // rgb(229,229,229) — light borders
        "peec-border-dark": "#525252",  // rgb(82,82,82) — dark borders
        "peec-text-secondary": "#525252", // rgb(82,82,82)
        "peec-text-tertiary": "#737373",  // rgb(115,115,115)
        "peec-text-muted": "#a3a3a3",     // rgb(163,163,163)
        stone: {
          50: "#fafaf9",   // rgb(250,250,249) — Peec stone palette
          100: "#f5f5f5",  // rgb(245,245,245)
          200: "#e5e5e5",  // rgb(229,229,229)
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",  // rgb(115,115,115)
          600: "#525252",  // rgb(82,82,82)
          700: "#404040",  // rgb(64,64,64)
          800: "#262626",  // rgb(38,38,38)
          850: "#1c1917",  // rgb(28,25,23) — stone dark
          900: "#171717",  // rgb(23,23,23) — primary dark
          950: "#0c0a09",  // rgb(12,10,9) — deepest dark
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-fragment-mono)", "var(--font-geist-mono)", "monospace"],
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "2xs": ["9px", { lineHeight: "1.2em" }],
        xs: ["11px", { lineHeight: "1.4em" }],
        sm: ["13px", { lineHeight: "1.4em", letterSpacing: "-0.01em" }],
        base: ["15px", { lineHeight: "1.4em", letterSpacing: "-0.01em" }],
        lg: ["16px", { lineHeight: "1.4em", letterSpacing: "-0.015em" }],
        xl: ["18px", { lineHeight: "1.2em", letterSpacing: "-0.02em" }],
        "2xl": ["22px", { lineHeight: "1.2em", letterSpacing: "-0.02em" }],
        "3xl": ["26px", { lineHeight: "1.1em", letterSpacing: "-0.02em" }],
        "4xl": ["32px", { lineHeight: "1.1em", letterSpacing: "-0.02em" }],
        "5xl": ["40px", { lineHeight: "1.1em", letterSpacing: "-0.03em" }],
        "6xl": ["48px", { lineHeight: "1.1em", letterSpacing: "-0.03em" }],
        "7xl": ["64px", { lineHeight: "1.1em", letterSpacing: "-0.03em" }],
      },
      spacing: {
        section: "80px",
        "grid-gap": "40px",
        component: "16px",
      },
      maxWidth: {
        peec: "1148px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        pill: "1000px",
      },
      boxShadow: {
        card: "0 4px 4px rgba(23,23,23,0.04)",
        "card-hover": "0 8px 16px rgba(23,23,23,0.08)",
      },
      backgroundImage: {
        "gradient-divider":
          "linear-gradient(to right, transparent, rgba(82, 82, 82, 0.5), transparent)",
      },
      screens: {
        tablet: "810px",
        desktop: "1200px",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out forwards",
        "slide-in-left": "slide-in-left 0.5s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
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
        // Design tokens
        "peec-red": "#d80027",
        "peec-dark": "#171717",
        "peec-light": "#f7f7f7",
        "peec-border-light": "#e5e5e5",
        "peec-text-secondary": "#525252",
        "peec-text-tertiary": "#737373",
        "peec-text-muted": "#a3a3a3",
        stone: {
          50: "#fafaf9",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
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
      },
      maxWidth: {
        peec: "1148px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        card: "0 4px 4px rgba(23,23,23,0.04)",
        "card-hover": "0 8px 16px rgba(23,23,23,0.08)",
      },
      screens: {
        tablet: "810px",
        desktop: "1200px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

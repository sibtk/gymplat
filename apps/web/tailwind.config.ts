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
        "2xs": ["10px", { lineHeight: "1.4" }],
        xs: ["11px", { lineHeight: "1.45" }],
        sm: ["13px", { lineHeight: "1.5", letterSpacing: "-0.003em" }],
        base: ["14px", { lineHeight: "1.6", letterSpacing: "-0.006em" }],
        lg: ["16px", { lineHeight: "1.5", letterSpacing: "-0.011em" }],
        xl: ["18px", { lineHeight: "1.3", letterSpacing: "-0.014em" }],
        "2xl": ["22px", { lineHeight: "1.25", letterSpacing: "-0.018em" }],
        "3xl": ["28px", { lineHeight: "1.2", letterSpacing: "-0.021em" }],
        "4xl": ["34px", { lineHeight: "1.15", letterSpacing: "-0.025em" }],
        "5xl": ["42px", { lineHeight: "1.1", letterSpacing: "-0.028em" }],
        "6xl": ["52px", { lineHeight: "1.08", letterSpacing: "-0.032em" }],
        "7xl": ["64px", { lineHeight: "1.05", letterSpacing: "-0.035em" }],
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

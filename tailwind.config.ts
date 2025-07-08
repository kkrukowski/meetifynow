import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './index.html',
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        primary: "hsl(var(--primary))",
        "primary-hover": "#0096E0",
        "primary-active": "#0086C0",
        "light-primary": "#99DDFF",
        "light-primary-hover": "#88D3FF",
        "light-primary-active": "#77C9FF",
        light: "#f4fcff",
        "light-hover": "#e4f4ff",
        "light-active": "#d4ecff",
        gray: "#8e8e8e",
        "light-gray": "#dedede",
        dark: "#004466",
        red: "#FF6B73",
        "light-red": "#ffeef1",
        "dark-red": "#d14b4f",
        green: "#27b346",
        "light-green": "#dbffe3",
        gold: "#FFC107",
        "gold-dark": "#ffe607",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      screens: {
        "h-sm": { raw: "(min-height: 640px)" },
        "h-smd": { raw: "(min-height: 700px)" },
        "h-md": { raw: "(min-height: 768px)" },
        "h-mdl": { raw: "(min-height: 800px)" },
        "h-hd": { raw: "(min-height: 840px)" },
        "h-lg": { raw: "(min-height: 1024px)" },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "cell-select": {
          "0%, 100%": { backgroundColor: "none" },
          "50%": { backgroundColor: "#0086C0" },
        },
        "copy-button": {
          "0%, 100%": { opacity: "100" },
          "20%, 80%": { opacity: "0" },
        },
        "copy-button-success": {
          "0%, 20%, 80%, 100%": { opacity: "0" },
          "40%, 60%": { opacity: "100" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "cell-select": "cell-select 500ms ease-in-out",
        "copy-button": "copy-button 1500ms ease-in-out",
        "copy-button-success": "copy-button-success 1500ms ease-in-out",
      },
    },
    fontFamily: {
      poppins: ["Poppins", "sans-serif"],
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
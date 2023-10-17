/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        primary: "#00A6FB",
        "primary-hover": "#0096E0",
        "primary-active": "#0086C0",
        "light-primary": "#99DDFF",
        "light-primary-hover": "#88D3FF",
        "light-primary-active": "#77C9FF",
        light: "#f4fcff",
        "light-hover": "#e4f4ff",
        "light-active": "#d4ecff",
        gray: "#8e8e8e",
        dark: "#004466",
        red: "#FF6B73",
        green: "#43cc61",
        gold: "#FFC107",
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
        "cell-select": {
          "0%, 100%": { backgroundColor: "none" },
          "50%": { backgroundColor: "#0086C0" },
        },
      },
      animation: {
        "cell-select": "cell-select 500ms ease-in-out",
      },
    },
    fontFamily: {
      poppins: ["Poppins", "sans-serif"],
    },
  },
  plugins: [],
};

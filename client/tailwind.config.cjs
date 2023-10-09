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
        light: "#f4fcff",
        "light-hover": "#e4f4ff",
        "light-active": "#d4ecff",
        gray: "#8e8e8e",
        dark: "#00263b",
        red: "#FF6B73",
        green: "#38B453",
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
    },
    fontFamily: {
      poppins: ["Poppins", "sans-serif"],
    },
  },
  plugins: [],
};

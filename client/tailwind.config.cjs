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
        dark: "#1c1c1c",
        red: "#FF6B73",
      },
    },
    fontFamily: {
      poppins: ["Poppins", "sans-serif"],
    },
  },
  plugins: [],
};

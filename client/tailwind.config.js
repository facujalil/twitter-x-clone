/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      xl: { max: "1280px" },
      lg: { max: "1100px" },
      md: { max: "750px" },
      sm: { max: "500px" },
      xs: { max: "380px" },
    },
    fontFamily: {
      roboto: ["Roboto", "sans-serif"],
    },
    extend: {},
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#51950A",
        "dark-olive": "#315906",
        "bg-light": "#F5F4F7",
        "muted-text": "#A7AAA7",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(to right, #EAFFD4, #5CA310)",
      },
    },
  },
  plugins: [],
};

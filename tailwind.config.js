/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        PRIMARY: "#1B599E",
        DARKYELLOW: "#D4C200",
        BLACK: "#1B1818",
        GREEN: "#8EC742",
        DARKBLUE: "#143257",
        LIGHTGRAY: "#F5F5F5",
        BORDERGRAY: "#E6E6E6",
        TEXTGRAY: "#666666",
        BACKGROUNDGRAY: "#FAFAFA",
        DARKRED: "#E30606",
        REDPALE:"#fbaab8"
      },
      fontFamily: {
        SFProText: ["SF Pro Text"],
      },
    },
  },
  plugins: [],
};

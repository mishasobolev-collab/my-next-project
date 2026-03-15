/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  "./lib/**/*.{js,ts,jsx,tsx,mdx}",
],
  theme: {
    extend: {
      fontFamily: {
        display: ["Montserrat", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
      },
      colors: {
        brand: {
          bg: "#FAFAF9",
          surface: "#FFFFFF",
          surfaceAlt: "#F5F5F3",
          border: "#E5E5E3",
          borderSubtle: "#EDEDEB",
          text: "#1A1A1A",
          textSec: "#525252",
          textMuted: "#8C8C8C",
          highlight: "#2D5F2D",
          highlightSoft: "rgba(45,95,45,0.06)",
          warm: "#B44D1E",
          warmSoft: "rgba(180,77,30,0.06)",
          blue: "#25508C",
          red: "#C53030",
        },
      },
    },
  },
  plugins: [],
};

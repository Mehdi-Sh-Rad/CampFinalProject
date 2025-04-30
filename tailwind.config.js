/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "selector",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "shop-red": "#6b7280",
        "shop-gray": "#14b8a6",
        "shop-red-light": "#FFC0D0",
        "shop-bg": "#f3f4f6",
        "shop-dark": "#222738",
        primary: "#7B61FF",
        secondary: "#4BC0D9",
        background: "#F0EBFF",
        dark: "#1B1F3B",
      },
    },
  },
  plugins: [],
};
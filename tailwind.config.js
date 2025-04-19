// Note: This file is used to configure Tailwind CSS
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "selector",
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./app/**/*.{js,ts,jsx,tsx}"],
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
        "shop-bg": "#F5F6FA",
        "shop-dark": "#222738",
      },
    },
  },
  plugins: [],
};

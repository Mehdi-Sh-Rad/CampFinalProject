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
        "shop-red": "#ed1944",
        "shop-gray": "#8A92A6",
        "shop-red-light": "#FFC0D0",
        "shop-bg": "#F5F6FA",
        "shop-dark": "#222738",
      },
    },
  },
  plugins: [],
};

// export default {
//   darkMode: "selector",
//   content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
//   theme: {
//     container: {
//       center: true,
//     },
//     extend: {
//       colors: {
//         background: "var(--background)",
//         foreground: "var(--foreground)",
//         "shop-red": "#ed1944",
//         "shop-gray": "#8A92A6",
//         "shop-red-light": "#FFC0D0",
//         "shop-bg": "#F5F6FA",
//         "shop-dark": "#222738",
//       },
//     },
//   },
//   plugins: [],
// };

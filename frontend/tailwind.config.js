/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        foreground: "var(--foreground)",
        primary_red: "#ca6867",
        primary_purple: "#9a99ff",
        primary_orange: "#fc9711",
        primary_pink: "#ecaff0",
      },
    },
  },
  plugins: [],
};

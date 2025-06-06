import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/homeSections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/aboutSections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/loginSections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/dashboardSections/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "375px",
      md: "768px",
      lg: "1200px",
      xl: "1440px",
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        md: "2rem",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        calistoga: ["Calistoga", "cursive"],
      },
    },
  },
  plugins: [],
};
export default config;

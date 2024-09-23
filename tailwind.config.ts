import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'input-bg': "var(--input-bg)",
        'input-border': "var(--input-border)",
        primary: "var(--primary)",
        'primary-hover': "var(--primary-hover)",
      },
    },
  },
  plugins: [],
};
export default config;

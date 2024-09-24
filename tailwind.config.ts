import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/globals.css", // Add this line
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
        secondary: "var(--secondary)",
        'secondary-hover': "var(--secondary-hover)",
        success: "var(--success)",
        'success-hover': "var(--success-hover)",
        danger: "var(--danger)",
        'danger-hover': "var(--danger-hover)",
      },
    },
  },
  plugins: [],
};
export default config;

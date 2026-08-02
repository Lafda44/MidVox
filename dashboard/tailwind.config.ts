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
        primary: {
          DEFAULT: "#1677ff",
          hover: "#4096ff",
          light: "#0958d9",
          dark: "#002c8c",
          glow: "rgba(22, 119, 255, 0.35)",
        },
        surface: {
          DEFAULT: "#ffffff",
          light: "#f7f8fa",
          hover: "#f0f2f5",
        },
        secondary: {
          DEFAULT: "#f7f8fa",
          light: "#f0f2f5",
          hover: "#e9ecf1",
        },
        accent: {
          blue: "rgba(22, 119, 255, 0.08)",
          sky: "rgba(64, 150, 255, 0.08)",
        },
        slate: {
          50: "#111111",
          100: "#1f242c",
          200: "#2e2e2e",
          300: "#4b5563",
          400: "#646464",
          500: "#8a929e",
          600: "#b7bec7",
          700: "#d9dde2",
          800: "#eceef1",
          900: "#ffffff",
          950: "#f5f6f8",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      borderRadius: {
        xs: "3px",
        sm: "5px",
        DEFAULT: "8px",
        lg: "10px",
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(16px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out both",
        "fade-in-up": "fade-in-up 0.5s ease-out both",
        "slide-in-right": "slide-in-right 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;

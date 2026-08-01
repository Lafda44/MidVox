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
          DEFAULT: "#8b5cf6",
          hover: "#7c3aed",
          light: "#a78bfa",
          dark: "#6d28d9",
          glow: "rgba(139, 92, 246, 0.35)",
        },
        surface: {
          DEFAULT: "#14141b",
          light: "#1a1a23",
          hover: "#20202a",
        },
        secondary: {
          DEFAULT: "#1a1a23",
          light: "#20202a",
          hover: "#262631",
        },
        accent: {
          violet: "rgba(139, 92, 246, 0.08)",
          indigo: "rgba(99, 102, 241, 0.08)",
        },
        slate: {
          50: "#f8f8fa",
          100: "#efeff4",
          200: "#e2e2e9",
          300: "#c5c5d1",
          400: "#9d9dad",
          500: "#6b6b7a",
          600: "#454552",
          700: "#30303b",
          800: "#23232c",
          900: "#14141b",
          950: "#0b0b10",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-inter)", "ui-sans-serif", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
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

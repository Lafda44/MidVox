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
          DEFAULT: "#6366f1",
          hover: "#818cf8",
          light: "#a5b4fc",
          dark: "#4338ca",
          glow: "rgba(99, 102, 241, 0.35)",
        },
        accent: {
          DEFAULT: "#06b6d4",
          hover: "#22d3ee",
          light: "#67e8f9",
          dark: "#0e7490",
          glow: "rgba(6, 182, 212, 0.35)",
          blue: "rgba(99, 102, 241, 0.08)",
          sky: "rgba(6, 182, 212, 0.08)",
        },
        surface: {
          DEFAULT: "#0a0a0f",
          light: "#12121a",
          hover: "#1a1a24",
        },
        secondary: {
          DEFAULT: "#12121a",
          light: "#1a1a24",
          hover: "#23232f",
        },
        slate: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-grotesk)", "ui-sans-serif", "system-ui", "sans-serif"],
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
        "neon-primary": "linear-gradient(135deg, #6366f1, #a855f7)",
        "neon-cyan": "linear-gradient(135deg, #06b6d4, #22d3ee)",
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
        "float-orb": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "33%": { transform: "translate3d(24px, -32px, 0) scale(1.08)" },
          "66%": { transform: "translate3d(-20px, 18px, 0) scale(0.94)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(600%)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out both",
        "fade-in-up": "fade-in-up 0.5s ease-out both",
        "slide-in-right": "slide-in-right 0.4s ease-out both",
        "float-orb": "float-orb 14s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        blink: "blink 1s step-end infinite",
        "gradient-x": "gradient-x 6s ease infinite",
        scan: "scan 4s linear infinite",
        "spin-slow": "spin-slow 12s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;

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
        background: "#0C0C0C",
        foreground: "#F5F5F5",
        primary: {
          DEFAULT: "#F59E0B",
          hover:   "#FBB024",
          light:   "#FCD34D",
          dark:    "#D97706",
          dim:     "rgba(245,158,11,0.10)",
        },
        panel: {
          DEFAULT: "#131313",
          raise:   "#0F0F0F",
          hover:   "#1A1A1A",
        },
        surface: {
          DEFAULT: "#131313",
          2:       "#1A1A1A",
          3:       "#222222",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.07)",
          mid:     "rgba(255,255,255,0.12)",
          strong:  "rgba(255,255,255,0.18)",
        },
        gold: {
          DEFAULT: "#F59E0B",
          hi:      "#FBB024",
          dim:     "rgba(245,158,11,0.10)",
          glow:    "rgba(245,158,11,0.25)",
        },
      },
      fontFamily: {
        sans:    ["var(--font-plus-jakarta)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono:    ["var(--font-mono)", "ui-monospace", "Menlo", "monospace"],
      },
      borderRadius: {
        sm:    "4px",
        DEFAULT: "6px",
        lg:    "10px",
        xl:    "14px",
        "2xl": "18px",
        "3xl": "24px",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(16px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to:   { backgroundPosition: "-200% 0" },
        },
        blink: {
          "0%,100%": { opacity: "1" },
          "50%":     { opacity: "0" },
        },
        "glow-pulse": {
          "0%,100%": { opacity: "0.5" },
          "50%":     { opacity: "1" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%":     { transform: "translateY(-14px)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to:   { transform: "translateX(-50%)" },
        },
        "shimmer-gold": {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "gold-pulse": {
          "0%,100%": { boxShadow: "0 0 18px -4px rgba(245,158,11,0.4)" },
          "50%":     { boxShadow: "0 0 28px -2px rgba(245,158,11,0.7)" },
        },
      },
      animation: {
        "fade-in":        "fade-in 0.5s ease-out both",
        "fade-in-up":     "fade-in-up 0.5s ease-out both",
        "slide-in-right": "slide-in-right 0.4s ease-out both",
        shimmer:          "shimmer 4s linear infinite",
        blink:            "blink 1s step-end infinite",
        "glow-pulse":     "glow-pulse 2.5s ease-in-out infinite",
        float:            "float 5s ease-in-out infinite",
        marquee:          "marquee 34s linear infinite",
        "shimmer-gold":   "shimmer-gold 3s linear infinite",
        "gold-pulse":     "gold-pulse 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;

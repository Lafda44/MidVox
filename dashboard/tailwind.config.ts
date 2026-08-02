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
        background: "#080810",
        foreground: "#f0f0f8",
        primary: {
          DEFAULT: "#5865F2",
          hover:   "#7C85FD",
          light:   "#A5AFFB",
          dark:    "#4752C4",
          dim:     "rgba(88,101,242,0.18)",
        },
        accent: {
          DEFAULT: "#38BDF8",
          hover:   "#7DD3FC",
          dim:     "rgba(56,189,248,0.15)",
        },
        violet: {
          DEFAULT: "#a855f7",
          dim:     "rgba(168,85,247,0.15)",
        },
        panel: {
          DEFAULT: "#0f0f1c",
          raise:   "#0d0d18",
          hover:   "#14142a",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.07)",
          mid:     "rgba(255,255,255,0.12)",
          strong:  "rgba(255,255,255,0.18)",
        },
      },
      fontFamily: {
        sans:    ["var(--font-outfit)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-unbounded)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono:    ["var(--font-mono)", "ui-monospace", "Menlo", "monospace"],
      },
      borderRadius: {
        sm:    "6px",
        DEFAULT: "10px",
        lg:    "16px",
        xl:    "20px",
        "2xl": "24px",
        "3xl": "32px",
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
        drift: {
          "0%,100%": { transform: "translate3d(0,0,0) scale(1)" },
          "33%":     { transform: "translate3d(30px,-40px,0) scale(1.06)" },
          "66%":     { transform: "translate3d(-24px,20px,0) scale(0.96)" },
        },
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to:   { backgroundPosition: "-200% 0" },
        },
        blink: {
          "0%,100%": { opacity: "1" },
          "50%":     { opacity: "0" },
        },
        scan: {
          "0%":   { transform: "translateY(-100%)", opacity: "0.6" },
          "100%": { transform: "translateY(1200%)", opacity: "0" },
        },
        "glow-pulse": {
          "0%,100%": { opacity: "0.5" },
          "50%":     { opacity: "1" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-in":         "fade-in 0.5s ease-out both",
        "fade-in-up":      "fade-in-up 0.5s ease-out both",
        "slide-in-right":  "slide-in-right 0.4s ease-out both",
        drift:             "drift 20s ease-in-out infinite",
        shimmer:           "shimmer 4s linear infinite",
        blink:             "blink 1s step-end infinite",
        scan:              "scan 3.5s linear infinite",
        "glow-pulse":      "glow-pulse 2.5s ease-in-out infinite",
        "spin-slow":       "spin-slow 12s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;

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
        background: "#050508",
        foreground: "#f0f0f8",
        primary: {
          DEFAULT: "#6366F1",
          hover:   "#818CF8",
          light:   "#A5B4FC",
          dark:    "#4F46E5",
          dim:     "rgba(99,102,241,0.18)",
        },
        accent: {
          DEFAULT: "#06B6D4",
          hover:   "#22D3EE",
          dim:     "rgba(6,182,212,0.15)",
        },
        violet: {
          DEFAULT: "#a855f7",
          dim:     "rgba(168,85,247,0.15)",
        },
        neon: {
          indigo: "#6366F1",
          cyan:   "#06B6D4",
          rose:   "#FB7185",
          amber:  "#FBBF24",
        },
        panel: {
          DEFAULT: "#0d0d1c",
          raise:   "#0a0a14",
          hover:   "#12122a",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.07)",
          mid:     "rgba(255,255,255,0.12)",
          strong:  "rgba(255,255,255,0.18)",
        },
      },
      fontFamily: {
        sans:    ["var(--font-plus-jakarta)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "ui-sans-serif", "system-ui", "sans-serif"],
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
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%":     { transform: "translateY(-14px)" },
        },
        "grid-pan": {
          from: { backgroundPosition: "0 0" },
          to:   { backgroundPosition: "64px 64px" },
        },
        "neon-pulse": {
          "0%,100%": { boxShadow: "0 0 18px -4px rgba(99,102,241,0.55), 0 0 40px -8px rgba(6,182,212,0.35)" },
          "50%":     { boxShadow: "0 0 26px -2px rgba(99,102,241,0.8), 0 0 56px -6px rgba(6,182,212,0.5)" },
        },
        "tilt": {
          "0%,100%": { transform: "rotate(0deg)" },
          "25%":     { transform: "rotate(1.2deg)" },
          "75%":     { transform: "rotate(-1.2deg)" },
        },
        "marquee": {
          from: { transform: "translateX(0)" },
          to:   { transform: "translateX(-50%)" },
        },
        "aurora": {
          "0%,100%": { transform: "translate3d(0,0,0) scale(1)", opacity: "0.55" },
          "50%":     { transform: "translate3d(4%, -6%, 0) scale(1.12)", opacity: "0.9" },
        },
        "typing-dot": {
          "0%,80%,100%": { opacity: "0.25", transform: "translateY(0)" },
          "40%":         { opacity: "1", transform: "translateY(-3px)" },
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
        float:             "float 5s ease-in-out infinite",
        "grid-pan":        "grid-pan 6s linear infinite",
        "neon-pulse":      "neon-pulse 2.6s ease-in-out infinite",
        tilt:              "tilt 4s ease-in-out infinite",
        marquee:           "marquee 34s linear infinite",
        aurora:            "aurora 14s ease-in-out infinite",
        "typing-dot":      "typing-dot 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;

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
        background: "#060A14",
        foreground: "#F1F5F9",
        primary: {
          DEFAULT: "#3D7EFF",
          hover:   "#5A94FF",
          light:   "#93B8FF",
          dark:    "#2563EB",
          dim:     "rgba(61,126,255,0.10)",
        },
        navy: {
          DEFAULT: "#060A14",
          1:       "#080D1A",
          2:       "#0C1428",
          3:       "#0F1A33",
          card:    "rgba(13,20,40,0.9)",
        },
        surface: {
          DEFAULT: "#0C1428",
          2:       "#0F1A33",
          3:       "#152040",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.06)",
          mid:     "rgba(255,255,255,0.10)",
          blue:    "rgba(61,126,255,0.18)",
          "blue-hi": "rgba(61,126,255,0.35)",
        },
        blue: {
          DEFAULT: "#3D7EFF",
          hi:      "#5A94FF",
          dim:     "rgba(61,126,255,0.10)",
          glow:    "rgba(61,126,255,0.30)",
          muted:   "#93B8FF",
        },
        muted: "#7E8FAB",
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
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to:   { backgroundPosition: "-200% 0" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%":     { transform: "translateY(-10px)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to:   { transform: "translateX(-50%)" },
        },
        "blue-pulse": {
          "0%,100%": { boxShadow: "0 0 18px -4px rgba(61,126,255,0.4)" },
          "50%":     { boxShadow: "0 0 32px -2px rgba(61,126,255,0.7)" },
        },
        blink: {
          "0%,100%": { opacity: "1" },
          "50%":     { opacity: "0" },
        },
      },
      animation: {
        "fade-in":    "fade-in 0.5s ease-out both",
        "fade-in-up": "fade-in-up 0.5s ease-out both",
        shimmer:      "shimmer 4s linear infinite",
        float:        "float 6s ease-in-out infinite",
        marquee:      "marquee 36s linear infinite",
        "blue-pulse": "blue-pulse 2.5s ease-in-out infinite",
        blink:        "blink 1s step-end infinite",
      },
    },
  },
  plugins: [],
};
export default config;

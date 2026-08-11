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
        bg: "#F7F7F2",
        background: "#F7F7F2",
        foreground: "#161713",
        surface: {
          DEFAULT: "#FFFFFF",
          2: "#F3F4EE",
          3: "#E8EBDD",
        },
        panel: {
          DEFAULT: "#FFFFFF",
          raise: "#F7F7F2",
          hover: "#EDF1DF",
        },
        ink: "#161713",
        muted: "#6E7167",
        faint: "#9B9E93",
        border: {
          DEFAULT: "#DEDFD6",
          mid: "#CDD0C3",
          strong: "#B8BCAE",
        },
        primary: {
          DEFAULT: "#8A9A5B",
          hover: "#718043",
          light: "#A8BD6D",
          dark: "#667744",
          dim: "rgba(138,154,91,0.10)",
        },
        orange: {
          DEFAULT: "#8A9A5B",
          hover: "#718043",
          light: "#F1F3E8",
          mid: "#DCE3C9",
        },
      },
      fontFamily: {
        sans:    ["var(--font-plus-jakarta)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono:    ["var(--font-mono)", "ui-monospace", "Menlo", "monospace"],
      },
      borderRadius: {
        sm:    "6px",
        DEFAULT: "8px",
        lg:    "12px",
        xl:    "16px",
        "2xl": "20px",
        "3xl": "28px",
      },
      boxShadow: {
        card:  "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)",
        btn:   "0 1px 2px rgba(0,0,0,0.10)",
        "btn-hover": "0 4px 14px rgba(138,154,91,0.24)",
      },
      keyframes: {
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%":     { transform: "translateY(-8px)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to:   { transform: "translateX(-50%)" },
        },
        blink: {
          "0%,100%": { opacity: "1" },
          "50%":     { opacity: "0" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s ease-out both",
        float:        "float 6s ease-in-out infinite",
        marquee:      "marquee 38s linear infinite",
        blink:        "blink 1s step-end infinite",
      },
    },
  },
  plugins: [],
};
export default config;

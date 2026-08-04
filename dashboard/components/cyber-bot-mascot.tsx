/**
 * CyberBot mascot — premium metallic-white + neon-violet illustration.
 * Pure SVG so it renders crisply at any size and can be tinted per section.
 */

import { cn } from "@/lib/utils";

export function CyberBotMascot({
  className,
  glow = true,
}: {
  className?: string;
  glow?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 320 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("select-none", className)}
      aria-label="MidVox CyberBot mascot"
      role="img"
    >
      <defs>
        <linearGradient id="mascot-metal" x1="64" y1="40" x2="256" y2="290" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="0.45" stopColor="#c7cbdd" />
          <stop offset="1" stopColor="#8b90ab" />
        </linearGradient>
        <linearGradient id="mascot-metal-dark" x1="90" y1="90" x2="230" y2="250" gradientUnits="userSpaceOnUse">
          <stop stopColor="#eef0f8" />
          <stop offset="1" stopColor="#5c6280" />
        </linearGradient>
        <linearGradient id="mascot-visor" x1="70" y1="110" x2="250" y2="190" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a5b4fc" />
          <stop offset="0.5" stopColor="#6366f1" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
        <radialGradient id="mascot-glow" cx="0.5" cy="0.5" r="0.5">
          <stop stopColor="#6366f1" stopOpacity="0.45" />
          <stop offset="1" stopColor="#6366f1" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="mascot-cheek" x1="100" y1="180" x2="150" y2="205" gradientUnits="userSpaceOnUse">
          <stop stopColor="#06b6d4" stopOpacity="0.85" />
          <stop offset="1" stopColor="#06b6d4" stopOpacity="0" />
        </linearGradient>
        <filter id="mascot-soft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <clipPath id="mascot-head-clip">
          <rect x="58" y="58" width="204" height="178" rx="52" />
        </clipPath>
      </defs>

      {glow && <ellipse cx="160" cy="160" rx="150" ry="150" fill="url(#mascot-glow)" filter="url(#mascot-soft)" />}

      {/* Antenna */}
      <rect x="152" y="18" width="16" height="34" rx="7" fill="url(#mascot-metal-dark)" />
      <circle cx="160" cy="14" r="12" fill="#a5b4fc" stroke="#6366f1" strokeWidth="3" />

      {/* Ears */}
      <rect x="34" y="112" width="26" height="46" rx="10" fill="url(#mascot-metal-dark)" />
      <rect x="260" y="112" width="26" height="46" rx="10" fill="url(#mascot-metal-dark)" />
      <rect x="42" y="122" width="10" height="26" rx="5" fill="#22d3ee" opacity="0.9" />
      <rect x="268" y="122" width="10" height="26" rx="5" fill="#22d3ee" opacity="0.9" />

      {/* Head */}
      <rect
        x="58"
        y="58"
        width="204"
        height="178"
        rx="52"
        fill="url(#mascot-metal)"
        stroke="#ffffff"
        strokeOpacity="0.55"
        strokeWidth="2"
      />

      {/* Inner head panel */}
      <rect x="78" y="78" width="164" height="138" rx="36" fill="#0b0c16" opacity="0.92" />

      {/* Visor glow backdrop */}
      <rect
        x="88"
        y="102"
        width="144"
        height="58"
        rx="26"
        fill="#6366f1"
        opacity="0.55"
        filter="url(#mascot-soft)"
      />

      {/* Visor */}
      <rect
        x="88"
        y="102"
        width="144"
        height="58"
        rx="26"
        fill="url(#mascot-visor)"
        stroke="#ffffff"
        strokeOpacity="0.6"
        strokeWidth="2.5"
      />
      {/* Visor highlight */}
      <ellipse cx="128" cy="120" rx="34" ry="10" fill="#ffffff" opacity="0.5" />
      <ellipse cx="196" cy="130" rx="16" ry="5" fill="#ffffff" opacity="0.28" />

      {/* Cheek vents */}
      <circle cx="108" cy="186" r="8" fill="url(#mascot-cheek)" />
      <circle cx="212" cy="186" r="8" fill="url(#mascot-cheek)" />

      {/* Mouth grille */}
      <rect x="136" y="172" width="48" height="8" rx="4" fill="#22273d" />
      <rect x="146" y="186" width="28" height="6" rx="3" fill="#22273d" />
      <rect x="152" y="196" width="16" height="5" rx="2.5" fill="#06b6d4" opacity="0.9" />

      {/* Collar */}
      <path
        d="M112 236 C112 262 148 276 160 276 C172 276 208 262 208 236"
        stroke="#ffffff"
        strokeOpacity="0.7"
        strokeWidth="4"
        fill="none"
      />
      <rect x="92" y="236" width="136" height="14" rx="7" fill="url(#mascot-metal-dark)" />

      {/* Chest core */}
      <circle cx="160" cy="276" r="18" fill="#0b0c16" stroke="#8b90ab" strokeWidth="4" />
      <circle cx="160" cy="276" r="9" fill="#6366f1" />
      <circle cx="160" cy="276" r="4" fill="#c7d2fe" />

      {/* Floating sparks */}
      <circle cx="60" cy="70" r="3" fill="#a5b4fc" opacity="0.9" />
      <circle cx="268" cy="230" r="3" fill="#22d3ee" opacity="0.9" />
      <circle cx="60" cy="240" r="2" fill="#22d3ee" opacity="0.7" />
      <circle cx="258" cy="70" r="2" fill="#a5b4fc" opacity="0.7" />
      <circle cx="92" cy="42" r="2" fill="#a5b4fc" opacity="0.55" />
      <circle cx="228" cy="36" r="2.5" fill="#22d3ee" opacity="0.55" />
    </svg>
  );
}

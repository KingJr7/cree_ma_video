import React from "react";
import { theme } from "./theme";

// Logo "Deuxnous" : un cœur dans un cercle lavande.
// Le cœur est tracé en path SVG (cœur lisse, pas de blobby).
export const Logo: React.FC<{ size?: number; ring?: boolean; ringColor?: string }> = ({ size = 200, ring = false, ringColor = theme.colors.lavender }) => (
  <div style={{ position: "relative", width: size, height: size }}>
    {ring ? (
      <div
        style={{
          position: "absolute",
          inset: -size * 0.18,
          borderRadius: "50%",
          border: `6px solid ${ringColor}`,
        }}
      />
    ) : null}
    <svg viewBox="0 0 200 200" width={size} height={size}>
      <defs>
        <linearGradient id="logoLav" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7A5CFF" />
          <stop offset="1" stopColor="#5A3CE8" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="92" fill="url(#logoLav)" />
      {/* Cœur lisse */}
      <path
        d="M100 158
           C 64 130, 36 110, 36 78
           C 36 58, 52 44, 72 44
           C 86 44, 96 52, 100 60
           C 104 52, 114 44, 128 44
           C 148 44, 164 58, 164 78
           C 164 110, 136 130, 100 158 Z"
        fill="#FFFFFF"
      />
    </svg>
  </div>
);

// Wordmark
export const Wordmark: React.FC<{ size?: number; color?: string }> = ({ size = 56, color = theme.colors.onyx }) => (
  <div
    style={{
      fontFamily: theme.fonts.display,
      fontSize: size,
      fontWeight: 700,
      letterSpacing: "-0.03em",
      color,
      lineHeight: 1,
    }}
  >
    Deux<span style={{ color: theme.colors.lavender }}>nous</span>
  </div>
);

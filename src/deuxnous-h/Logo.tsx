import React from "react";
import { theme } from "./theme";

export const Logo: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <svg viewBox="0 0 200 200" width={size} height={size}>
    <defs>
      <linearGradient id="logoH" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7FFFE0" />
        <stop offset="1" stopColor="#1DD3B0" />
      </linearGradient>
    </defs>
    <circle cx="100" cy="100" r="92" fill="url(#logoH)" />
    <path
      d="M100 158 C 64 130, 36 110, 36 78 C 36 58, 52 44, 72 44 C 86 44, 96 52, 100 60 C 104 52, 114 44, 128 44 C 148 44, 164 58, 164 78 C 164 110, 136 130, 100 158 Z"
      fill="#0A0A12"
    />
  </svg>
);

export const Wordmark: React.FC<{ size?: number; color?: string }> = ({ size = 56, color = theme.colors.text }) => (
  <div style={{ fontFamily: theme.fonts.display, fontSize: size, fontWeight: 800, letterSpacing: "-0.03em", color, lineHeight: 1 }}>
    Deux<span style={{ color: theme.colors.primary }}>nous</span>
  </div>
);

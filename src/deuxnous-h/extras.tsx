import React, { useMemo } from "react";
import { theme } from "./theme";

const PHOTO_BG = ["#FFE2D6", "#D9F0E4", "#E3DAFF", "#FFEFC0", "#FFD4D4", "#D4E8FF"];
const SHAPES = [
  (c: string) => (
    <g>
      <circle cx="40" cy="30" r="10" fill="#FFFFFF" opacity=".8" />
      <path d="M0 50 L18 38 L30 46 L48 32 L60 42 L80 36 L80 60 L0 60 Z" fill={c} />
    </g>
  ),
  (c: string) => (
    <g>
      <rect x="14" y="14" width="22" height="22" rx="3" fill={c} />
      <rect x="44" y="14" width="22" height="22" rx="3" fill={c} opacity=".6" />
      <rect x="14" y="44" width="52" height="14" rx="3" fill={c} />
    </g>
  ),
  (c: string) => (
    <g>
      <circle cx="40" cy="30" r="18" fill={c} />
      <path d="M40 50 C30 60 20 55 20 50" stroke={c} strokeWidth="3" fill="none" />
    </g>
  ),
];

export const Polaroid: React.FC<{
  width: number;
  seed: number;
  rotation?: number;
  caption?: string;
  bg?: string;
}> = ({ width, seed, rotation = 0, caption = "Souvenir", bg }) => {
  const color = bg || PHOTO_BG[seed % PHOTO_BG.length];
  const shape = SHAPES[seed % SHAPES.length];
  return (
    <div
      style={{
        width,
        background: "#FFFFFF",
        padding: width * 0.05,
        paddingBottom: width * 0.18,
        borderRadius: 4,
        boxShadow: theme.shadow.lift,
        transform: `rotate(${rotation}deg)`,
        boxSizing: "border-box",
      }}
    >
      <svg viewBox="0 0 80 60" width="100%" style={{ display: "block", aspectRatio: "4 / 3" }}>
        <rect width="80" height="60" fill={color} />
        {shape("#1DD3B0")}
      </svg>
      <div
        style={{
          fontFamily: theme.fonts.display,
          fontSize: width * 0.07,
          color: theme.colors.onyx,
          textAlign: "center",
          marginTop: width * 0.04,
          fontWeight: 700,
        }}
      >
        {caption}
      </div>
    </div>
  );
};

// QR déterministe
const N = 25;
const findMatrix = (seed: string) => {
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) | 0;
  const m: number[][] = [];
  for (let r = 0; r < N; r++) {
    m.push([]);
    for (let c = 0; c < N; c++) m[r].push(((s * 9301 + 49297 + r * 31 + c * 7) % 233280) % 2);
  }
  return m;
};
const stampFinder = (m: number[][], r0: number, c0: number) => {
  for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) {
    const on = r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4);
    m[r0 + r][c0 + c] = on ? 1 : 0;
  }
};
const stampAlignment = (m: number[][], r0: number, c0: number) => {
  for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) {
    const on = r === 0 || r === 4 || c === 0 || c === 4 || (r === 2 && c === 2);
    m[r0 + r][c0 + c] = on ? 1 : 0;
  }
};

export const QRCode: React.FC<{ seed: string; size?: number; fg?: string; bg?: string }> = ({ seed, size = 240, fg = theme.colors.onyx, bg = "#FFFFFF" }) => {
  const matrix = useMemo(() => {
    const m = findMatrix(seed);
    stampFinder(m, 0, 0);
    stampFinder(m, 0, N - 7);
    stampFinder(m, N - 7, 0);
    stampAlignment(m, N - 9, N - 9);
    for (let i = 8; i < N - 8; i++) m[6][i] = i % 2 === 0 ? 1 : 0;
    for (let i = 8; i < N - 8; i++) m[i][6] = i % 2 === 0 ? 1 : 0;
    return m;
  }, [seed]);
  const cell = size / N;
  return (
    <div style={{ width: size, height: size, background: bg, padding: cell * 1.4, borderRadius: 16, boxShadow: theme.shadow.lift }}>
      <svg width={size - cell * 2.8} height={size - cell * 2.8} viewBox={`0 0 ${N} ${N}`}>
        {matrix.map((row, r) =>
          row.map((v, c) => (v ? <rect key={`${r}-${c}`} x={c} y={r} width={1.02} height={1.02} fill={fg} /> : null)),
        )}
      </svg>
    </div>
  );
};

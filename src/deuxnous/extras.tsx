import React, { useMemo } from "react";
import { theme } from "./theme";

const COLORS = [theme.colors.lavender, theme.colors.mint, theme.colors.amber, theme.colors.warn, theme.colors.lavenderSoft];

const PHOTO_BG = ["#FFE2D6", "#D9F0E4", "#E3DAFF", "#FFEFC0", "#FFD4D4", "#D4E8FF"];
const SHAPES_P = [
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
  (c: string) => (
    <g>
      <path d="M0 44 L26 30 L42 38 L60 22 L80 32 L80 60 L0 60 Z" fill={c} />
      <circle cx="60" cy="20" r="6" fill="#FFD76A" />
    </g>
  ),
  (c: string) => (
    <g>
      <circle cx="22" cy="22" r="4" fill={c} />
      <circle cx="40" cy="32" r="6" fill={c} opacity=".7" />
      <circle cx="58" cy="22" r="4" fill={c} />
      <path d="M0 54 Q20 48 40 54 T80 54 L80 60 L0 60 Z" fill={c} opacity=".55" />
    </g>
  ),
];

// Polaroid : cadre blanc, photo "flat" stylisée, légende
export const Polaroid: React.FC<{
  width: number;
  seed: number;
  rotation?: number;
  caption?: string;
  bg?: string;
}> = ({ width, seed, rotation = 0, caption = "Souvenir", bg }) => {
  const color = bg || PHOTO_BG[seed % PHOTO_BG.length];
  const shape = SHAPES_P[seed % SHAPES_P.length];
  const accent = COLORS[seed % COLORS.length];
  return (
    <div
      style={{
        width,
        background: "#FFFFFF",
        padding: width * 0.05,
        paddingBottom: width * 0.18,
        borderRadius: 4,
        boxShadow: theme.shadow.card,
        transform: `rotate(${rotation}deg)`,
        boxSizing: "border-box",
      }}
    >
      <svg viewBox="0 0 80 60" width="100%" style={{ display: "block", aspectRatio: "4 / 3" }}>
        <rect width="80" height="60" fill={color} />
        {shape(accent)}
      </svg>
      <div
        style={{
          fontFamily: theme.fonts.display,
          fontSize: width * 0.07,
          color: theme.colors.onyx,
          textAlign: "center",
          marginTop: width * 0.04,
        }}
      >
        {caption}
      </div>
    </div>
  );
};

const SHAPES = ["sq", "tr", "ci", "li"] as const;
type Shape = (typeof SHAPES)[number];

// Confettis : chaque particule est positionnée par frame (pilotage déterministe)
// au lieu de CSS keyframes (plus fiable dans un export Remotion/Chrome).
export const Confetti: React.FC<{ count?: number; seed?: number; active?: boolean; width?: number; height?: number; frame?: number }> = ({
  count = 70,
  seed = 1,
  active = true,
  width = 1920,
  height = 1080,
  frame = 0,
}) => {
  const parts = useMemo(() => {
    const arr: { x: number; delay: number; dur: number; rot: number; color: string; shape: Shape; size: number }[] = [];
    let s = seed;
    const rnd = () => {
      s = (s * 16807) % 2147483647;
      return s / 2147483647;
    };
    for (let i = 0; i < count; i++) {
      arr.push({
        x: rnd() * width,
        delay: rnd() * 60, // frames avant démarrage
        dur: 60 + rnd() * 90, // durée de chute en frames
        rot: (rnd() - 0.5) * 720,
        color: COLORS[Math.floor(rnd() * COLORS.length)],
        shape: SHAPES[Math.floor(rnd() * SHAPES.length)],
        size: 12 + rnd() * 8,
      });
    }
    return arr;
  }, [count, seed, width]);

  if (!active) return null;

  return (
    <>
      {parts.map((p, i) => {
        const local = frame - p.delay;
        if (local < 0) return null;
        const t = (local % (p.dur * 2)) / p.dur; // cycle 0..2 pour boucler
        const progress = t > 1 ? 2 - t : t; // monte puis redescend (0..1..0)
        const y = -40 + progress * (height + 80);
        const rot = p.rot * progress;
        const opacity = progress < 0.1 ? progress * 10 : progress > 0.9 ? (1 - progress) * 10 : 1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x,
              top: 0,
              transform: `translateY(${y}px) rotate(${rot}deg)`,
              opacity,
              width: p.size,
              height: p.size,
            }}
          >
            <ShapeBox shape={p.shape} color={p.color} size={p.size} />
          </div>
        );
      })}
    </>
  );
};

const ShapeBox: React.FC<{ shape: Shape; color: string; size: number }> = ({ shape, color, size }) => {
  if (shape === "sq") return <div style={{ width: size, height: size, background: color, borderRadius: 2 }} />;
  if (shape === "tr") {
    return (
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: `${size / 2}px solid transparent`,
          borderRight: `${size / 2}px solid transparent`,
          borderBottom: `${(size * 0.85).toFixed(0)}px solid ${color}`,
        }}
      />
    );
  }
  if (shape === "ci") return <div style={{ width: size, height: size, background: color, borderRadius: "50%" }} />;
  return <div style={{ width: size * 1.2, height: size * 0.3, background: color, borderRadius: 2 }} />;
};

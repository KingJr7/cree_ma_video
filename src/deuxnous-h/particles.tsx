import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";

// Particules losanges / cercles / croix en menthe/cyan, 10% opacité, rotation lente.
export const BackgroundParticles: React.FC<{
  count?: number;
  seed?: number;
  width?: number;
  height?: number;
}> = ({ count = 18, seed = 11, width = 1920, height = 1080 }) => {
  const parts = useMemo(() => {
    const arr: { x: number; y: number; size: number; rot: number; speed: number; shape: "rhombus" | "circle" | "cross"; color: string }[] = [];
    let s = seed;
    const rnd = () => {
      s = (s * 16807) % 2147483647;
      return s / 2147483647;
    };
    const palette = ["#1DD3B0", "#7FFFE0", "#FFFFFF"];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: rnd() * width,
        y: rnd() * height,
        size: 20 + rnd() * 60,
        rot: rnd() * 360,
        speed: 0.05 + rnd() * 0.1,
        shape: (["rhombus", "circle", "cross"] as const)[Math.floor(rnd() * 3)],
        color: palette[Math.floor(rnd() * palette.length)],
      });
    }
    return arr;
  }, [count, seed, width, height]);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {parts.map((p, i) => (
        <Particle key={i} p={p} />
      ))}
    </div>
  );
};

const Particle: React.FC<{ p: { x: number; y: number; size: number; rot: number; speed: number; shape: "rhombus" | "circle" | "cross"; color: string } }> = ({ p }) => {
  const frame = useCurrentFrame();
  const angle = p.rot + frame * p.speed;
  return (
    <div
      style={{
        position: "absolute",
        left: p.x,
        top: p.y,
        width: p.size,
        height: p.size,
        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
        opacity: 0.1,
      }}
    >
      {p.shape === "rhombus" ? (
        <div style={{ width: "100%", height: "100%", background: p.color, transform: "rotate(45deg)", borderRadius: 4 }} />
      ) : p.shape === "circle" ? (
        <div style={{ width: "100%", height: "100%", background: p.color, borderRadius: "50%" }} />
      ) : (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <rect x="44" y="0" width="12" height="100" fill={p.color} />
          <rect x="0" y="44" width="100" height="12" fill={p.color} />
        </svg>
      )}
    </div>
  );
};

import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

// Particules losanges (ou ronds) blancs 10% opacité, rotation lente continue.
// 15 particules dispersées sur le canvas vertical 1080x1920.
export const BackgroundParticles: React.FC<{
  count?: number;
  seed?: number;
  width?: number;
  height?: number;
}> = ({ count = 18, seed = 7, width = 1080, height = 1920 }) => {
  const parts = useMemo(() => {
    const arr: { x: number; y: number; size: number; rot: number; speed: number; shape: "rhombus" | "circle" | "cross" }[] = [];
    let s = seed;
    const rnd = () => {
      s = (s * 16807) % 2147483647;
      return s / 2147483647;
    };
    for (let i = 0; i < count; i++) {
      arr.push({
        x: rnd() * width,
        y: rnd() * height,
        size: 20 + rnd() * 50,
        rot: rnd() * 360,
        speed: 0.05 + rnd() * 0.1, // deg/frame — très lent
        shape: (["rhombus", "circle", "cross"] as const)[Math.floor(rnd() * 3)],
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

const Particle: React.FC<{ p: { x: number; y: number; size: number; rot: number; speed: number; shape: "rhombus" | "circle" | "cross" } }> = ({ p }) => {
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
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#FFFFFF",
            transform: "rotate(45deg)",
            borderRadius: 4,
          }}
        />
      ) : p.shape === "circle" ? (
        <div style={{ width: "100%", height: "100%", background: "#FFFFFF", borderRadius: "50%" }} />
      ) : (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <rect x="44" y="0" width="12" height="100" fill="#FFFFFF" />
          <rect x="0" y="44" width="100" height="12" fill="#FFFFFF" />
        </svg>
      )}
    </div>
  );
};

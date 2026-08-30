// Mibeko v2 — sticker carré à coins arrondis au centre : photo OU vidéo Pexels.
// Entrée : zoom ressort (scale 0.7→1, spring). Sortie : cut direct.
import React from "react";
import { Img, OffthreadVideo, staticFile, spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { type Media } from "./data";

const TILE = 460; // largeur ~43% de 1080

export const MediaTile: React.FC<{ m: Media; centerY: number }> = ({ m, centerY }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - m.from, fps, config: { damping: 13, stiffness: 200, mass: 0.7 } });
  const scale = interpolate(enter, [0, 1], [0.7, 1]);

  // masqué avant `from`, sortie cut direct sur les ~6 dernières frames
  const shown = frame >= m.from ? 1 : 0;
  const exitP = interpolate(frame, [m.to - 6, m.to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // léger zoom lent permanent (motion design) quand le média est affiché
  const slow = 1 + Math.sin(frame / 40) * 0.02;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: centerY,
        width: TILE,
        height: TILE,
        transform: `translate(-50%, -50%) scale(${scale * slow})`,
        borderRadius: 48,
        overflow: "hidden",
        background: "#E9E9EC",
        boxShadow: "0 30px 60px rgba(0,0,0,0.35)",
        opacity: shown * (1 - exitP),
        zIndex: 1,
      }}
    >
      <Inner kind={m.kind} src={m.src} />
    </div>
  );
};

const Inner: React.FC<{ kind: "img" | "vid"; src: string }> = ({ kind, src }) => {
  if (kind === "img") {
    return (
      <Img
        src={staticFile(src)}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.06)" }}
      />
    );
  }
  return (
    <OffthreadVideo
      src={staticFile(src)}
      muted
      style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.06)" }}
    />
  );
};

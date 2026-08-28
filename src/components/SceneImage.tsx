import React from "react";
import { Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { interpolate } from "remotion";
import { theme } from "../theme";

// Couche asset : image Pexels en Ken Burns (scale 1 => 1.08 + pan léger),
// assombrie pour la lisibilité, derrière les captions.
export const SceneImage: React.FC<{
  src: string;
  zoomTo?: number;
  panY?: number; // px, sens du pan
}> = ({ src, zoomTo = 1.08, panY = -30 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const ease = interpolate(frame, [0, durationInFrames], [0, 1], {
    easing: (x: number) => 1 - Math.pow(1 - x, 3),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = 1 + (zoomTo - 1) * ease;
  const pan = interpolate(ease, [0, 1], [0, panY]);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translateY(${pan}px)`,
        }}
      />
      {/* assombrissement sélectif pour les captions + famille de teinte */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, ${theme.colors.bg}E6 0%, ${theme.colors.bg}55 32%, ${theme.colors.bg}33 60%, ${theme.colors.bg}DB 100%)`,
        }}
      />
    </div>
  );
};

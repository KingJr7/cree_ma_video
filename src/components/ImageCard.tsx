import React from "react";
import { Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";
import { theme } from "../theme";

// Carte arrondie contenant l'illustration Pexels.
// Entrée : slide-up + scale (bouncy). Respire. Sortie : slide-down rapide.
// Bord "liquid glass" (1px inner + ombre teintée). Ken Burns à l'intérieur.
export const ImageCard: React.FC<{
  src: string;
  duration: number; // frame absolue de fin (pour la sortie)
  from: number; // frame absolue où la carte apparaît
  zoom?: number;
  side?: -1 | 1; // décalage horizontal asymétrique (chevauchement)
  lift?: number; // décalage vertical négatif (px)
}> = ({ src, duration, from, zoom = 1.1, side = 1, lift = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // entrée
  const enter = spring({
    frame: frame - from,
    fps,
    config: theme.spring.bouncy,
  });
  const enterY = interpolate(enter, [0, 1], [150, 0]);
  const enterX = interpolate(enter, [0, 1], [90 * side, 0]);
  const enterScale = interpolate(enter, [0, 1], [0.86, 1]);

  // respiration
  const breathe = 1 + Math.sin(frame / 30) * 0.012;

  // sortie (sur les ~14 dernières frames)
  const exitP = interpolate(frame, [duration - 14, duration - 4], [0, 1], {
    easing: Easing.in(Easing.bezier(0.7, 0, 0.84, 0)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitY = interpolate(exitP, [0, 1], [0, -110]);
  const exitO = interpolate(exitP, [0, 1], [1, 0]);

  // Ken Burns dans la carte (sur toute la durée de vie de la carte)
  const kb = interpolate(frame, [from, duration], [0, 1], {
    easing: Easing.inOut(Easing.bezier(0.83, 0, 0.17, 1)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const kbScale = 1 + (zoom - 1) * kb;
  const kbPan = interpolate(kb, [0, 1], [0, -26 * side]);

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "46%",
        width: 400,
        height: 520,
        marginLeft: side * 170,
        marginTop: lift,
        opacity: exitO * enter,
        transform: `translate(-50%,-50%) translate(${enterX}px, ${enterY + exitY}px) scale(${enterScale * breathe})`,
        borderRadius: 60,
        overflow: "hidden",
        border: `1px solid rgba(247,242,234,0.16)`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12), 0 40px 80px -30px rgba(0,0,0,0.75)`,
        background: theme.colors.bgAlt,
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${kbScale}) translateY(${kbPan}px)`,
        }}
      />
    </div>
  );
};

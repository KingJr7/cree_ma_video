import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { SceneImage } from "../components/SceneImage";
import { SyncedCaptions } from "../components/SyncedCaptions";

// Scene éditoriale : image Pexels (Ken Burns) + badge kicker en haut
// + captions synchronisées. Ligne de sortie plus rapide que l'entrée.
export const Scene: React.FC<{
  duration: number;
  src: string;
  kicker?: string;
  zoomTo?: number;
}> = ({ duration, src, kicker, zoomTo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: theme.spring.smooth });
  const exitO = interpolate(frame, [duration - 12, duration - 2], [1, 0], {
    easing: Easing.in(Easing.bezier(0.7, 0, 0.84, 0)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ opacity: exitO }}>
      <SceneImage src={src} zoomTo={zoomTo} />
      {kicker ? (
        <div
          style={{
            position: "absolute",
            top: 130,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            opacity: exitO,
          }}
        >
          <div
            style={{
              opacity: p,
              transform: `translateY(${interpolate(p, [0, 1], [20, 0])}px)`,
              fontFamily: theme.fonts.mono,
              fontSize: 30,
              letterSpacing: "0.28em",
              padding: "14px 30px",
              borderRadius: 999,
              background: "rgba(20,16,10,0.55)",
              border: `1px solid ${theme.colors.primary}44`,
              color: theme.colors.text,
            }}
          >
            {kicker.toUpperCase()}
          </div>
        </div>
      ) : null}
      <SyncedCaptions />
    </AbsoluteFill>
  );
};

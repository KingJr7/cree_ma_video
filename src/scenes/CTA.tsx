import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { theme } from "../theme";
import { SceneImage } from "../components/SceneImage";
import { SyncedCaptions } from "../components/SyncedCaptions";

// CTA : dernières paroles synchronisées, puis gros "Normal ou abusé ?"
// en end-card après la fin de la voix (22,2 s -> 30 s),
// et une ligne "sauvegarde" pour la boucle de re-regard.
const VO_END_S = 22.3;

export const CTA: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const endFrame = Math.round(VO_END_S * fps);
  const p = spring({
    frame: frame - endFrame,
    fps,
    config: theme.spring.smooth,
  });
  const exitO = interpolate(frame, [duration - 12, duration - 2], [1, 0], {
    easing: Easing.in(Easing.bezier(0.7, 0, 0.84, 0)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const showBig = frame >= endFrame;
  return (
    <AbsoluteFill style={{ opacity: exitO }}>
      <SceneImage src="images/handshake.jpeg" zoomTo={1.06} />

      {/* captions synchronisées pendant les dernières paroles */}
      <SyncedCaptions />

      {/* end-card après la voix */}
      {showBig ? (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 60,
            opacity: p,
            transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: theme.fonts.display,
              fontWeight: 700,
              fontSize: 148,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              color: theme.colors.text,
              textShadow: `0 0 60px ${theme.colors.glow}, 0 0 130px ${theme.colors.glow}`,
            }}
          >
            Normal
            <br />
            {"ou "}
            <span style={{ color: theme.colors.primary }}>abusé ?</span>
          </div>
          <div
            style={{
              marginTop: 44,
              fontFamily: theme.fonts.mono,
              fontSize: 30,
              letterSpacing: "0.14em",
              color: theme.colors.textDim,
            }}
          >
            SAUVEGARDE POUR LA PARTAGER
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

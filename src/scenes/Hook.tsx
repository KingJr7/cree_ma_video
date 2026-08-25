import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../theme";
import { SceneExit, WordReveal } from "../components/Motion";

export const HOOK_S = 3.0;

// Hook : le solde du compte se vide en direct — boucle ouverte.
export const Hook: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const float = Math.sin(frame / 30) * 3; // idle breathing

  // Le solde s'effondre : 1 280 € -> 37 € entre 0.4s et 2.4s
  const drain = interpolate(frame, [12, 72], [1, 0], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const balance = Math.round(1280 + (37 - 1280) * drain);
  const barW = interpolate(drain, [0, 1], [0.06, 1]);

  return (
    <SceneExit duration={duration}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 300,
          transform: `translateY(${float}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 56,
          }}
        >
          <WordReveal
            text="Ton argent disparaît chaque mois ?"
            delay={Math.round(fps * 0.15)}
            per={3}
            heroWord="disparaît"
            style={{
              fontFamily: theme.fonts.display,
              fontWeight: 700,
              fontSize: 96,
              letterSpacing: "-0.03em",
              lineHeight: 1.08,
              color: theme.colors.text,
              maxWidth: 880,
              textAlign: "center",
            }}
          />
          {/* Carte bancaire minimaliste */}
          <div
            style={{
              width: 720,
              padding: "44px 52px 40px",
              borderRadius: 36,
              background: theme.colors.bgAlt,
              border: `1px solid rgba(247, 242, 234, 0.09)`,
              boxShadow: "0 40px 90px -30px rgba(0,0,0,0.65)",
              display: "flex",
              flexDirection: "column",
              gap: 26,
            }}
          >
            <div
              style={{
                fontFamily: theme.fonts.mono,
                fontSize: 26,
                letterSpacing: "0.22em",
                color: theme.colors.textDim,
              }}
            >
              COMPTE COURANT
            </div>
            <div
              style={{
                fontFamily: theme.fonts.mono,
                fontWeight: 700,
                fontSize: 92,
                fontVariantNumeric: "tabular-nums",
                color: theme.colors.text,
              }}
            >
              {balance.toLocaleString("fr-FR")} €
            </div>
            <div
              style={{
                height: 14,
                borderRadius: 8,
                background: "rgba(247,242,234,0.07)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${barW * 100}%`,
                  borderRadius: 8,
                  background: theme.colors.primary,
                }}
              />
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </SceneExit>
  );
};

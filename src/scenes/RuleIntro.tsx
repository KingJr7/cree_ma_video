import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { SceneExit } from "../components/Motion";

export const INTRO_S = 2.0;

const PILLS = [
  { pct: "50", label: "Besoins", color: theme.colors.cream },
  { pct: "30", label: "Envies", color: theme.colors.primary },
  { pct: "20", label: "Épargne", color: theme.colors.accent },
];

// La règle annoncée : trois pastilles 50 / 30 / 20 en pop décalés.
export const RuleIntro: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <SceneExit duration={duration}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 300,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 64,
          }}
        >
          <div
            style={{
              fontFamily: theme.fonts.mono,
              fontSize: 30,
              letterSpacing: "0.3em",
              color: theme.colors.textDim,
            }}
          >
            LA RÈGLE DES PROS
          </div>
          <div style={{ display: "flex", gap: 36 }}>
            {PILLS.map((pill, i) => {
              const p = spring({
                frame: frame - Math.round(fps * 0.35) - i * 6,
                fps,
                config: theme.spring.bouncy,
              });
              return (
                <div
                  key={pill.pct}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 22,
                    opacity: p,
                    transform: `scale(${p})`,
                  }}
                >
                  <div
                    style={{
                      width: 220,
                      height: 220,
                      borderRadius: 60,
                      border: `2px solid ${pill.color}55`,
                      background: `${pill.color}14`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: theme.fonts.display,
                      fontWeight: 700,
                      fontSize: 84,
                      letterSpacing: "-0.03em",
                      color: pill.color,
                    }}
                  >
                    {pill.pct}
                  </div>
                  <div
                    style={{
                      fontFamily: theme.fonts.body,
                      fontWeight: 500,
                      fontSize: 34,
                      color: theme.colors.textDim,
                    }}
                  >
                    {pill.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </SceneExit>
  );
};

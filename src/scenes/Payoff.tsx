import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { Counter, Entrance, SceneExit } from "../components/Motion";
import { Donut } from "../components/Donut";

export const PAYOFF_S = 6.5;

const ROWS = [
  { label: "Besoins", amount: 1150, color: theme.colors.cream },
  { label: "Envies", amount: 690, color: theme.colors.primary },
  { label: "Épargne", amount: 460, color: theme.colors.accent, glow: true },
];

// Payoff : l'exemple concret sur un vrai salaire — la plus grosse anim.
export const Payoff: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const float = Math.sin(frame / 28) * 2.5;
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
            gap: 52,
            transform: `translateY(${float}px)`,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
            }}
          >
            <Entrance
              delay={4}
              style={{
                fontFamily: theme.fonts.body,
                fontWeight: 500,
                fontSize: 40,
                letterSpacing: "0.24em",
                color: theme.colors.textDim,
              }}
            >
              CONCRÈTEMENT
            </Entrance>
            <Counter
              to={2300}
              delay={10}
              suffix=" € / mois"
              prefix=""
              style={{
                fontFamily: theme.fonts.display,
                fontWeight: 700,
                fontSize: 108,
                letterSpacing: "-0.03em",
                color: theme.colors.text,
              }}
            />
          </div>

          {/* Donut complet posé, discret */}
          <Donut
            size={300}
            segments={[
              { pct: 50, color: theme.colors.cream, startPct: 0 },
              { pct: 30, color: theme.colors.primary, startPct: 50 },
              { pct: 20, color: theme.colors.accent, startPct: 80 },
            ]}
          />

          {/* Lignes séparées par des hairlines — pas de cartes */}
          <div style={{ width: 820 }}>
            {ROWS.map((row, i) => (
              <Entrance key={row.label} delay={Math.round(18 + i * 8)}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "26px 8px",
                    borderTop:
                      i === 0 ? "none" : `1px solid ${theme.colors.textDim}22`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: row.color,
                        boxShadow: row.glow
                          ? `0 0 34px ${row.color}88`
                          : undefined,
                      }}
                    />
                    <div
                      style={{
                        fontFamily: theme.fonts.body,
                        fontWeight: 500,
                        fontSize: 44,
                        color: theme.colors.text,
                      }}
                    >
                      {row.label}
                    </div>
                  </div>
                  <Counter
                    to={row.amount}
                    delay={Math.round(26 + i * 9)}
                    suffix=" €"
                    style={{
                      fontFamily: theme.fonts.mono,
                      fontWeight: 700,
                      fontSize: 56,
                      fontVariantNumeric: "tabular-nums",
                      color: theme.colors.text,
                    }}
                  />
                </div>
              </Entrance>
            ))}
          </div>

          <div
            style={{
              fontFamily: theme.fonts.body,
              fontWeight: 400,
              fontSize: 34,
              color: theme.colors.textDim,
            }}
          >
            Mets les 20 % de côté le jour de la paie.
          </div>
        </div>
      </AbsoluteFill>
    </SceneExit>
  );
};

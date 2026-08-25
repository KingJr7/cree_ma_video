import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../theme";
import { Counter, Entrance, PunchIn, SceneExit } from "../components/Motion";
import { Donut, type Segment } from "../components/Donut";

export const BEAT_S = 5.0;

export type BeatData = {
  pct: number;
  label: string;
  color: string;
  examples: string[];
};

// Un beat = un segment du donut qui se dessine + exemples en cascade.
export const Beat: React.FC<{
  duration: number;
  data: BeatData;
  laid: Segment[]; // segments déjà posés, atténués derrière
}> = ({ duration, data, laid }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const float = Math.sin(frame / 26) * 3;

  return (
    <SceneExit duration={duration}>
      <PunchIn at={6} amount={1.05}>
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
              gap: 48,
              transform: `translateY(${float}px)`,
            }}
          >
            <div
              style={{
                position: "relative",
                width: 660,
                height: 660,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Donut
                size={660}
                segments={laid}
                active={{
                  pct: data.pct,
                  color: data.color,
                  startPct: laid.reduce((acc, s) => acc + s.pct, 0),
                }}
                activeDelay={Math.round(fps * 0.4)}
                glow={data.pct === 20}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <Counter
                  to={data.pct}
                  delay={Math.round(fps * 0.4)}
                  suffix="%"
                  style={{
                    fontFamily: theme.fonts.mono,
                    fontWeight: 700,
                    fontSize: 130,
                    letterSpacing: "-0.02em",
                    color: data.color,
                  }}
                />
                <Entrance
                  delay={Math.round(fps * 0.75)}
                  style={{
                    fontFamily: theme.fonts.body,
                    fontWeight: 500,
                    fontSize: 38,
                    letterSpacing: "0.26em",
                    color: theme.colors.textDim,
                  }}
                >
                  {data.label.toUpperCase()}
                </Entrance>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 22,
                maxWidth: 880,
              }}
            >
              {data.examples.map((ex, i) => {
                const p = spring({
                  frame: frame - Math.round(fps * 1.15) - i * 5,
                  fps,
                  config: theme.spring.snappy,
                });
                return (
                  <div
                    key={ex}
                    style={{
                      opacity: p,
                      transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px)`,
                      padding: "18px 34px",
                      borderRadius: 999,
                      border: `1px solid ${theme.colors.textDim}44`,
                      background: "rgba(247,242,234,0.04)",
                      fontFamily: theme.fonts.body,
                      fontWeight: 500,
                      fontSize: 36,
                      color: theme.colors.text,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {ex}
                  </div>
                );
              })}
            </div>
          </div>
        </AbsoluteFill>
      </PunchIn>
    </SceneExit>
  );
};

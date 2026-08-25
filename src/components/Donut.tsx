import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

export type Segment = {
  pct: number; // 50 | 30 | 20
  color: string;
  startPct: number; // cumulé avant ce segment (0, 50, 80)
};

// Donut SVG : chaque segment se dessine par spring (pathLength normalisé).
export const Donut: React.FC<{
  size: number;
  segments: Segment[]; // segments déjà posés (dessinés atténués)
  active?: Segment; // segment en cours de dessin
  activeDelay?: number;
  glow?: boolean;
}> = ({ size, segments, active, activeDelay = 0, glow = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stroke = size * 0.135;

  const drawn = segments.map((s) => (
    <circle
      key={s.startPct}
      cx={size / 2}
      cy={size / 2}
      r={size / 2 - stroke / 2}
      fill="none"
      stroke={s.color}
      strokeWidth={stroke}
      strokeLinecap="butt"
      pathLength={100}
      strokeDasharray={`${s.pct} ${100 - s.pct}`}
      strokeDashoffset={-s.startPct}
      opacity={0.28}
      transform={`rotate(-90 ${size / 2} ${size / 2})`}
    />
  ));

  const activeArc =
    active !== undefined ? <ActiveArc seg={active} /> : null;

  function ActiveArc({ seg }: { seg: Segment }) {
    const p = spring({
      frame: frame - activeDelay,
      fps,
      config: theme.spring.heavy,
    });
    const pct = interpolate(p, [0, 1], [0, seg.pct], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return (
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - stroke / 2}
          fill="none"
          stroke={seg.color}
          strokeWidth={stroke * (glow ? 1.12 : 1)}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={`${Math.max(pct - 0.4, 0)} ${100 - Math.max(pct - 0.4, 0)}`}
          strokeDashoffset={-seg.startPct}
          filter={
            glow ? `drop-shadow(0 0 ${size * 0.09}px ${seg.color}66)` : undefined
          }
        />
      </g>
    );
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - stroke / 2}
        fill="none"
        stroke={theme.colors.bgAlt}
        strokeWidth={stroke}
      />
      {drawn}
      {activeArc}
    </svg>
  );
};

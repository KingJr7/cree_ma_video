import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

// Entrée premium : fade + rise + scale (jamais un fade seul).
export const Entrance: React.FC<{
  delay?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: theme.spring.smooth });
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${interpolate(p, [0, 1], [0.94, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Reveal mot à mot, stagger 3 frames.
export const WordReveal: React.FC<{
  text: string;
  delay?: number;
  per?: number;
  heroWord?: string;
  style?: React.CSSProperties;
}> = ({ text, delay = 0, per = 3, heroWord, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.26em",
        justifyContent: "center",
        ...style,
      }}
    >
      {text.split(" ").map((word, i) => {
        const p = spring({
          frame: frame - delay - i * per,
          fps,
          config: theme.spring.snappy,
        });
        const isHero = heroWord !== undefined && word === heroWord;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: p,
              transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)`,
              color: isHero ? theme.colors.primary : undefined,
              textShadow: isHero
                ? `0 0 60px ${theme.colors.glow}, 0 0 120px ${theme.colors.glow}`
                : undefined,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

// Sortie de scène — plus rapide que l'entrée (~10f vs ~20f).
export const SceneExit: React.FC<{
  duration: number;
  children: React.ReactNode;
}> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  const exitY = interpolate(frame, [duration - 12, duration - 2], [0, -42], {
    easing: theme.ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitO = interpolate(frame, [duration - 12, duration - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        opacity: exitO,
        transform: `translateY(${exitY}px)`,
      }}
    >
      {children}
    </div>
  );
};

// Compteur animé — tabular-nums anti-jitter.
export const Counter: React.FC<{
  to: number;
  delay?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  style?: React.CSSProperties;
}> = ({ to, delay = 0, decimals = 0, prefix = "", suffix = "", style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const value = interpolate(
    spring({ frame: frame - delay, fps, config: theme.spring.heavy }),
    [0, 1],
    [0, to],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {prefix}
      {value.toLocaleString("fr-FR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
};

// Pattern interrupt : punch-in zoom sur le beat.
export const PunchIn: React.FC<{
  at: number;
  amount?: number;
  children: React.ReactNode;
}> = ({ at, amount = 1.08, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - at,
    fps,
    config: { damping: 12, stiffness: 200 },
  });
  const scale = interpolate(s, [0, 1], [1, amount]);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        transform: `scale(${scale})`,
        transformOrigin: "50% 45%",
      }}
    >
      {children}
    </div>
  );
};

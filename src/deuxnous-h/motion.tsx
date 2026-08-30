import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { theme, D } from "./theme";

export const SpringPop: React.FC<{
  children: React.ReactNode;
  from: number;
  delay?: number;
  config?: "uiPop" | "bouncy" | "soft";
  scaleFrom?: number;
  style?: React.CSSProperties;
}> = ({ children, from, delay = 0, config = "uiPop", scaleFrom = 0.6, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - from - delay;
  const p = spring({ frame: local, fps, config: theme.spring[config] });
  const scale = interpolate(p, [0, 1], [scaleFrom, 1]);
  return (
    <div
      style={{
        opacity: p,
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const TextSlideFade: React.FC<{
  children: React.ReactNode;
  from: number;
  delay?: number;
  duration?: number;
  yOffset?: number;
  style?: React.CSSProperties;
}> = ({ children, from, delay = 0, duration = D.normal, yOffset = 30, style }) => {
  const frame = useCurrentFrame();
  const local = frame - from - delay;
  const t = interpolate(local, [0, duration], [0, 1], {
    easing: Easing.bezier(...theme.easing.text),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        opacity: t,
        transform: `translateY(${interpolate(t, [0, 1], [yOffset, 0])}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

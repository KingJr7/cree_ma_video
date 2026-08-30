import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { theme, D } from "./theme";

// PATTERN_01 — SpringPop
// Apparition UI (carte, bouton, modal). Scale 0.6 -> 1.0 + Opacity.
// Spring avec overshoot modéré (uiPop).
export const SpringPop: React.FC<{
  children: React.ReactNode;
  from: number; // frame de déclenchement (local à la scène)
  delay?: number; // frames supplémentaires
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

// PATTERN_02 — TextSlideFade
// Révélation typographique. TranslateY 30 -> 0 + Opacity, easing ExpoOut.
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

// PATTERN_03 — SpatialShift (caméra)
// Translate/Scale sur un container racine. Easing doux.
export const Camera: React.FC<{
  children: React.ReactNode;
  from: number;
  duration: number;
  to: { x: number; y: number; scale: number }; // cibles relatives
  fromVal?: { x: number; y: number; scale: number };
  style?: React.CSSProperties;
}> = ({ children, from, duration, to, fromVal, style }) => {
  const frame = useCurrentFrame();
  const local = frame - from;
  const t = interpolate(local, [0, duration], [0, 1], {
    easing: Easing.inOut(Easing.bezier(...theme.easing.camera)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const f = fromVal ?? { x: 0, y: 0, scale: 1 };
  const x = interpolate(t, [0, 1], [f.x, to.x]);
  const y = interpolate(t, [0, 1], [f.y, to.y]);
  const scale = interpolate(t, [0, 1], [f.scale, to.scale]);
  return (
    <div
      style={{
        transform: `translate(${x}px, ${y}px) scale(${scale})`,
        transformOrigin: "center center",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Stagger — utilitaire : pour un index donné, retourne le delay en frames
export const staggerDelay = (index: number, step = 1.7) => index * step;

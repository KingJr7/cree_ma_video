// theme.ts — single source of truth. Palette "warm premium" (argent/finance),
// adaptée du template du skill remotion-motion-graphics.
import { Easing } from "remotion";

export const theme = {
  colors: {
    bg: "#14100A",
    bgAlt: "#1E1710",
    primary: "#E8A33D", // THE hero color — max un élément par frame
    accent: "#7FB89A", // vert sauge désaturé — épargne
    cream: "#F4E9DA", // surface claire — besoins
    text: "#F7F2EA",
    textDim: "#B3A78F",
    glow: "rgba(232, 163, 61, 0.4)",
  },
  fonts: {
    display: "Space Grotesk",
    body: "Space Grotesk",
    mono: "JetBrains Mono",
  },
  // THE easing curves. Linear interdit.
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1), // easeOutExpo — entrances
    inOut: Easing.bezier(0.83, 0, 0.17, 1), // moves, Ken Burns
    in: Easing.bezier(0.7, 0, 0.84, 0), // exits only
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
    heavy: { damping: 30, stiffness: 60, mass: 1 }, // compteurs
  },
} as const;

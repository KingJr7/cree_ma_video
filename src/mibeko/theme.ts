// Mibeko — theme sobre/éditorial : noir profond + blanc cassé, accent bronze discret.
import { Easing } from "remotion";

export const theme = {
  colors: {
    bg: "#0A0A0A",
    text: "#F5F1E8", // blanc cassé
    textDim: "#BDB7A8",
    faint: "#8C8678",
    accent: "#D6B97E", // bronze/blanc cassé chaud, très retenu
    line: "rgba(245,241,232,0.14)",
  },
  fonts: {
    display: "Fraunces",
    body: "Space Grotesk",
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
  },
  spring: {
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
  },
} as const;

export const FPS = 30;
export const TOTAL_FRAMES = 948;

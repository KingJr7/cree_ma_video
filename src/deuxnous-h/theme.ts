// Deuxnous Hybrid — 16:9, fond noir + accent menthe, style Zokaly
// Combine le scénario de deuxnous-launch (6 scènes) avec le motion
// design de Zokaly (spring-only UI, cubic-bezier ExpoOut textes).
import { loadFont as loadGeist } from "@remotion/google-fonts/Geist";
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";

loadGeist();
loadSpaceGrotesk();

export const FPS = 30;

// Palette : fond NOIR + accent MENTHE
export const theme = {
  colors: {
    bg: "#0A0A12",          // noir profond
    bgSoft: "#13131F",      // cartes/bulles très légèrement plus claires
    surface: "#FFFFFF",     // UI ultra-blanche
    surfaceSoft: "#F2F0FF",
    line: "#E8E8F0",
    onyx: "#111118",
    onyxSoft: "#5A5A6B",
    text: "#FFFFFF",        // texte sur fond noir
    textDim: "#9A9AAA",
    primary: "#1DD3B0",     // menthe accent
    primarySoft: "#7FFFE0",
    primaryWash: "#D6F8F0",
    accent: "#1DD3B0",      // alias
    accentSoft: "#7FFFE0",
    warn: "#FF6B6B",
    mint: "#1DD3B0",
  },
  fonts: {
    display: "Space Grotesk", // titres
    body: "Geist",
  },
  radius: {
    sm: 14,
    md: 24,
    lg: 36,
    pill: 999,
  },
  // Springs & easings (Zokaly ref)
  spring: {
    uiPop: { mass: 1, stiffness: 150, damping: 12 },
    bouncy: { mass: 1, stiffness: 180, damping: 10 },
    soft: { mass: 1.2, stiffness: 120, damping: 16 },
  },
  easing: {
    text: [0.16, 1, 0.3, 1] as [number, number, number, number],
    camera: [0.25, 1, 0.5, 1] as [number, number, number, number],
  },
  shadow: {
    card: "0 8px 16px rgba(0,0,0,0.4), 0 2px 0 rgba(255,255,255,0.04)",
    lift: "0 20px 40px rgba(0,0,0,0.5), 0 4px 0 rgba(255,255,255,0.05)",
    hard: "0 12px 0 rgba(0,0,0,0.4)",
    glow: "0 0 40px rgba(29,211,176,0.4)",
  },
};

export const D = { fast: 6, normal: 11, slow: 16 };
export const ST = { tight: 1.2, normal: 1.7, loose: 5 };

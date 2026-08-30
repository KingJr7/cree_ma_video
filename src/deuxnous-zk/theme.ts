// Deuxnous Zokaly — High-Momentum UI Motion
// Fond lavande statique + UI ultra-blanche + spring-only.
// Motion tokens centralisés (cf. spec Zokaly).
import { loadFont as loadGeist } from "@remotion/google-fonts/Geist";
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";

loadGeist();
loadSpaceGrotesk();

export const FPS = 30;

// Palette : fond LAVANDE uniforme, UI blanche
export const theme = {
  colors: {
    bg: "#6B4EFE",          // lavande électrique (fond uniforme)
    bgSoft: "#5A3CE8",      // lavande profond (particules / ombres)
    surface: "#FFFFFF",     // cartes UI ultra-blanches
    surfaceSoft: "#F2F0FF", // fonds internes
    line: "#E8E2FF",        // bordures très claires
    onyx: "#111118",        // texte principal (sur blanc)
    onyxSoft: "#5A5A6B",
    text: "#FFFFFF",        // texte sur fond lavande
    textDim: "#C7BEFF",
    primary: "#FFFFFF",     // accent
    accent: "#FFD76A",      // doré pour CTA
    warn: "#FF6B6B",
    mint: "#1DD3B0",
  },
  fonts: {
    display: "Space Grotesk", // titres (bold, lisible)
    body: "Geist",
  },
  radius: {
    sm: 14,
    md: 24,
    lg: 36,
    pill: 999,
  },
  // Springs & easings du MASTER MOTION DESIGN SPEC (Zokaly ref)
  spring: {
    uiPop: { mass: 1, stiffness: 150, damping: 12 },     // overshoot modéré
    bouncy: { mass: 1, stiffness: 180, damping: 10 },     // overshoot fort
    soft: { mass: 1.2, stiffness: 120, damping: 16 },
  },
  easing: {
    text: [0.16, 1, 0.3, 1] as [number, number, number, number],     // Ease-Out Expo
    camera: [0.25, 1, 0.5, 1] as [number, number, number, number],   // Ease-In-Out doux
  },
  shadow: {
    card: "0 8px 16px rgba(0,0,0,0.10), 0 2px 0 rgba(17,17,24,0.06)",
    lift: "0 20px 40px rgba(0,0,0,0.15), 0 4px 0 rgba(17,17,24,0.08)",
    hard: "0 12px 0 rgba(17,17,24,0.18)",
  },
};

// Durées (en frames @ 30fps)
export const D = {
  fast: 6,    // ~200ms — micro
  normal: 11, // ~350ms — texte/UI
  slow: 16,   // ~500ms — caméra
};

// Staggers (en frames @ 30fps)
export const ST = {
  tight: 1.2,  // ~40ms — listes UI
  normal: 1.7, // ~50ms — mots
  loose: 5,    // ~150ms — titre vers UI
};

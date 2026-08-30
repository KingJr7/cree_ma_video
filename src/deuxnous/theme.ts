// Thème "Deuxnous" — Onyx & Lavande, flat néo-banque
// Couleurs imposées par le brief :
//   fond      : #FFFFFF / #F8F9FB
//   onyx      : #111118 (textes & cartes)
//   lavande   : #6B4EFE (accent / boutons)
//   menthe    : #1DD3B0 (succès / cagnottes)
//   ombres    : très nettes ou inexistantes, jamais de glassmorphism
import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadGeist } from "@remotion/google-fonts/Geist";

loadFraunces();
loadGeist();

export const theme = {
  colors: {
    bg: "#FFFFFF",
    bgAlt: "#F8F9FB",
    onyx: "#111118",
    onyxSoft: "#3A3A45",
    line: "#E8E8EE",
    lavender: "#6B4EFE",
    lavenderSoft: "#A89BFF",
    lavenderWash: "#EFEBFF",
    mint: "#1DD3B0",
    mintSoft: "#9EEED9",
    mintWash: "#D6F8F0",
    warn: "#FF6B6B",
    amber: "#F2B544",
  },
  fonts: {
    display: "Fraunces", // titres
    body: "Geist", // corps & UI
    mono: "Geist",
  },
  radius: {
    xs: 12,
    sm: 18,
    md: 28,
    lg: 40,
    pill: 999,
  },
  // Springs : high-momentum. Plus stiff, moins de damping, animations qui claquent.
  spring: {
    soft: { damping: 14, mass: 0.7, stiffness: 220 },
    smooth: { damping: 18, mass: 0.8, stiffness: 260 },
    bouncy: { damping: 10, mass: 0.7, stiffness: 320 },
    snap: { damping: 11, mass: 0.55, stiffness: 420 },
    punch: { damping: 8, mass: 0.5, stiffness: 480 },
  },
  // Ombre nette (style néo-banque), pas de glassmorphism
  shadow: {
    card: "0 2px 0 rgba(17,17,24,0.06), 0 18px 40px -20px rgba(17,17,24,0.18)",
    lift: "0 4px 0 rgba(17,17,24,0.08), 0 30px 60px -22px rgba(17,17,24,0.28)",
    hard: "0 8px 0 rgba(107,78,254,0.18)",
  },
};

export const FPS = 30;
export const msToFrame = (ms: number) => Math.round((ms / 1000) * FPS);

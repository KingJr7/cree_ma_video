import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { theme, D, ST, FPS } from "./theme";
import { SpringPop, TextSlideFade, Camera, staggerDelay } from "./motion";
import { BackgroundParticles } from "./particles";

// S1 Problème (0-7s, frames locales 0..210)
// "Tu gères ton mariage comme ça ??" en stagger mot par mot,
// puis 3 bulles WhatsApp cascade, puis 3 cartes problème (stack Z).
// Push-up final vers la scène 2.

const TITLE_WORDS = ["Tu", "gères", "ton", "mariage", "comme", "ça", "??"];

const WHATSAPP = [
  { who: "Cousine Awa", text: "C'est quelle adresse déjà ? 😅", time: "14:02" },
  { who: "Tonton Bruno", text: "Je peux venir avec 2 personnes ?", time: "14:04" },
  { who: "Sarah", text: "La salle a confirmé pour quel horaire ?", time: "14:08" },
];

const PROBLEMS = [
  { icon: "💬", title: "Messages perdus", sub: "47 conversations WhatsApp non lues" },
  { icon: "📸", title: "Photos éparpillées", sub: "Le photographe, les invités, tout est mélangé" },
  { icon: "💸", title: "Cagnottes en vrac", sub: "3 cagnottes, 4 numéros Mobile Money" },
];

export const S1Probleme: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Push-up vers le haut pour la transition (commence à 195, durée 15)
  const push = interpolate(frame, [195, 210], [0, -1080], {
    easing: Easing.in(Easing.bezier(0.55, 0, 1, 0.45)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: theme.colors.bg, transform: `translateY(${push}px)` }}>
      <BackgroundParticles count={16} />

      {/* Titre stagger */}
      <div
        style={{
          position: "absolute",
          top: 180,
          left: 0,
          right: 0,
          padding: "0 60px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "12px 18px",
          textAlign: "center",
        }}
      >
        {TITLE_WORDS.map((w, i) => (
          <TextSlideFade key={i} from={0} delay={i * ST.normal}>
            <span
              style={{
                fontFamily: theme.fonts.display,
                fontWeight: 700,
                fontSize: w === "??" ? 96 : 80,
                color: theme.colors.text,
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              {w}
            </span>
          </TextSlideFade>
        ))}
      </div>

      {/* Bulles WhatsApp — cascade stagger 60ms (= 2 frames) */}
      {WHATSAPP.map((b, i) => {
        const from = 30 + i * 8;
        const yPos = 460 + i * 130;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 60 + (i % 2) * 100,
              right: 60,
              top: yPos,
            }}
          >
            <SpringPop from={from} config="bouncy">
              <div
                style={{
                  background: theme.colors.surface,
                  borderRadius: theme.radius.lg,
                  padding: "18px 24px",
                  boxShadow: theme.shadow.lift,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      background: theme.colors.accent,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      color: theme.colors.onyx,
                      fontWeight: 800,
                    }}
                  >
                    {b.who[0]}
                  </div>
                  <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 20, color: theme.colors.onyx }}>{b.who}</div>
                  <div style={{ marginLeft: "auto", fontFamily: theme.fonts.body, fontSize: 14, color: theme.colors.onyxSoft }}>{b.time}</div>
                </div>
                <div style={{ fontFamily: theme.fonts.body, fontSize: 22, color: theme.colors.onyx, fontWeight: 500 }}>
                  {b.text}
                </div>
              </div>
            </SpringPop>
          </div>
        );
      })}

      {/* PATTERN_04 — CascadingStack : 3 cartes problème empilées */}
      {PROBLEMS.map((p, i) => {
        const from = 100 + i * 8;
        const yBase = 980 + i * 130;
        // Les éléments précédents glissent vers le haut quand un nouveau arrive
        const lift = i === 0 ? 0 : i === 1 ? (frame > 108 ? -20 : 0) : (frame > 116 ? -40 : 0);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 40 + i * 8,
              right: 40 + i * 8,
              top: yBase,
              transform: `translateY(${lift}px)`,
              transition: "transform 0.3s",
            }}
          >
            <SpringPop from={from} config="bouncy">
              <div
                style={{
                  background: theme.colors.surface,
                  borderRadius: theme.radius.lg,
                  padding: "22px 28px",
                  boxShadow: theme.shadow.lift,
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 20,
                    background: theme.colors.surfaceSoft,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 32,
                  }}
                >
                  {p.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: theme.fonts.display, fontSize: 28, fontWeight: 700, color: theme.colors.onyx, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                    {p.title}
                  </div>
                  <div style={{ fontFamily: theme.fonts.body, fontSize: 18, color: theme.colors.onyxSoft, marginTop: 4, fontWeight: 500 }}>
                    {p.sub}
                  </div>
                </div>
              </div>
            </SpringPop>
          </div>
        );
      })}

      {/* Tagline bas : "Et le jour J ?" */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 80,
          textAlign: "center",
        }}
      >
        <TextSlideFade from={160} delay={0}>
          <div
            style={{
              display: "inline-block",
              padding: "14px 32px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(8px)",
              color: theme.colors.text,
              fontFamily: theme.fonts.display,
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Et le jour J ?{" "}
            <span style={{ color: theme.colors.accent }}>Ça déborde.</span>
          </div>
        </TextSlideFade>
      </div>
    </AbsoluteFill>
  );
};

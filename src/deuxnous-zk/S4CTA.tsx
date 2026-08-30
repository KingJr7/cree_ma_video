import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { theme, ST } from "./theme";
import { SpringPop, TextSlideFade, staggerDelay } from "./motion";
import { BackgroundParticles } from "./particles";

// S4 CTA (30-39s, frames locales 0..270)
// Push-up vers le haut, wordmark "Deuxnous" en stagger,
// gros bouton CTA pulse, confettis.

const WORD = ["Passez", "au", "niveau", "supérieur."];

const CONFETTI_COLORS = [theme.colors.accent, "#FFFFFF", theme.colors.warn, theme.colors.mint];

export const S4CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Push-up : la scène entre depuis le bas (Y 1080 -> 0) sur les 15 premières frames
  const pushUp = interpolate(frame, [0, 15], [1080, 0], {
    easing: Easing.out(Easing.bezier(0.16, 1, 0.3, 1)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Bouton pulse après apparition
  const ctaP = spring({ frame: frame - 90, fps, config: theme.spring.uiPop });
  const ctaScale = interpolate(ctaP, [0, 1], [0.5, 1]) * (1 + Math.sin((frame - 90) / 12) * 0.025);

  // Confettis : particules qui tombent du haut
  const confettiCount = 40;
  const confetti = React.useMemo(() => {
    const arr: { x: number; delay: number; dur: number; rot: number; color: string; size: number }[] = [];
    let s = 99;
    const rnd = () => {
      s = (s * 16807) % 2147483647;
      return s / 2147483647;
    };
    for (let i = 0; i < confettiCount; i++) {
      arr.push({
        x: rnd() * 1080,
        delay: 30 + rnd() * 100,
        dur: 80 + rnd() * 100,
        rot: rnd() * 720,
        color: CONFETTI_COLORS[Math.floor(rnd() * CONFETTI_COLORS.length)],
        size: 12 + rnd() * 12,
      });
    }
    return arr;
  }, []);

  return (
    <AbsoluteFill style={{ background: theme.colors.bg, transform: `translateY(${pushUp}px)` }}>
      <BackgroundParticles count={20} />

      {/* Halo radial derrière le wordmark */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(50% 50% at 50% 40%, rgba(255,255,255,0.15) 0%, transparent 70%)`,
        }}
      />

      {/* Kicker */}
      <div style={{ position: "absolute", top: 280, left: 0, right: 0, textAlign: "center" }}>
        <SpringPop from={20} config="uiPop">
          <div
            style={{
              display: "inline-block",
              padding: "14px 32px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.15)",
              color: "#FFFFFF",
              fontFamily: theme.fonts.body,
              fontWeight: 700,
              fontSize: 26,
              letterSpacing: "0.04em",
            }}
          >
            Passez au niveau supérieur
          </div>
        </SpringPop>
      </div>

      {/* Wordmark "Deuxnous" en stagger */}
      <div
        style={{
          position: "absolute",
          top: 460,
          left: 0,
          right: 0,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          padding: "0 40px",
        }}
      >
        <SpringPop from={45} config="uiPop" scaleFrom={0.4}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
            <div
              style={{
                fontFamily: theme.fonts.display,
                fontSize: 220,
                color: theme.colors.text,
                fontWeight: 800,
                letterSpacing: "-0.05em",
                lineHeight: 0.9,
              }}
            >
              Deux<span style={{ color: theme.colors.accent }}>nous</span>
            </div>
            <div
              style={{
                fontFamily: theme.fonts.display,
                fontSize: 220,
                color: theme.colors.accent,
                fontWeight: 800,
                letterSpacing: "-0.05em",
                lineHeight: 0.9,
              }}
            >
              .
            </div>
          </div>
        </SpringPop>
      </div>

      {/* Sous-titre */}
      <div style={{ position: "absolute", top: 1180, left: 0, right: 0, textAlign: "center" }}>
        <TextSlideFade from={75} delay={0}>
          <div
            style={{
              fontFamily: theme.fonts.body,
              fontSize: 32,
              color: theme.colors.textDim,
              fontWeight: 500,
            }}
          >
            Un seul lien. <span style={{ color: theme.colors.text, fontWeight: 700 }}>Tout est là.</span>
          </div>
        </TextSlideFade>
      </div>

      {/* CTA — gros bouton blanc qui pulse */}
      <div
        style={{
          position: "absolute",
          top: 1280,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            transform: `scale(${ctaScale})`,
            opacity: ctaP,
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              color: theme.colors.bg,
              padding: "32px 64px",
              borderRadius: 36,
              fontFamily: theme.fonts.display,
              fontWeight: 800,
              fontSize: 36,
              letterSpacing: "-0.02em",
              boxShadow: "0 16px 0 rgba(17,17,24,0.25), 0 30px 60px rgba(0,0,0,0.3)",
            }}
          >
            Créer mon espace →
          </div>
        </div>
      </div>

      {/* URL */}
      <div style={{ position: "absolute", bottom: 200, left: 0, right: 0, textAlign: "center" }}>
        <TextSlideFade from={130} delay={0}>
          <div
            style={{
              fontFamily: theme.fonts.body,
              fontSize: 24,
              color: theme.colors.textDim,
              letterSpacing: "0.08em",
              fontWeight: 700,
            }}
          >
            deuxnous.app
          </div>
        </TextSlideFade>
      </div>

      {/* Confettis — particules plates qui tombent */}
      {confetti.map((c, i) => {
        const local = frame - c.delay;
        if (local < 0) return null;
        const t = (local % (c.dur * 2)) / c.dur;
        const progress = t > 1 ? 2 - t : t;
        const y = -40 + progress * 2100;
        const rot = c.rot * progress;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: c.x,
              top: 0,
              width: c.size,
              height: c.size,
              background: c.color,
              borderRadius: 2,
              transform: `translateY(${y}px) rotate(${rot}deg)`,
              opacity: progress < 0.1 ? progress * 10 : progress > 0.9 ? (1 - progress) * 10 : 1,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

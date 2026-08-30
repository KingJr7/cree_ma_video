import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { theme, ST } from "./theme";
import { SpringPop, TextSlideFade, staggerDelay } from "./motion";
import { BackgroundParticles } from "./particles";

// S3 Features (15-30s, frames locales 0..450)
// Continuous Pan : un canvas 1080x3840 défile vers le haut, chaque
// feature passe au centre et déclenche ses satellites (badges / paiements).

const CANVAS_H = 3840;

const FEATURES = [
  {
    title: "Invitations",
    sub: "QR + lien, RSVP en 1 tap",
    color: theme.colors.bg,
    accent: theme.colors.accent,
    sats: ["Lien unique", "QR Code", "RSVP 1-tap", "Billet VIP"],
  },
  {
    title: "Cagnotte",
    sub: "Mobile Money, Wave, cash",
    color: theme.colors.mint,
    accent: "#0FA88A",
    sats: ["Orange Money", "Wave", "MTN MoMo", "Suivi en direct"],
  },
  {
    title: "Album",
    sub: "Tous les invités publient en direct",
    color: theme.colors.bg,
    accent: theme.colors.accent,
    sats: ["Polaroids", "Upload live", "Galerie IA", "Stories mariage"],
  },
  {
    title: "Livre d'or",
    sub: "Vidéos, messages, photos souvenirs",
    color: theme.colors.warn,
    accent: "#E14F4F",
    sats: ["Vidéos", "Textes", "Audio", "QR de vœux"],
  },
];

export const S3Features: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Caméra : translateY continu de 0 vers -1920 (un écran de haut)
  // + léger zoom 1.05 -> 1 pour donner du punch
  const camY = interpolate(frame, [0, 450], [80, -2680], {
    easing: Easing.inOut(Easing.bezier(0.55, 0.05, 0.45, 0.95)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      <BackgroundParticles count={20} />

      {/* Header collé à la caméra (translate avec le canvas) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 120,
          padding: "0 60px",
          textAlign: "center",
          zIndex: 3,
        }}
      >
        <TextSlideFade from={0} delay={0}>
          <div
            style={{
              fontFamily: theme.fonts.body,
              fontSize: 24,
              color: theme.colors.textDim,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Fonctionnalités
          </div>
        </TextSlideFade>
      </div>

      {/* Canvas géant qui défile */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: CANVAS_H,
          transform: `translateY(${camY}px)`,
        }}
      >
        {FEATURES.map((f, i) => {
          // Position verticale de chaque feature
          const y = 380 + i * 800;
          // Active frame : quand la feature est centrée
          // Centre = (CANVAS_H/2 = 1920) = -camY + y
          // => 1920 = y - camY => camY = y - 1920
          // camY(0..450) = 80..-2680
          // activeQuand: camY ≈ y - 1920
          // y = 380: camY = -1540, soit frame ≈ ?
          // camY(frame) = 80 + (-2760) * t, t=frame/450
          // -1540 = 80 - 2760*t => t = 1620/2760 = 0.587, frame = 264
          // -> on calcule la frame "active" par feature :
          const activeFrame = Math.round(((y - 1920 - 80) / -2760) * 450) + 450; // approx
          const satBase = activeFrame - 30; // les satellites démarrent 30 frames avant que la feature soit centrée

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 60,
                right: 60,
                top: y,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 28,
              }}
            >
              {/* Titre feature */}
              <SpringPop from={satBase} config="uiPop">
                <div
                  style={{
                    background: theme.colors.surface,
                    color: theme.colors.onyx,
                    padding: "32px 56px",
                    borderRadius: 36,
                    boxShadow: theme.shadow.lift,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      fontFamily: theme.fonts.body,
                      fontSize: 22,
                      color: f.accent,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      fontWeight: 800,
                    }}
                  >
                    0{i + 1}
                  </div>
                  <div
                    style={{
                      fontFamily: theme.fonts.display,
                      fontSize: 88,
                      color: theme.colors.onyx,
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                    }}
                  >
                    {f.title}
                  </div>
                  <div
                    style={{
                      fontFamily: theme.fonts.body,
                      fontSize: 24,
                      color: theme.colors.onyxSoft,
                      fontWeight: 500,
                    }}
                  >
                    {f.sub}
                  </div>
                </div>
              </SpringPop>

              {/* Satellites — badges qui pop à côté */}
              <div
                style={{
                  display: "flex",
                  gap: 14,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {f.sats.map((s, j) => (
                  <SpringPop key={j} from={satBase + 12 + j * ST.normal} config="bouncy" scaleFrom={0.5}>
                    <div
                      style={{
                        background: theme.colors.surface,
                        color: theme.colors.onyx,
                        padding: "16px 24px",
                        borderRadius: 999,
                        fontFamily: theme.fonts.body,
                        fontSize: 22,
                        fontWeight: 700,
                        boxShadow: theme.shadow.card,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          background: f.accent,
                        }}
                      />
                      {s}
                    </div>
                  </SpringPop>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Scroll indicator (à droite) — suit l'écran, indique où on en est */}
      <div
        style={{
          position: "absolute",
          right: 24,
          top: 360,
          bottom: 360,
          width: 4,
          background: "rgba(255,255,255,0.2)",
          borderRadius: 2,
          zIndex: 5,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: `${(frame / 450) * 100}%`,
            width: 4,
            height: 60,
            background: "#FFFFFF",
            borderRadius: 2,
            transform: "translateY(-50%)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

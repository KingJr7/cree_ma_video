import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { theme, D, ST } from "./theme";
import { SpringPop, TextSlideFade, Camera } from "./motion";
import { BackgroundParticles } from "./particles";

// S2 Solution (7-15s, frames locales 0..240)
// Logo "Deuxnous" en haut (pop + stagger), téléphone entre du bas
// (Y 100% -> 0), cascade UI à l'intérieur (header, banner, stats, CTA).

const PHONE_W = 720;
const PHONE_H = 1480;

const HeaderLogo: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="0 0 200 200" width={size} height={size}>
    <circle cx="100" cy="100" r="92" fill="#FFFFFF" />
    <path
      d="M100 158 C 64 130, 36 110, 36 78 C 36 58, 52 44, 72 44 C 86 44, 96 52, 100 60 C 104 52, 114 44, 128 44 C 148 44, 164 58, 164 78 C 164 110, 136 130, 100 158 Z"
      fill="#6B4EFE"
    />
  </svg>
);

export const S2Solution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Push-down : la scène entre depuis le haut (Y -1080 -> 0) sur les 15 premières frames
  const pushDown = interpolate(frame, [0, 15], [-1080, 0], {
    easing: Easing.out(Easing.bezier(0.16, 1, 0.3, 1)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Téléphone entre depuis le bas (Y 100% -> 0)
  const phoneP = spring({ frame: frame - 25, fps, config: theme.spring.bouncy });
  const phoneY = interpolate(phoneP, [0, 1], [200, 0]);

  return (
    <AbsoluteFill style={{ background: theme.colors.bg, transform: `translateY(${pushDown}px)` }}>
      <BackgroundParticles count={14} />

      {/* Logo + Wordmark en haut */}
      <div
        style={{
          position: "absolute",
          top: 160,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
        }}
      >
        <SpringPop from={6} config="uiPop">
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <HeaderLogo size={72} />
            <div style={{ fontFamily: theme.fonts.display, fontSize: 64, fontWeight: 800, color: theme.colors.text, letterSpacing: "-0.04em" }}>
              Deux<span style={{ color: theme.colors.accent }}>nous</span>
            </div>
          </div>
        </SpringPop>
        <TextSlideFade from={14} delay={0}>
          <div
            style={{
              fontFamily: theme.fonts.body,
              fontSize: 26,
              color: theme.colors.textDim,
              letterSpacing: "0.04em",
              fontWeight: 600,
            }}
          >
            Un seul lien. Tout est là.
          </div>
        </TextSlideFade>
      </div>

      {/* Téléphone centré, entre du bas */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 360,
          transform: `translate(-50%, 0) translateY(${phoneY}px)`,
          opacity: phoneP,
        }}
      >
        <div
          style={{
            width: PHONE_W,
            height: PHONE_H,
            background: theme.colors.onyx,
            borderRadius: 80,
            padding: 14,
            boxShadow: "0 40px 80px rgba(0,0,0,0.3)",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background: theme.colors.surfaceSoft,
              borderRadius: 68,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Encoche */}
            <div
              style={{
                position: "absolute",
                top: 14,
                left: "50%",
                transform: "translateX(-50%)",
                width: 220,
                height: 28,
                background: theme.colors.onyx,
                borderRadius: 16,
                zIndex: 5,
              }}
            />

            {/* Status bar minimaliste */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 56,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 56px",
                fontFamily: theme.fonts.body,
                fontSize: 18,
                fontWeight: 700,
                color: theme.colors.onyx,
                zIndex: 4,
              }}
            >
              <span>9:41</span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
                  <span style={{ width: 4, height: 5, background: theme.colors.onyx, borderRadius: 1 }} />
                  <span style={{ width: 4, height: 8, background: theme.colors.onyx, borderRadius: 1 }} />
                  <span style={{ width: 4, height: 11, background: theme.colors.onyx, borderRadius: 1 }} />
                  <span style={{ width: 4, height: 14, background: theme.colors.onyx, borderRadius: 1 }} />
                </span>
              </span>
            </div>

            {/* Contenu UI — cascade d'apparitions (Parent First, Children Second) */}
            <div style={{ position: "absolute", inset: 0, paddingTop: 70, padding: "70px 36px 0" }}>
              {/* Header : logo + Jean & Sarah */}
              <SpringPop from={50} config="uiPop">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      background: theme.colors.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <HeaderLogo size={32} />
                  </div>
                  <div>
                    <div style={{ fontFamily: theme.fonts.body, fontSize: 14, color: theme.colors.onyxSoft, fontWeight: 600 }}>Bonjour</div>
                    <div style={{ fontFamily: theme.fonts.display, fontSize: 22, fontWeight: 700, color: theme.colors.onyx, lineHeight: 1 }}>
                      Jean & Sarah
                    </div>
                  </div>
                </div>
              </SpringPop>

              {/* Bannière succès */}
              <div style={{ marginTop: 20 }}>
                <SpringPop from={62} config="uiPop">
                  <div
                    style={{
                      background: theme.colors.surface,
                      borderRadius: 22,
                      padding: "16px 20px",
                      boxShadow: theme.shadow.card,
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        background: theme.colors.mint,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#FFFFFF",
                        fontWeight: 800,
                        fontSize: 20,
                      }}
                    >
                      ✓
                    </div>
                    <div style={{ fontFamily: theme.fonts.body, fontSize: 17, color: theme.colors.onyx, fontWeight: 700 }}>
                      Tout est au même endroit.
                    </div>
                  </div>
                </SpringPop>
              </div>

              {/* Stats 2x2 */}
              <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { l: "Invités", v: "128", c: theme.colors.bg, s: "confirmés" },
                  { l: "Cagnotte", v: "215k", c: theme.colors.mint, s: "FCFA" },
                  { l: "Photos", v: "342", c: "#A89BFF", s: "album" },
                  { l: "Restant", v: "14 j", c: theme.colors.warn, s: "avant le Jour J" },
                ].map((s, i) => (
                  <SpringPop key={i} from={74 + i * 5} config="uiPop">
                    <div
                      style={{
                        background: theme.colors.surface,
                        borderRadius: 22,
                        padding: "16px 18px",
                        boxShadow: theme.shadow.card,
                      }}
                    >
                      <div style={{ fontFamily: theme.fonts.body, fontSize: 12, color: theme.colors.onyxSoft, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}>
                        {s.l}
                      </div>
                      <div style={{ fontFamily: theme.fonts.display, fontSize: 38, color: s.c, fontWeight: 700, marginTop: 4, letterSpacing: "-0.02em" }}>
                        {s.v}
                      </div>
                      <div style={{ fontFamily: theme.fonts.body, fontSize: 13, color: theme.colors.onyxSoft, fontWeight: 500 }}>{s.s}</div>
                    </div>
                  </SpringPop>
                ))}
              </div>

              {/* Bouton CTA dashboard */}
              <div style={{ marginTop: 18 }}>
                <SpringPop from={100} config="uiPop">
                  <div
                    style={{
                      background: theme.colors.bg,
                      color: "#FFFFFF",
                      borderRadius: 32,
                      padding: "20px 24px",
                      fontFamily: theme.fonts.body,
                      fontWeight: 800,
                      fontSize: 22,
                      textAlign: "center",
                      boxShadow: theme.shadow.hard,
                    }}
                  >
                    Ouvrir le tableau de bord →
                  </div>
                </SpringPop>
              </div>

              {/* QR + lien */}
              <div style={{ marginTop: 18 }}>
                <SpringPop from={115} config="uiPop">
                  <div
                    style={{
                      background: theme.colors.surface,
                      borderRadius: 22,
                      padding: "16px 20px",
                      boxShadow: theme.shadow.card,
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: 12,
                        background: "#FFFFFF",
                        display: "grid",
                        gridTemplateColumns: "repeat(8, 1fr)",
                        padding: 6,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      }}
                    >
                      {Array.from({ length: 64 }).map((_, i) => (
                        <div
                          key={i}
                          style={{
                            background: ((i * 9301 + 7) % 7) > 3 ? theme.colors.onyx : "transparent",
                            borderRadius: 1,
                          }}
                        />
                      ))}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: theme.fonts.body, fontSize: 11, color: theme.colors.onyxSoft, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>
                        À partager
                      </div>
                      <div style={{ fontFamily: theme.fonts.body, fontSize: 16, color: theme.colors.onyx, fontWeight: 700, marginTop: 2 }}>
                        deuxnous.app/jean-sarah
                      </div>
                    </div>
                  </div>
                </SpringPop>
              </div>

              {/* Bottom bar */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 110,
                  background: theme.colors.surface,
                  borderTop: `1px solid ${theme.colors.line}`,
                  borderRadius: "0 0 68px 68px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  padding: "0 24px",
                }}
              >
                {[
                  { l: "Accueil", a: true },
                  { l: "Galerie", a: false },
                  { l: "Cagnotte", a: false },
                  { l: "Profil", a: false },
                ].map((it, i) => (
                  <SpringPop key={i} from={125 + i * 3} config="uiPop" scaleFrom={0.5}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                        color: it.a ? theme.colors.bg : theme.colors.onyxSoft,
                      }}
                    >
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 8,
                          background: it.a ? theme.colors.bg : theme.colors.onyxSoft,
                        }}
                      />
                      <span style={{ fontFamily: theme.fonts.body, fontSize: 13, fontWeight: 700 }}>{it.l}</span>
                    </div>
                  </SpringPop>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

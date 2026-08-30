import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { theme } from "./theme";
import { PhoneFrame } from "./PhoneFrame";
import { AppCard, AppBottomBar, OnyxButton } from "./ui";
import { CheckIcon, HeartIcon } from "./icons";
import { Logo } from "./Logo";
import { Confetti } from "./extras";

// S5 — L'Outro (35 à 40s, frames locales 0..150)
// Layout : "Deuxnous." géant à gauche, téléphone à droite, tagline+CTA en bas.

const PHONE_W = 340;
const PHONE_H = 720;

export const S5Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneP = spring({ frame, fps, config: theme.spring.punch });
  const tagP = spring({ frame: frame - 30, fps, config: theme.spring.snap });
  const titleP = spring({ frame: frame - 6, fps, config: theme.spring.punch });
  const ctaP = spring({ frame: frame - 60, fps, config: theme.spring.punch });
  const kickerP = spring({ frame: frame - 14, fps, config: theme.spring.snap });

  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      {/* Halo lavande très doux en arrière-plan */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(60% 50% at 50% 45%, ${theme.colors.lavenderWash} 0%, transparent 70%)`,
        }}
      />

      <Confetti count={100} seed={42} active={frame > 10} frame={frame} width={1920} height={1080} />

      {/* Téléphone à droite avec dashboard */}
      <div
        style={{
          position: "absolute",
          right: 110,
          top: 120,
          transform: `scale(${interpolate(phoneP, [0, 1], [0.85, 1])})`,
          opacity: phoneP,
        }}
      >
        <PhoneFrame width={PHONE_W} height={PHONE_H}>
          <div style={{ position: "absolute", inset: 0, paddingTop: 50, paddingBottom: 0, boxSizing: "border-box" }}>
            {/* Header */}
            <div style={{ padding: `14px ${PHONE_W * 0.06}px`, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ transform: "scale(0.16)", transformOrigin: "left center" }}>
                <Logo size={PHONE_W} />
              </div>
              <div style={{ fontFamily: theme.fonts.display, fontSize: 22, color: theme.colors.onyx, fontWeight: 700, marginLeft: -10 }}>
                Deux<span style={{ color: theme.colors.lavender }}>nous</span>
              </div>
            </div>

            {/* Banner succès */}
            <div style={{ padding: `0 ${PHONE_W * 0.06}px` }}>
              <AppCard width={PHONE_W - PHONE_W * 0.12} pad={14} radius={18} bg={theme.colors.mintWash} shadow="none">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <CheckIcon size={22} />
                  <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 14, color: theme.colors.onyx, lineHeight: 1.2 }}>
                    Tout est prêt. Le grand jour approche.
                  </div>
                </div>
              </AppCard>
            </div>

            {/* Stats */}
            <div style={{ padding: `18px ${PHONE_W * 0.06}px`, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Stat label="Invités" value="128" sub="confirmés" />
              <Stat label="Cagnotte" value="215k" sub="FCFA" color={theme.colors.mint} />
              <Stat label="Photos" value="342" sub="album" color={theme.colors.lavender} />
              <Stat label="Restant" value="14 j" sub="avant le Jour J" color={theme.colors.warn} />
            </div>

            {/* Action */}
            <div style={{ padding: `0 ${PHONE_W * 0.06}px` }}>
              <OnyxButton width={PHONE_W - PHONE_W * 0.12} height={52} style={{ fontSize: 16 }}>
                Ouvrir le tableau de bord
              </OnyxButton>
            </div>

            {/* QR compact */}
            <div style={{ padding: `16px ${PHONE_W * 0.06}px`, display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 14,
                  background: "#FFFFFF",
                  display: "grid",
                  gridTemplateColumns: "repeat(8, 1fr)",
                  padding: 6,
                  boxShadow: theme.shadow.card,
                }}
              >
                {Array.from({ length: 64 }).map((_, i) => {
                  const v = ((i * 9301 + 7) % 7) > 3 ? 1 : 0;
                  return <div key={i} style={{ background: v ? theme.colors.onyx : "transparent", borderRadius: 1 }} />;
                })}
              </div>
              <div>
                <div style={{ fontFamily: theme.fonts.body, fontSize: 11, color: theme.colors.onyxSoft, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>
                  À partager
                </div>
                <div style={{ fontFamily: theme.fonts.body, fontSize: 14, color: theme.colors.onyx, fontWeight: 700, marginTop: 2 }}>
                  deuxnous.app/mariage/jean-sarah
                </div>
              </div>
            </div>

            <AppBottomBar active="home" width={PHONE_W} />
          </div>
        </PhoneFrame>
      </div>

      {/* Bloc gauche — kicker + wordmark géant */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 240,
          maxWidth: 900,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 26px",
            borderRadius: 999,
            background: theme.colors.lavenderWash,
            color: theme.colors.lavender,
            fontFamily: theme.fonts.body,
            fontWeight: 800,
            fontSize: 26,
            marginBottom: 24,
            opacity: kickerP,
            transform: `translateY(${interpolate(kickerP, [0, 1], [20, 0])}px)`,
          }}
        >
          Passez au niveau supérieur
        </div>
        <div
          style={{
            fontFamily: theme.fonts.display,
            fontSize: 200,
            color: theme.colors.onyx,
            lineHeight: 0.9,
            letterSpacing: "-0.05em",
            fontWeight: 700,
            opacity: titleP,
            transform: `scale(${interpolate(titleP, [0, 1], [0.85, 1])}) translateY(${interpolate(titleP, [0, 1], [30, 0])}px)`,
            transformOrigin: "left center",
          }}
        >
          Deux<span style={{ color: theme.colors.lavender }}>nous</span>
          <span style={{ color: theme.colors.lavender }}>.</span>
        </div>
      </div>

      {/* Bloc bas — tagline offre + chips + bouton — full width */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 50,
          textAlign: "center",
          opacity: tagP,
          transform: `translateY(${interpolate(tagP, [0, 1], [20, 0])}px)`,
        }}
      >
        <div style={{ display: "flex", gap: 14, justifyContent: "center", alignItems: "center", flexWrap: "wrap", padding: "0 80px" }}>
          {["Lien unique", "QR Code", "Livre d'or", "Cagnotte", "Album"].map((t) => (
            <div
              key={t}
              style={{
                padding: "12px 22px",
                borderRadius: 999,
                background: "#FFFFFF",
                color: theme.colors.onyx,
                fontFamily: theme.fonts.body,
                fontWeight: 700,
                fontSize: 20,
                boxShadow: theme.shadow.card,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <CheckIcon size={20} />
              {t}
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 18,
            display: "inline-flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <div style={{ fontFamily: theme.fonts.body, fontSize: 24, color: theme.colors.onyxSoft, fontWeight: 500 }}>
            Une seule offre, <span style={{ color: theme.colors.lavender, fontWeight: 800 }}>tout inclus.</span>
          </div>
        </div>
        <div
          style={{
            marginTop: 16,
            display: "inline-block",
            transform: `scale(${interpolate(ctaP, [0, 1], [0.85, 1])})`,
            opacity: ctaP,
          }}
        >
          <OnyxButton width={320} height={72} style={{ fontSize: 24, fontWeight: 800 }}>
            Créer mon espace
          </OnyxButton>
        </div>
        <div style={{ fontFamily: theme.fonts.mono, fontSize: 16, color: theme.colors.onyxSoft, marginTop: 10, letterSpacing: "0.06em" }}>
          deuxnous.app
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Stat: React.FC<{ label: string; value: string; sub: string; color?: string }> = ({ label, value, sub, color = theme.colors.onyx }) => (
  <div style={{ background: theme.colors.bgAlt, borderRadius: 18, padding: 14 }}>
    <div style={{ fontFamily: theme.fonts.body, fontSize: 12, color: theme.colors.onyxSoft, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700 }}>
      {label}
    </div>
    <div style={{ fontFamily: theme.fonts.display, fontSize: 32, color, fontWeight: 700, marginTop: 4, letterSpacing: "-0.02em" }}>
      {value}
    </div>
    <div style={{ fontFamily: theme.fonts.body, fontSize: 13, color: theme.colors.onyxSoft, fontWeight: 500 }}>{sub}</div>
  </div>
);

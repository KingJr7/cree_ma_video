import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { theme } from "./theme";
import { PhoneFrame } from "./PhoneFrame";
import { AppCard, AppBottomBar, OnyxButton } from "./ui";
import { CheckIcon, HeartIcon } from "./icons";
import { Logo, Wordmark } from "./Logo";
import { Confetti } from "./extras";

// S5 — L'Outro (35 à 40s, frames locales 0..150)
// Dashboard parfait entouré de confettis, "Passez au niveau supérieur.
// Deuxnous." + tagline d'offre.

const PHONE_W = 360;
const PHONE_H = 720;

export const S5Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneP = spring({ frame, fps, config: theme.spring.bouncy });
  const tagP = spring({ frame: frame - 30, fps, config: theme.spring.smooth });
  const titleP = spring({ frame: frame - 10, fps, config: theme.spring.smooth });
  const ctaP = spring({ frame: frame - 60, fps, config: theme.spring.bouncy });

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

      <Confetti count={90} seed={42} active={frame > 10} frame={frame} width={1920} height={1080} />

      {/* Téléphone centré avec dashboard */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 130,
          transform: `translate(-50%, 0) scale(${interpolate(phoneP, [0, 1], [0.85, 1])})`,
          opacity: phoneP,
        }}
      >
        <PhoneFrame width={PHONE_W} height={PHONE_H}>
          <div style={{ position: "absolute", inset: 0, paddingTop: 50, paddingBottom: 0, boxSizing: "border-box" }}>
            {/* Header */}
            <div style={{ padding: `12px ${PHONE_W * 0.06}px`, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ transform: "scale(0.16)", transformOrigin: "left center" }}>
                <Logo size={PHONE_W} />
              </div>
              <div style={{ fontFamily: theme.fonts.display, fontSize: 20, color: theme.colors.onyx, fontWeight: 700, marginLeft: -10 }}>
                Deux<span style={{ color: theme.colors.lavender }}>nous</span>
              </div>
            </div>

            {/* Banner succès */}
            <div style={{ padding: `0 ${PHONE_W * 0.06}px` }}>
              <AppCard width={PHONE_W - PHONE_W * 0.12} pad={14} radius={18} bg={theme.colors.mintWash} shadow="none">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <CheckIcon size={20} />
                  <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 13, color: theme.colors.onyx }}>
                    Tout est prêt. Le grand jour approche.
                  </div>
                </div>
              </AppCard>
            </div>

            {/* Stats */}
            <div style={{ padding: `16px ${PHONE_W * 0.06}px`, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Stat label="Invités" value="128" sub="confirmés" />
              <Stat label="Cagnotte" value="215k" sub="FCFA" color={theme.colors.mint} />
              <Stat label="Photos" value="342" sub="album" color={theme.colors.lavender} />
              <Stat label="Restant" value="14 j" sub="avant le Jour J" color={theme.colors.warn} />
            </div>

            {/* Action */}
            <div style={{ padding: `0 ${PHONE_W * 0.06}px` }}>
              <OnyxButton width={PHONE_W - PHONE_W * 0.12} height={48} style={{ fontSize: 14 }}>
                Ouvrir le tableau de bord
              </OnyxButton>
            </div>

            {/* QR compact */}
            <div style={{ padding: `14px ${PHONE_W * 0.06}px`, display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 12,
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
                <div style={{ fontFamily: theme.fonts.body, fontSize: 11, color: theme.colors.onyxSoft, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  À partager
                </div>
                <div style={{ fontFamily: theme.fonts.body, fontSize: 13, color: theme.colors.onyx, fontWeight: 600 }}>
                  deuxnous.app/mariage/jean-sarah
                </div>
              </div>
            </div>

            <AppBottomBar active="home" width={PHONE_W} />
          </div>
        </PhoneFrame>
      </div>

      {/* Bloc central tagline */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 130,
          maxWidth: 460,
          opacity: titleP,
          transform: `translateY(${interpolate(titleP, [0, 1], [20, 0])}px)`,
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: 999,           background: theme.colors.lavenderWash, color: theme.colors.lavender, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 16, marginBottom: 14 }}>
          Passez au niveau supérieur
        </div>
        <div style={{ fontFamily: theme.fonts.display, fontSize: 96, color: theme.colors.onyx, lineHeight: 1, letterSpacing: "-0.04em" }}>
          Deux<span style={{ color: theme.colors.lavender }}>nous</span>
          <span style={{ color: theme.colors.lavender }}>.</span>
        </div>
      </div>

      {/* Bloc bas — tagline offre + bouton */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 70,
          transform: "translateX(-50%)",
          textAlign: "center",
          opacity: tagP,
        }}
      >
        <div style={{ display: "flex", gap: 12, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
          {["Lien unique", "QR Code", "Livre d'or", "Cagnotte", "Album"].map((t) => (
            <div
              key={t}
              style={{
                padding: "10px 18px",
                borderRadius: 999,
                background: "#FFFFFF",
                color: theme.colors.onyx,
                fontFamily: theme.fonts.body,
                fontWeight: 600,
                fontSize: 18,
                boxShadow: theme.shadow.card,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <CheckIcon size={16} />
              {t}
            </div>
          ))}
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: 22, color: theme.colors.onyxSoft, marginTop: 18 }}>
          Une seule offre, <span style={{ color: theme.colors.lavender, fontWeight: 700 }}>tout inclus.</span>
        </div>
        <div
          style={{
            marginTop: 20,
            display: "inline-block",
            transform: `scale(${interpolate(ctaP, [0, 1], [0.85, 1])})`,
            opacity: ctaP,
          }}
        >
          <OnyxButton width={280} height={64} style={{ fontSize: 20 }}>
            Créer mon espace
          </OnyxButton>
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: 14, color: theme.colors.onyxSoft, marginTop: 10 }}>
          deuxnous.app
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Stat: React.FC<{ label: string; value: string; sub: string; color?: string }> = ({ label, value, sub, color = theme.colors.onyx }) => (
  <div style={{ background: theme.colors.bgAlt, borderRadius: 16, padding: 12 }}>
    <div style={{ fontFamily: theme.fonts.body, fontSize: 11, color: theme.colors.onyxSoft, letterSpacing: "0.14em", textTransform: "uppercase" }}>
      {label}
    </div>
    <div style={{ fontFamily: theme.fonts.display, fontSize: 28, color, fontWeight: 700, marginTop: 2, letterSpacing: "-0.02em" }}>
      {value}
    </div>
    <div style={{ fontFamily: theme.fonts.body, fontSize: 12, color: theme.colors.onyxSoft }}>{sub}</div>
  </div>
);

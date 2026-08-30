import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { theme, ST } from "./theme";
import { SpringPop, TextSlideFade } from "./motion";
import { BackgroundParticles } from "./particles";
import { PhoneFrame } from "./PhoneFrame";
import { AppCard, AppBottomBar, OnyxButton } from "./ui";
import { CheckIcon } from "./icons";
import { Logo } from "./Logo";
import { QRCode } from "./extras";

const PHONE_W = 340;
const PHONE_H = 720;

export const S6Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneP = spring({ frame, fps, config: theme.spring.bouncy });
  const tagP = spring({ frame: frame - 30, fps, config: theme.spring.uiPop });
  const titleP = spring({ frame: frame - 6, fps, config: theme.spring.bouncy });
  const ctaP = spring({ frame: frame - 60, fps, config: theme.spring.bouncy });
  const kickerP = spring({ frame: frame - 14, fps, config: theme.spring.uiPop });

  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(60% 50% at 50% 45%, rgba(29,211,176,0.15) 0%, transparent 70%)`,
        }}
      />
      <BackgroundParticles count={20} />

      {/* Téléphone à droite */}
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
            <div style={{ padding: `14px ${PHONE_W * 0.06}px`, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ transform: "scale(0.16)", transformOrigin: "left center" }}>
                <Logo size={PHONE_W} />
              </div>
              <div style={{ fontFamily: theme.fonts.display, fontSize: 22, color: theme.colors.onyx, fontWeight: 800, marginLeft: -10 }}>
                Deux<span style={{ color: theme.colors.primary }}>nous</span>
              </div>
            </div>

            <div style={{ padding: `0 ${PHONE_W * 0.06}px` }}>
              <AppCard width={PHONE_W - PHONE_W * 0.12} pad={14} radius={18} bg={theme.colors.primaryWash} shadow="none">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <CheckIcon size={22} />
                  <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 14, color: theme.colors.onyx, lineHeight: 1.2 }}>
                    Tout est prêt. Le grand jour approche.
                  </div>
                </div>
              </AppCard>
            </div>

            <div style={{ padding: `18px ${PHONE_W * 0.06}px`, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Stat label="Invités" value="128" sub="confirmés" />
              <Stat label="Cagnotte" value="215k" sub="FCFA" color={theme.colors.primary} />
              <Stat label="Photos" value="342" sub="album" color="#7FFFE0" />
              <Stat label="Restant" value="14 j" sub="avant le Jour J" color={theme.colors.warn} />
            </div>

            <div style={{ padding: `0 ${PHONE_W * 0.06}px` }}>
              <OnyxButton width={PHONE_W - PHONE_W * 0.12} height={52} style={{ fontSize: 16 }}>
                Ouvrir le tableau de bord
              </OnyxButton>
            </div>

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
                  boxShadow: theme.shadow.lift,
                }}
              >
                {Array.from({ length: 64 }).map((_, i) => (
                  <div key={i} style={{ background: ((i * 9301 + 7) % 7) > 3 ? theme.colors.onyx : "transparent", borderRadius: 1 }} />
                ))}
              </div>
              <div>
                <div style={{ fontFamily: theme.fonts.body, fontSize: 11, color: theme.colors.onyxSoft, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 800 }}>
                  À partager
                </div>
                <div style={{ fontFamily: theme.fonts.body, fontSize: 14, color: theme.colors.onyx, fontWeight: 800, marginTop: 2 }}>
                  deuxnous.app/mariage/jean-sarah
                </div>
              </div>
            </div>

            <AppBottomBar active="home" width={PHONE_W} />
          </div>
        </PhoneFrame>
      </div>

      {/* Bloc gauche — kicker + wordmark géant */}
      <div style={{ position: "absolute", left: 100, top: 240, maxWidth: 900 }}>
        <SpringPop from={14} config="uiPop">
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 26px",
              borderRadius: 999,
              background: "rgba(29,211,176,0.15)",
              color: theme.colors.primary,
              fontFamily: theme.fonts.body,
              fontWeight: 800,
              fontSize: 26,
              marginBottom: 24,
            }}
          >
            Passez au niveau supérieur
          </div>
        </SpringPop>
        <SpringPop from={6} config="bouncy" scaleFrom={0.4}>
          <div
            style={{
              fontFamily: theme.fonts.display,
              fontSize: 170,
              color: theme.colors.text,
              lineHeight: 0.9,
              letterSpacing: "-0.05em",
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            Deux<span style={{ color: theme.colors.primary }}>nous</span>
            <span style={{ color: theme.colors.primary }}>.</span>
          </div>
        </SpringPop>
      </div>

      {/* Bloc bas — chips + tagline + bouton */}
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
                fontWeight: 800,
                fontSize: 20,
                boxShadow: theme.shadow.lift,
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
        <div style={{ marginTop: 18, fontFamily: theme.fonts.body, fontSize: 24, color: theme.colors.textDim, fontWeight: 500 }}>
          Une seule offre, <span style={{ color: theme.colors.primary, fontWeight: 800 }}>tout inclus.</span>
        </div>
        <div style={{ marginTop: 16, display: "inline-block", transform: `scale(${interpolate(ctaP, [0, 1], [0.85, 1])})`, opacity: ctaP }}>
          <OnyxButton width={320} height={72} style={{ fontSize: 24, fontWeight: 800 }}>
            Créer mon espace
          </OnyxButton>
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: 16, color: theme.colors.textDim, marginTop: 10, letterSpacing: "0.06em", fontWeight: 700 }}>
          deuxnous.app
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Stat: React.FC<{ label: string; value: string; sub: string; color?: string }> = ({ label, value, sub, color = theme.colors.onyx }) => (
  <div style={{ background: theme.colors.bgSoft, borderRadius: 18, padding: 14 }}>
    <div style={{ fontFamily: theme.fonts.body, fontSize: 12, color: theme.colors.onyxSoft, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 800 }}>
      {label}
    </div>
    <div style={{ fontFamily: theme.fonts.display, fontSize: 32, color, fontWeight: 700, marginTop: 4, letterSpacing: "-0.02em" }}>
      {value}
    </div>
    <div style={{ fontFamily: theme.fonts.body, fontSize: 13, color: theme.colors.onyxSoft, fontWeight: 500 }}>{sub}</div>
  </div>
);

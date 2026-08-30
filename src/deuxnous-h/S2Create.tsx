import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { theme, D, ST } from "./theme";
import { SpringPop, TextSlideFade } from "./motion";
import { BackgroundParticles } from "./particles";
import { PhoneFrame } from "./PhoneFrame";
import { AppCard, AppBottomBar, Field, OnyxButton, GhostButton } from "./ui";
import { QRCode } from "./extras";
import { Logo, Wordmark } from "./Logo";
import { CheckIcon, HeartIcon, CursorIcon } from "./icons";

// S2 Création (5-11s, frames locales 0..180)
// Titre à droite, téléphone à gauche, formulaire + typing + CTA + QR.

const PHONE_W = 460;

export const S2Create: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Téléphone entre depuis le bas
  const phoneP = spring({ frame, fps, config: theme.spring.bouncy });
  const phoneY = interpolate(phoneP, [0, 1], [200, 0]);

  // Typing "Jean" (champ 1) puis "& Sarah" (champ 2)
  const t1 = interpolate(frame, [30, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const t2 = interpolate(frame, [52, 78], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const v1 = "Jean".slice(0, Math.floor(4 * t1));
  const v2 = "& Sarah".slice(0, Math.floor(7 * t2));

  // Bouton (apparaît à 78)
  const btnP = spring({ frame: frame - 78, fps, config: theme.spring.uiPop });
  const ripple = interpolate(frame, [88, 104], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const clickO = interpolate(frame, [90, 100], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Transition vers l'état "QR + lien"
  const trans = interpolate(frame, [100, 130], [0, 1], { easing: Easing.inOut(Easing.bezier(...theme.easing.camera)), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const formO = 1 - trans;
  const successP = spring({ frame: frame - 118, fps, config: theme.spring.bouncy });
  const qrP = spring({ frame: frame - 124, fps, config: theme.spring.uiPop });

  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      <BackgroundParticles count={16} />

      {/* Titre scène — à droite */}
      <div style={{ position: "absolute", right: 100, top: 100, maxWidth: 700, textAlign: "right" }}>
        <TextSlideFade from={0} delay={0}>
          <div
            style={{
              fontFamily: theme.fonts.body,
              fontSize: 30,
              color: theme.colors.primary,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 800,
            }}
          >
            Pour les mariés
          </div>
        </TextSlideFade>
        <TextSlideFade from={6} delay={0} yOffset={40}>
          <div
            style={{
              fontFamily: theme.fonts.display,
              fontSize: 120,
              color: theme.colors.text,
              letterSpacing: "-0.03em",
              lineHeight: 1.02,
              marginTop: 14,
              fontWeight: 700,
            }}
          >
            Créez en <span style={{ color: theme.colors.primary }}>3 minutes</span>.
          </div>
        </TextSlideFade>
      </div>

      {/* Téléphone à gauche */}
      <div
        style={{
          position: "absolute",
          left: 90,
          top: "50%",
          transform: `translate(0, calc(-50% + ${phoneY}px)) scale(${interpolate(phoneP, [0, 1], [0.9, 1])})`,
          opacity: phoneP,
        }}
      >
        <PhoneFrame width={PHONE_W} height={860}>
          <div style={{ position: "absolute", inset: 0, paddingTop: 50, paddingBottom: 0, boxSizing: "border-box" }}>
            {/* Header */}
            <div style={{ padding: `16px ${PHONE_W * 0.06}px`, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ transform: "scale(0.2)", transformOrigin: "left center" }}>
                <Logo size={PHONE_W} />
              </div>
              <div style={{ fontFamily: theme.fonts.display, fontSize: 28, color: theme.colors.onyx, fontWeight: 800, marginLeft: -10 }}>
                Deux<span style={{ color: theme.colors.primary }}>nous</span>
              </div>
            </div>

            {/* Form (fade-out après 100) */}
            <div style={{ padding: `0 ${PHONE_W * 0.07}px`, opacity: formO }}>
              <TextSlideFade from={20} delay={0}>
                <div style={{ fontFamily: theme.fonts.display, fontSize: 36, color: theme.colors.onyx, fontWeight: 700, marginBottom: 6 }}>
                  Créez votre espace
                </div>
              </TextSlideFade>
              <TextSlideFade from={26} delay={0}>
                <div style={{ fontFamily: theme.fonts.body, fontSize: 18, color: theme.colors.onyxSoft, marginBottom: 26, fontWeight: 500 }}>
                  On vous guide, étape par étape.
                </div>
              </TextSlideFade>

              <Field value={v1} placeholder="Prénom du marié" width={PHONE_W * 0.86} caret={t1 < 1} fontSize={22} />
              <div style={{ height: 16 }} />
              <Field value={v2} placeholder="Prénom de la mariée" width={PHONE_W * 0.86} caret={t2 < 1 && frame < 78} fontSize={22} />

              <div style={{ height: 26 }} />
              <div style={{ position: "relative" }}>
                <div style={{ opacity: btnP, transform: `translateY(${interpolate(btnP, [0, 1], [16, 0])}px) scale(${interpolate(btnP, [0, 1], [0.94, 1])})` }}>
                  <OnyxButton width={PHONE_W * 0.86} height={64} style={{ fontSize: 24 }}>
                    Publier mon espace
                  </OnyxButton>
                </div>
                {frame >= 88 && frame <= 104 ? (
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: 32,
                      transform: "translate(-50%, -50%)",
                      width: 110 * ripple,
                      height: 110 * ripple,
                      borderRadius: "50%",
                      border: `4px solid ${theme.colors.primary}`,
                      opacity: (1 - ripple) * 1.4,
                    }}
                  />
                ) : null}
                {frame >= 88 && frame <= 100 ? (
                  <div style={{ position: "absolute", left: "50%", top: 0, transform: "translate(-50%, 0)", opacity: clickO }}>
                    <CursorIcon size={40} color={theme.colors.onyx} />
                  </div>
                ) : null}
              </div>

              <div style={{ height: 20, opacity: btnP }} />
              <div style={{ opacity: btnP * 0.6 }}>
                <GhostButton width={PHONE_W * 0.86} height={52}>
                  <span style={{ fontSize: 19 }}>+ Inviter un co-organisateur</span>
                </GhostButton>
              </div>
            </div>

            {/* Success : QR + lien */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                padding: `${PHONE_W * 0.05 + 50}px ${PHONE_W * 0.07}px 0`,
                opacity: successP,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <TextSlideFade from={120} delay={0}>
                <div
                  style={{
                    fontFamily: theme.fonts.display,
                    fontSize: 28,
                    fontWeight: 700,
                    color: theme.colors.onyx,
                    marginBottom: 4,
                  }}
                >
                  Votre espace est <span style={{ color: theme.colors.primary }}>en ligne</span>{" "}
                  <span style={{ display: "inline-block", transform: "translateY(4px)" }}>
                    <CheckIcon size={24} />
                  </span>
                </div>
              </TextSlideFade>
              <TextSlideFade from={126} delay={0}>
                <div style={{ fontFamily: theme.fonts.body, fontSize: 16, color: theme.colors.onyxSoft, marginBottom: 18, fontWeight: 500 }}>
                  Partagez le QR ou le lien à vos invités.
                </div>
              </TextSlideFade>
              <SpringPop from={128} config="bouncy">
                <QRCode seed="deuxnous-jean-sarah" size={240} />
              </SpringPop>
              <SpringPop from={136} config="uiPop">
                <div
                  style={{
                    marginTop: 18,
                    padding: "12px 18px",
                    borderRadius: 999,
                    background: theme.colors.primaryWash,
                    color: theme.colors.primary,
                    fontFamily: theme.fonts.body,
                    fontSize: 18,
                    fontWeight: 800,
                  }}
                >
                  deuxnous.app/mariage/jean-sarah
                </div>
              </SpringPop>
            </div>

            <AppBottomBar active="home" width={PHONE_W} />
          </div>
        </PhoneFrame>
      </div>

      {/* Tagline bas-droite */}
      <div style={{ position: "absolute", right: 100, bottom: 110, maxWidth: 600, textAlign: "right" }}>
        <SpringPop from={150} config="uiPop">
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "16px 28px",
              borderRadius: 999,
              background: "rgba(29,211,176,0.15)",
              color: theme.colors.primary,
              fontFamily: theme.fonts.body,
              fontWeight: 800,
              fontSize: 32,
            }}
          >
            <HeartIcon size={32} color={theme.colors.primary} />
            Prêt à partager.
          </div>
        </SpringPop>
        <TextSlideFade from={158} delay={0} yOffset={20}>
          <div style={{ fontFamily: theme.fonts.body, fontSize: 32, color: theme.colors.textDim, marginTop: 18, lineHeight: 1.25, fontWeight: 500 }}>
            Un lien. Un QR. Et toute la famille synchronisée.
          </div>
        </TextSlideFade>
      </div>
    </AbsoluteFill>
  );
};

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { theme } from "./theme";
import { PhoneFrame } from "./PhoneFrame";
import { QRCode } from "./QRCode";
import { AppCard, AppBottomBar, Field, OnyxButton, GhostButton } from "./ui";
import { CheckIcon, HeartIcon, CursorIcon } from "./icons";
import { Logo } from "./Logo";

// S2 — La Création Rapide (5 à 12s, frames locales 0..210)
// 0   : téléphone entre (slide-up + scale)
// 0-30: header "Créer mon espace" + sous-titre
// 30-70: typing "Jean" (champ 1) puis "& Sarah" (champ 2)
// 70-90: bouton "Publier mon espace" apparaît + curseur clique (ripple)
// 90-150: transition "magique" — le formulaire se replie, QR + lien apparaissent
// 150-210: hold avec tagline

const PHONE_W = 460;

const typeText = (text: string, progress: number) => text.slice(0, Math.floor(text.length * progress));

export const S2Create: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneIn = spring({ frame, fps, config: theme.spring.bouncy });
  const phoneSlide = interpolate(phoneIn, [0, 1], [80, 0]);

  // Typing : on tape "Jean" (champ 1) entre f=30..50, puis "& Sarah" (champ 2) entre f=50..78
  const t1 = interpolate(frame, [30, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const t2 = interpolate(frame, [52, 78], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const v1 = typeText("Jean", t1);
  const v2 = typeText("& Sarah", t2);

  // Bouton : apparaît à 78
  const btnP = spring({ frame: frame - 78, fps, config: theme.spring.bouncy });

  // Click ripple : 88–104
  const ripple = interpolate(frame, [88, 104], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const clickO = interpolate(frame, [90, 100], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Transition vers l'état "QR + lien" : 100–130
  const trans = interpolate(frame, [100, 130], [0, 1], { easing: Easing.inOut(Easing.bezier(0.83, 0, 0.17, 1)), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const formO = 1 - trans;
  const successP = spring({ frame: frame - 118, fps, config: theme.spring.bouncy });
  const qrP = spring({ frame: frame - 124, fps, config: theme.spring.smooth });

  // Tagline
  const tagP = spring({ frame: frame - 150, fps, config: theme.spring.smooth });

  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${theme.colors.line} 1.5px, transparent 1.5px)`,
          backgroundSize: "32px 32px",
          opacity: 0.5,
        }}
      />

      {/* Titre scène */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 70,
          opacity: spring({ frame, fps, config: theme.spring.smooth }),
          transform: `translateX(${interpolate(spring({ frame, fps, config: theme.spring.smooth }), [0, 1], [-20, 0])}px)`,
        }}
      >
        <div style={{ fontFamily: theme.fonts.body, fontSize: 24, color: theme.colors.lavender, letterSpacing: "0.18em", textTransform: "uppercase" }}>
          Pour les mariés
        </div>
        <div style={{ fontFamily: theme.fonts.display, fontSize: 84, color: theme.colors.onyx, letterSpacing: "-0.03em", lineHeight: 1.05, marginTop: 8 }}>
          Créez en <span style={{ color: theme.colors.lavender }}>3 minutes</span>.
        </div>
      </div>

      {/* Téléphone centré */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, calc(-50% + ${phoneSlide}px)) scale(${interpolate(phoneIn, [0, 1], [0.92, 1])})`,
          opacity: phoneIn,
        }}
      >
        <PhoneFrame width={PHONE_W} height={860}>
          {/* Écran : formulaire puis succès */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              paddingTop: 50,
              paddingBottom: 0,
              boxSizing: "border-box",
            }}
          >
            {/* Header (constant) */}
            <div style={{ padding: `14px ${PHONE_W * 0.06}px`, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ transform: "scale(0.18)", transformOrigin: "left center" }}>
                <Logo size={PHONE_W} />
              </div>
              <div style={{ fontFamily: theme.fonts.display, fontSize: 22, color: theme.colors.onyx, fontWeight: 700, marginLeft: -8 }}>
                Deux<span style={{ color: theme.colors.lavender }}>nous</span>
              </div>
            </div>

            {/* Form (fade-out après 100) */}
            <div style={{ padding: `0 ${PHONE_W * 0.07}px`, opacity: formO }}>
              <div style={{ fontFamily: theme.fonts.display, fontSize: 28, color: theme.colors.onyx, fontWeight: 700, marginBottom: 4 }}>
                Créez votre espace
              </div>
              <div style={{ fontFamily: theme.fonts.body, fontSize: 14, color: theme.colors.onyxSoft, marginBottom: 22 }}>
                On vous guide, étape par étape.
              </div>

              <Field value={v1} placeholder="Prénom du marié" width={PHONE_W * 0.86} caret={t1 < 1} fontSize={18} />
              <div style={{ height: 14 }} />
              <Field value={v2} placeholder="Prénom de la mariée" width={PHONE_W * 0.86} caret={t2 < 1 && frame < 78} fontSize={18} />

              <div style={{ height: 22 }} />
              <div style={{ position: "relative" }}>
                <div style={{ opacity: btnP, transform: `translateY(${interpolate(btnP, [0, 1], [16, 0])}px) scale(${interpolate(btnP, [0, 1], [0.96, 1])})` }}>
                  <OnyxButton width={PHONE_W * 0.86} height={56} style={{ fontSize: 20 }}>
                    Publier mon espace
                  </OnyxButton>
                </div>
                {frame >= 88 && frame <= 104 ? (
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: 28,
                      transform: "translate(-50%, -50%)",
                      width: 90 * ripple,
                      height: 90 * ripple,
                      borderRadius: "50%",
                      border: `3px solid ${theme.colors.lavender}`,
                      opacity: (1 - ripple) * 1.4,
                    }}
                  />
                ) : null}
                {frame >= 88 && frame <= 100 ? (
                  <div style={{ position: "absolute", left: "50%", top: 0, transform: "translate(-50%, 0)", opacity: clickO }}>
                    <CursorIcon size={32} color={theme.colors.onyx} />
                  </div>
                ) : null}
              </div>

              <div style={{ height: 18, opacity: btnP }} />
              <div style={{ opacity: btnP * 0.6 }}>
                <GhostButton width={PHONE_W * 0.86} height={48}>
                  <span style={{ fontSize: 16 }}>+ Inviter un co-organisateur</span>
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
              <div
                style={{
                  fontFamily: theme.fonts.display,
                  fontSize: 22,
                  fontWeight: 700,
                  color: theme.colors.onyx,
                  marginBottom: 2,
                  opacity: qrP,
                }}
              >
                Votre espace est <span style={{ color: theme.colors.mint }}>en ligne</span>{" "}
                <span style={{ display: "inline-block", transform: "translateY(4px)" }}>
                  <CheckIcon size={20} />
                </span>
              </div>
              <div
                style={{
                  fontFamily: theme.fonts.body,
                  fontSize: 13,
                  color: theme.colors.onyxSoft,
                  marginBottom: 14,
                  opacity: qrP,
                }}
              >
                Partagez le QR ou le lien à vos invités.
              </div>
              <div style={{ transform: `scale(${interpolate(qrP, [0, 1], [0.7, 1])})` }}>
                <QRCode seed="deuxnous-jean-sarah" size={200} />
              </div>
              <div
                style={{
                  marginTop: 14,
                  padding: "8px 14px",
                  borderRadius: 999,
                  background: theme.colors.lavenderWash,
                  color: theme.colors.lavender,
                  fontFamily: theme.fonts.body,
                  fontSize: 14,
                  fontWeight: 600,
                  opacity: qrP,
                }}
              >
                deuxnous.app/mariage/jean-sarah
              </div>
            </div>

            <AppBottomBar active="home" width={PHONE_W} />
          </div>
        </PhoneFrame>
      </div>

      {/* Tagline bas-droite */}
      <div
        style={{
          position: "absolute",
          right: 80,
          bottom: 90,
          maxWidth: 540,
          textAlign: "right",
          opacity: tagP,
          transform: `translateY(${interpolate(tagP, [0, 1], [20, 0])}px)`,
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 18px", borderRadius: 999, background: theme.colors.lavenderWash, color: theme.colors.lavender, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 22, letterSpacing: "-0.01em" }}>
          <HeartIcon size={22} />
          Prêt à partager.
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: 24, color: theme.colors.onyxSoft, marginTop: 14, lineHeight: 1.3 }}>
          Un lien. Un QR. Et toute la famille synchronisée.
        </div>
      </div>
    </AbsoluteFill>
  );
};

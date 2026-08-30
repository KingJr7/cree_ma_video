import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { theme, ST } from "./theme";
import { SpringPop, TextSlideFade } from "./motion";
import { BackgroundParticles } from "./particles";
import { PhoneFrame } from "./PhoneFrame";
import { AppCard, AppBottomBar, Field, OnyxButton } from "./ui";
import { CheckIcon, WhatsAppIcon, HeartIcon, StarIcon, CursorIcon } from "./icons";

// S3 RSVP (11-18s, frames locales 0..210)
// Bulle WhatsApp + clic + téléphone plein écran + billet VIP.

const PHONE_W = 360;
const PHONE_H = 720;

export const S3RSVP: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bubbleP = spring({ frame, fps, config: theme.spring.bouncy });
  const ripple = interpolate(frame, [32, 46], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const phoneT = interpolate(frame, [50, 70], [0, 1], { easing: Easing.inOut(Easing.bezier(...theme.easing.camera)), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const welcP = spring({ frame: frame - 70, fps, config: theme.spring.uiPop });
  const rsvpP = spring({ frame: frame - 100, fps, config: theme.spring.uiPop });
  const ticketP = spring({ frame: frame - 142, fps, config: theme.spring.bouncy });
  const shine = Math.sin(frame / 8) * 0.5 + 0.5;

  const numProgress = interpolate(frame, [112, 142], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const numDisplay = numProgress >= 1 ? "06 12 34 56 78" : "06 12 34 56 78".slice(0, Math.floor(numProgress * 14));

  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      <BackgroundParticles count={16} />

      {/* Bulle WhatsApp + lien (visible avant le clic) */}
      {frame < 50 ? (
        <div
          style={{
            position: "absolute",
            left: 240,
            top: 380,
            width: 1440,
            transform: `translateY(${interpolate(bubbleP, [0, 1], [40, 0])}px) scale(${interpolate(bubbleP, [0, 1], [0.9, 1])})`,
            opacity: bubbleP,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 24 }}>
            <div style={{ paddingTop: 8 }}>
              <WhatsAppIcon size={72} />
            </div>
            <AppCard width={1280} pad={36} radius={40} shadow={theme.shadow.lift}>
              <div style={{ fontFamily: theme.fonts.body, fontSize: 26, color: theme.colors.onyxSoft, marginBottom: 8, fontWeight: 600 }}>
                Sarah · 14:02
              </div>
              <div style={{ fontFamily: theme.fonts.body, fontSize: 36, color: theme.colors.onyx, marginBottom: 22, fontWeight: 500, lineHeight: 1.25 }}>
                Coucou la famille 💍 On a tout préparé sur Deuxnous, c'est juste ici :
              </div>
              <div
                style={{
                  display: "inline-block",
                  padding: "20px 32px",
                  borderRadius: 22,
                  background: theme.colors.primaryWash,
                  color: theme.colors.primary,
                  fontFamily: theme.fonts.body,
                  fontWeight: 800,
                  fontSize: 38,
                }}
              >
                deuxnous.app/mariage/jean-sarah
              </div>
            </AppCard>
          </div>
          {/* Click ripple */}
          {frame >= 32 ? (
            <div
              style={{
                position: "absolute",
                left: 430,
                top: 200,
                width: 120 * ripple,
                height: 120 * ripple,
                borderRadius: "50%",
                border: `4px solid ${theme.colors.primary}`,
                opacity: (1 - ripple) * 1.4,
                transform: "translate(-50%, -50%)",
              }}
            />
          ) : null}
          {frame >= 32 && frame <= 46 ? (
            <div style={{ position: "absolute", left: 450, top: 210, opacity: 1 - ripple }}>
              <CursorIcon size={40} color={theme.colors.onyx} />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Téléphone plein écran après clic */}
      {frame >= 50 ? (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 90,
            transform: `translate(-50%, 0) scale(${interpolate(phoneT, [0, 1], [0.9, 1])})`,
            opacity: phoneT,
          }}
        >
          <PhoneFrame width={PHONE_W} height={PHONE_H}>
            <div style={{ position: "absolute", inset: 0, paddingTop: 50, paddingBottom: 0, boxSizing: "border-box" }}>
              {/* Welcome (visible 70-100) */}
              <div style={{ position: "absolute", inset: 0, padding: 24, opacity: 1 - rsvpP, boxSizing: "border-box" }}>
                <div style={{ fontFamily: theme.fonts.display, fontSize: 38, color: theme.colors.onyx, fontWeight: 700, lineHeight: 1.05 }}>
                  Bienvenue, <span style={{ color: theme.colors.primary }}>Jean & Sarah</span>
                </div>
                <div style={{ fontFamily: theme.fonts.body, fontSize: 18, color: theme.colors.onyxSoft, marginTop: 6, fontWeight: 500 }}>
                  22 juin 2026 · 17h00 · Cotonou
                </div>
                <div style={{ height: 28 }} />
                <AppCard width={PHONE_W - 48} pad={20} radius={22} bg={theme.colors.primaryWash} shadow="none">
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 24, background: theme.colors.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <HeartIcon size={26} color={theme.colors.onyx} />
                    </div>
                    <div>
                      <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 18, color: theme.colors.onyx }}>Cérémonie + Réception</div>
                      <div style={{ fontFamily: theme.fonts.body, fontSize: 15, color: theme.colors.onyxSoft, fontWeight: 500 }}>128 invités confirmés</div>
                    </div>
                  </div>
                </AppCard>
                <div style={{ height: 22 }} />
                <OnyxButton width={PHONE_W - 48} height={60} style={{ fontSize: 22 }}>Confirmer ma présence</OnyxButton>
              </div>

              {/* RSVP (visible 100-150) */}
              <div style={{ position: "absolute", inset: 0, padding: 24, opacity: rsvpP * (1 - ticketP), boxSizing: "border-box" }}>
                <div style={{ fontFamily: theme.fonts.display, fontSize: 36, color: theme.colors.onyx, fontWeight: 700 }}>
                  Votre numéro
                </div>
                <div style={{ fontFamily: theme.fonts.body, fontSize: 18, color: theme.colors.onyxSoft, marginTop: 6, fontWeight: 500 }}>
                  Pour recevoir votre billet.
                </div>
                <div style={{ height: 22 }} />
                <Field value={numDisplay} placeholder="06 12 34 56 78" width={PHONE_W - 48} fontSize={24} caret={numProgress < 1} />
                <div style={{ height: 18 }} />
                <OnyxButton width={PHONE_W - 48} height={60} style={{ fontSize: 22, opacity: numProgress >= 1 ? 1 : 0.4 }}>
                  Recevoir mon billet
                </OnyxButton>
              </div>

              {/* Billet VIP (visible 142+) */}
              <div style={{ position: "absolute", inset: 0, padding: 24, display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}>
                <div
                  style={{
                    opacity: ticketP,
                    transform: `scale(${interpolate(ticketP, [0, 1], [0.7, 1])} rotate(${interpolate(ticketP, [0, 1], [-6, 0])}deg))`,
                    width: PHONE_W - 48,
                  }}
                >
                  <div
                    style={{
                      background: `linear-gradient(135deg, ${theme.colors.primary} 0%, #4DE0BE 100%)`,
                      borderRadius: 24,
                      padding: 22,
                      color: theme.colors.onyx,
                      boxShadow: `0 30px 60px -22px ${theme.colors.primary}aa, 0 0 ${40 + shine * 50}px ${theme.colors.primary}55`,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: `${shine * 100 - 50}%`,
                        width: "40%",
                        height: "100%",
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                        transform: "skewX(-12deg)",
                      }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontFamily: theme.fonts.body, fontSize: 14, letterSpacing: "0.2em", opacity: 0.8, fontWeight: 800 }}>DEUXNOUS · VIP</div>
                      <StarIcon size={28} color={theme.colors.onyx} />
                    </div>
                    <div style={{ fontFamily: theme.fonts.display, fontSize: 38, fontWeight: 700, marginTop: 8, lineHeight: 1.05 }}>
                      Jean & Sarah
                    </div>
                    <div style={{ fontFamily: theme.fonts.body, fontSize: 16, opacity: 0.8, marginTop: 4, fontWeight: 700 }}>
                      22 JUIN 2026 · COTONOU
                    </div>
                    <div
                      style={{
                        marginTop: 18,
                        padding: "12px 14px",
                        background: "rgba(10,10,18,0.12)",
                        borderRadius: 14,
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                      }}
                    >
                      <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
                        {Array.from({ length: 18 }).map((_, i) => (
                          <div key={i} style={{ width: 3, height: i % 3 === 0 ? 22 : i % 2 === 0 ? 16 : 12, background: theme.colors.onyx }} />
                        ))}
                      </div>
                      <div>
                        <div style={{ fontFamily: theme.fonts.body, fontSize: 12, opacity: 0.7, fontWeight: 700 }}>CODE</div>
                        <div style={{ fontFamily: theme.fonts.body, fontSize: 22, fontWeight: 800, letterSpacing: "0.16em" }}>JNS-26-AB7C</div>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      marginTop: 16,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      color: theme.colors.primary,
                      fontFamily: theme.fonts.body,
                      fontWeight: 800,
                      fontSize: 20,
                    }}
                  >
                    <CheckIcon size={28} />
                    Billet ajouté à votre poche
                  </div>
                </div>
              </div>

              <AppBottomBar active="profile" width={PHONE_W} />
            </div>
          </PhoneFrame>
        </div>
      ) : null}

      {/* Tagline bas-gauche après billet */}
      <div style={{ position: "absolute", left: 80, bottom: 70, maxWidth: 600 }}>
        <SpringPop from={180} config="bouncy">
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
              fontSize: 30,
            }}
          >
            <CheckIcon size={30} />
            Invitations
          </div>
        </SpringPop>
        <TextSlideFade from={186} delay={0} yOffset={30}>
          <div style={{ fontFamily: theme.fonts.display, fontSize: 78, color: theme.colors.text, lineHeight: 1, marginTop: 18, letterSpacing: "-0.03em", fontWeight: 700 }}>
            Directement <br />
            <span style={{ color: theme.colors.primary }}>dans leur poche.</span>
          </div>
        </TextSlideFade>
      </div>
    </AbsoluteFill>
  );
};

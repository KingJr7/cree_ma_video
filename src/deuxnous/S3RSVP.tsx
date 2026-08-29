import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { theme } from "./theme";
import { PhoneFrame } from "./PhoneFrame";
import { AppCard, AppBottomBar, Field, OnyxButton, GhostButton } from "./ui";
import { CheckIcon, WhatsAppIcon, HeartIcon, StarIcon, CursorIcon } from "./icons";

// S3 — L'expérience Invité (12 à 20s, frames locales 0..240)
// 0-50    : bulle WhatsApp sur fond, le lien se révèle, curseur clique
// 50-70   : wipe de transition : le téléphone prend l'écran
// 70-110  : page d'accueil Deuxnous, puis écran "Entrez votre numéro"
// 110-140 : typing du numéro (000 -> 06 12 34 56 78)
// 140-180 : "Génération" + billet VIP qui apparaît et brille

const PHONE_W = 360;
const PHONE_H = 720;

export const S3RSVP: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Bulle WhatsApp : pop 0-12
  const bubbleP = spring({ frame, fps, config: theme.spring.bouncy });
  // Click ripple sur le lien 32-44
  const ripple = interpolate(frame, [32, 46], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Téléphone plein écran : 50-70
  const phoneT = interpolate(frame, [50, 70], [0, 1], { easing: Easing.inOut(Easing.bezier(0.83, 0, 0.17, 1)), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Page welcome 70-100, RSVP 100-140, Billet 140-200
  const welcP = spring({ frame: frame - 70, fps, config: theme.spring.smooth });
  const rsvpP = spring({ frame: frame - 100, fps, config: theme.spring.smooth });
  const ticketP = spring({ frame: frame - 142, fps, config: theme.spring.bouncy });
  // shimmer du billet (radial qui pulse)
  const shine = Math.sin(frame / 8) * 0.5 + 0.5;

  // Typing numéro
  const numProgress = interpolate(frame, [112, 142], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const numText = "06 12 34 56 78".slice(0, Math.floor(numProgress * 14));
  // numProgress * 14 may exceed; clamp:
  const numDisplay = numProgress >= 1 ? "06 12 34 56 78" : numText;

  // Tagline
  const tagP = spring({ frame: frame - 180, fps, config: theme.spring.smooth });

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
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 24,
            }}
          >
            <div style={{ transform: "scale(1.6)", transformOrigin: "top left" }}>
              <WhatsAppIcon size={100} />
            </div>
            <AppCard width={1280} pad={32} radius={36} shadow={theme.shadow.lift}>
              <div style={{ fontFamily: theme.fonts.body, fontSize: 22, color: theme.colors.onyxSoft, marginBottom: 4 }}>Sarah · 14:02</div>
              <div style={{ fontFamily: theme.fonts.body, fontSize: 28, color: theme.colors.onyx, marginBottom: 14 }}>
                Coucou la famille 💍 On a tout préparé sur Deuxnous, c'est juste ici :
              </div>
              <div
                style={{
                  display: "inline-block",
                  padding: "14px 22px",
                  borderRadius: 18,
                  background: theme.colors.lavenderWash,
                  color: theme.colors.lavender,
                  fontFamily: theme.fonts.body,
                  fontWeight: 700,
                  fontSize: 26,
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
                left: 540,
                top: 230,
                width: 90 * ripple,
                height: 90 * ripple,
                borderRadius: "50%",
                border: `3px solid ${theme.colors.lavender}`,
                opacity: (1 - ripple) * 1.4,
              }}
            />
          ) : null}
          {frame >= 32 && frame <= 46 ? (
            <div style={{ position: "absolute", left: 560, top: 240, opacity: 1 - ripple }}>
              <CursorIcon size={32} color={theme.colors.onyx} />
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
            top: "50%",
            transform: `translate(-50%, -50%) scale(${interpolate(phoneT, [0, 1], [0.9, 1])})`,
            opacity: phoneT,
          }}
        >
          <PhoneFrame width={PHONE_W} height={PHONE_H}>
            <div style={{ position: "absolute", inset: 0, paddingTop: 50, paddingBottom: 0, boxSizing: "border-box" }}>
              {/* Welcome (visible 70-100) */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  padding: 24,
                  opacity: 1 - rsvpP,
                  boxSizing: "border-box",
                }}
              >
                <div style={{ fontFamily: theme.fonts.display, fontSize: 26, color: theme.colors.onyx, fontWeight: 700, lineHeight: 1.1 }}>
                  Bienvenue, <span style={{ color: theme.colors.lavender }}>Jean & Sarah</span>
                </div>
                <div style={{ fontFamily: theme.fonts.body, fontSize: 13, color: theme.colors.onyxSoft, marginTop: 4 }}>
                  22 juin 2026 · 17h00 · Cotonou
                </div>
                <div style={{ height: 22 }} />
                <AppCard width={PHONE_W - 48} pad={18} radius={20} bg={theme.colors.lavenderWash} shadow="none">
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 18, background: theme.colors.lavender, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <HeartIcon size={20} color="#FFFFFF" />
                    </div>
                    <div>
                      <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 14, color: theme.colors.onyx }}>Cérémonie + Réception</div>
                      <div style={{ fontFamily: theme.fonts.body, fontSize: 12, color: theme.colors.onyxSoft }}>128 invités confirmés</div>
                    </div>
                  </div>
                </AppCard>
                <div style={{ height: 18 }} />
                <OnyxButton width={PHONE_W - 48} height={52} style={{ fontSize: 16 }}>Confirmer ma présence</OnyxButton>
              </div>

              {/* RSVP (visible 100-150) */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  padding: 24,
                  opacity: rsvpP * (1 - ticketP),
                  boxSizing: "border-box",
                }}
              >
                <div style={{ fontFamily: theme.fonts.display, fontSize: 24, color: theme.colors.onyx, fontWeight: 700 }}>
                  Votre numéro
                </div>
                <div style={{ fontFamily: theme.fonts.body, fontSize: 13, color: theme.colors.onyxSoft, marginTop: 4 }}>
                  Pour recevoir votre billet.
                </div>
                <div style={{ height: 18 }} />
                <Field value={numDisplay} placeholder="06 12 34 56 78" width={PHONE_W - 48} fontSize={18} caret={numProgress < 1} />
                <div style={{ height: 14 }} />
                <OnyxButton width={PHONE_W - 48} height={52} style={{ fontSize: 16, opacity: numProgress >= 1 ? 1 : 0.4 }}>
                  Recevoir mon billet
                </OnyxButton>
              </div>

              {/* Billet VIP (visible 142+) */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  padding: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    opacity: ticketP,
                    transform: `scale(${interpolate(ticketP, [0, 1], [0.7, 1])} rotate(${interpolate(ticketP, [0, 1], [-6, 0])}deg))`,
                    width: PHONE_W - 48,
                  }}
                >
                  {/* Billet */}
                  <div
                    style={{
                      background: `linear-gradient(135deg, ${theme.colors.lavender} 0%, #8A6FFF 100%)`,
                      borderRadius: 24,
                      padding: 22,
                      color: "#FFFFFF",
                      boxShadow: `0 30px 60px -22px ${theme.colors.lavender}aa, 0 0 ${40 + shine * 50}px ${theme.colors.lavender}55`,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Shine sweep */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: `${shine * 100 - 50}%`,
                        width: "40%",
                        height: "100%",
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                        transform: "skewX(-12deg)",
                      }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontFamily: theme.fonts.body, fontSize: 11, letterSpacing: "0.2em", opacity: 0.85 }}>DEUXNOUS · VIP</div>
                      <StarIcon size={22} color="#FFD76A" />
                    </div>
                    <div style={{ fontFamily: theme.fonts.display, fontSize: 28, fontWeight: 700, marginTop: 6, lineHeight: 1.1 }}>
                      Jean & Sarah
                    </div>
                    <div style={{ fontFamily: theme.fonts.body, fontSize: 13, opacity: 0.85, marginTop: 2 }}>
                      22 JUIN 2026 · COTONOU
                    </div>
                    <div
                      style={{
                        marginTop: 14,
                        padding: "10px 12px",
                        background: "rgba(255,255,255,0.15)",
                        borderRadius: 12,
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
                        {Array.from({ length: 18 }).map((_, i) => (
                          <div key={i} style={{ width: 2, height: i % 3 === 0 ? 18 : i % 2 === 0 ? 14 : 10, background: "#FFFFFF" }} />
                        ))}
                      </div>
                      <div>
                        <div style={{ fontFamily: theme.fonts.mono, fontSize: 11, opacity: 0.7 }}>CODE</div>
                        <div style={{ fontFamily: theme.fonts.mono, fontSize: 18, fontWeight: 700, letterSpacing: "0.16em" }}>JNS-26-AB7C</div>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      marginTop: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      color: theme.colors.mint,
                      fontFamily: theme.fonts.body,
                      fontWeight: 700,
                      fontSize: 16,
                    }}
                  >
                    <CheckIcon size={22} />
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
      <div
        style={{
          position: "absolute",
          left: 80,
          bottom: 80,
          maxWidth: 520,
          opacity: tagP,
          transform: `translateY(${interpolate(tagP, [0, 1], [20, 0])}px)`,
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 18px", borderRadius: 999, background: theme.colors.mintWash, color: theme.colors.mint, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 22 }}>
          <CheckIcon size={22} />
          Invitations
        </div>
        <div style={{ fontFamily: theme.fonts.display, fontSize: 48, color: theme.colors.onyx, lineHeight: 1.05, marginTop: 14, letterSpacing: "-0.02em" }}>
          Directement <br />
          <span style={{ color: theme.colors.mint }}>dans leur poche.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

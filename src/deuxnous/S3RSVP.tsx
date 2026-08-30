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
  const bubbleP = spring({ frame, fps, config: theme.spring.snap });
  // Click ripple sur le lien 32-44
  const ripple = interpolate(frame, [32, 46], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Téléphone plein écran : 50-70
  const phoneT = interpolate(frame, [50, 70], [0, 1], { easing: Easing.inOut(Easing.bezier(0.83, 0, 0.17, 1)), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Page welcome 70-100, RSVP 100-140, Billet 140-200
  const welcP = spring({ frame: frame - 70, fps, config: theme.spring.snap });
  const rsvpP = spring({ frame: frame - 100, fps, config: theme.spring.snap });
  const ticketP = spring({ frame: frame - 142, fps, config: theme.spring.punch });
  // shimmer du billet (radial qui pulse)
  const shine = Math.sin(frame / 8) * 0.5 + 0.5;

  // Typing numéro
  const numProgress = interpolate(frame, [112, 142], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const numText = "06 12 34 56 78".slice(0, Math.floor(numProgress * 14));
  // numProgress * 14 may exceed; clamp:
  const numDisplay = numProgress >= 1 ? "06 12 34 56 78" : numText;

  // Tagline (apparaît après le billet, en bas, hors du téléphone)
  const tagP = spring({ frame: frame - 180, fps, config: theme.spring.punch });

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
            {/* Avatar WhatsApp aligné avec le top du contenu du card (Sarah · 14:02) */}
            <div style={{ paddingTop: 8 }}>
              <WhatsAppIcon size={72} />
            </div>
            <AppCard width={1280} pad={36} radius={40} shadow={theme.shadow.lift}>
              <div style={{ fontFamily: theme.fonts.body, fontSize: 26, color: theme.colors.onyxSoft, marginBottom: 8, fontWeight: 600 }}>Sarah · 14:02</div>
              <div style={{ fontFamily: theme.fonts.body, fontSize: 36, color: theme.colors.onyx, marginBottom: 22, fontWeight: 500, lineHeight: 1.25 }}>
                Coucou la famille 💍 On a tout préparé sur Deuxnous, c'est juste ici :
              </div>
              <div
                style={{
                  display: "inline-block",
                  padding: "20px 32px",
                  borderRadius: 22,
                  background: theme.colors.lavenderWash,
                  color: theme.colors.lavender,
                  fontFamily: theme.fonts.body,
                  fontWeight: 800,
                  fontSize: 38,
                }}
              >
                deuxnous.app/mariage/jean-sarah
              </div>
            </AppCard>
          </div>
          {/* Click ripple — sur la pill "deuxnous.app/..." (en bas du card) */}
          {frame >= 32 ? (
            <div
              style={{
                position: "absolute",
                left: 430,
                top: 200,
                width: 120 * ripple,
                height: 120 * ripple,
                borderRadius: "50%",
                border: `4px solid ${theme.colors.lavender}`,
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
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  padding: 24,
                  opacity: 1 - rsvpP,
                  boxSizing: "border-box",
                }}
              >
                <div style={{ fontFamily: theme.fonts.display, fontSize: 38, color: theme.colors.onyx, fontWeight: 700, lineHeight: 1.05 }}>
                  Bienvenue, <span style={{ color: theme.colors.lavender }}>Jean & Sarah</span>
                </div>
                <div style={{ fontFamily: theme.fonts.body, fontSize: 18, color: theme.colors.onyxSoft, marginTop: 6, fontWeight: 500 }}>
                  22 juin 2026 · 17h00 · Cotonou
                </div>
                <div style={{ height: 28 }} />
                <AppCard width={PHONE_W - 48} pad={20} radius={22} bg={theme.colors.lavenderWash} shadow="none">
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 24, background: theme.colors.lavender, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <HeartIcon size={26} color="#FFFFFF" />
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
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  padding: 24,
                  opacity: rsvpP * (1 - ticketP),
                  boxSizing: "border-box",
                }}
              >
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
                      <div style={{ fontFamily: theme.fonts.body, fontSize: 14, letterSpacing: "0.2em", opacity: 0.85, fontWeight: 700 }}>DEUXNOUS · VIP</div>
                      <StarIcon size={28} color="#FFD76A" />
                    </div>
                    <div style={{ fontFamily: theme.fonts.display, fontSize: 38, fontWeight: 700, marginTop: 8, lineHeight: 1.05 }}>
                      Jean & Sarah
                    </div>
                    <div style={{ fontFamily: theme.fonts.body, fontSize: 16, opacity: 0.85, marginTop: 4, fontWeight: 600 }}>
                      22 JUIN 2026 · COTONOU
                    </div>
                    <div
                      style={{
                        marginTop: 18,
                        padding: "12px 14px",
                        background: "rgba(255,255,255,0.15)",
                        borderRadius: 14,
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                      }}
                    >
                      <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
                        {Array.from({ length: 18 }).map((_, i) => (
                          <div key={i} style={{ width: 3, height: i % 3 === 0 ? 22 : i % 2 === 0 ? 16 : 12, background: "#FFFFFF" }} />
                        ))}
                      </div>
                      <div>
                        <div style={{ fontFamily: theme.fonts.mono, fontSize: 12, opacity: 0.7, fontWeight: 600 }}>CODE</div>
                        <div style={{ fontFamily: theme.fonts.mono, fontSize: 22, fontWeight: 700, letterSpacing: "0.16em" }}>JNS-26-AB7C</div>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      marginTop: 16,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      color: theme.colors.mint,
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

      {/* Tagline bas-gauche après billet — sous le téléphone (top 90 + height 720 = bottom 810) */}
      <div
        style={{
          position: "absolute",
          left: 80,
          bottom: 70,
          maxWidth: 600,
          opacity: tagP,
          transform: `translateY(${interpolate(tagP, [0, 1], [30, 0])}px)`,
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "16px 28px", borderRadius: 999, background: theme.colors.mintWash, color: theme.colors.mint, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 30 }}>
          <CheckIcon size={30} />
          Invitations
        </div>
        <div style={{ fontFamily: theme.fonts.display, fontSize: 78, color: theme.colors.onyx, lineHeight: 1, marginTop: 18, letterSpacing: "-0.03em", fontWeight: 700 }}>
          Directement <br />
          <span style={{ color: theme.colors.mint }}>dans leur poche.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

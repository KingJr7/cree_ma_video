import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { theme, ST } from "./theme";
import { SpringPop, TextSlideFade } from "./motion";
import { BackgroundParticles } from "./particles";
import { PhoneFrame } from "./PhoneFrame";
import { AppCard, AppBottomBar, OnyxButton } from "./ui";
import { CameraIcon } from "./icons";
import { Polaroid } from "./extras";

// S5 Album (28-34s, frames locales 0..180)
// Téléphone galerie à gauche, polaroids live à droite.

const PHONE_W = 380;
const PHONE_H = 780;

const LIVE_PHOTOS = [
  { seed: 0, caption: "Les mariés", x: 980, y: 200, rot: -7, size: 180, delay: 30 },
  { seed: 1, caption: "Tonton Bruno", x: 1200, y: 190, rot: 5, size: 170, delay: 50 },
  { seed: 2, caption: "L'alliance", x: 1420, y: 210, rot: -3, size: 170, delay: 70 },
  { seed: 3, caption: "Premier bisou", x: 1640, y: 200, rot: 6, size: 170, delay: 90 },
  { seed: 4, caption: "La famille", x: 1030, y: 460, rot: -5, size: 170, delay: 110 },
  { seed: 5, caption: "Les amis", x: 1240, y: 470, rot: 4, size: 170, delay: 130 },
  { seed: 6, caption: "Bénédiction", x: 1450, y: 460, rot: -3, size: 170, delay: 150 },
  { seed: 5, caption: "Tout le monde danse", x: 1660, y: 470, rot: 7, size: 170, delay: 165 },
];

const GRID = [
  { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 },
  { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 },
  { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 },
];

export const S5Album: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneP = spring({ frame, fps, config: theme.spring.bouncy });
  const counterP = spring({ frame: frame - 30, fps, config: theme.spring.uiPop });
  const arrived = LIVE_PHOTOS.filter((p) => frame >= p.delay).length;

  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      <BackgroundParticles count={16} />

      {/* Titre scène — à droite */}
      <div style={{ position: "absolute", right: 100, top: 80, maxWidth: 880, textAlign: "right" }}>
        <TextSlideFade from={6} delay={0}>
          <div style={{ fontFamily: theme.fonts.body, fontSize: 28, color: theme.colors.primary, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 800 }}>
            Album en direct
          </div>
        </TextSlideFade>
        <TextSlideFade from={10} delay={0} yOffset={30}>
          <div style={{ fontFamily: theme.fonts.display, fontSize: 110, color: theme.colors.text, letterSpacing: "-0.03em", lineHeight: 1.02, marginTop: 14, fontWeight: 700 }}>
            Vos invités <span style={{ color: theme.colors.primary }}>partagent</span> en direct.
          </div>
        </TextSlideFade>
      </div>

      {/* Téléphone à gauche */}
      <div
        style={{
          position: "absolute",
          left: 90,
          top: "50%",
          transform: `translate(0, calc(-50% + ${interpolate(phoneP, [0, 1], [60, 0])}px)) scale(${interpolate(phoneP, [0, 1], [0.9, 1])})`,
          opacity: phoneP,
        }}
      >
        <PhoneFrame width={PHONE_W} height={PHONE_H}>
          <div style={{ position: "absolute", inset: 0, paddingTop: 50, paddingBottom: 0, boxSizing: "border-box" }}>
            <div style={{ padding: `14px ${PHONE_W * 0.06}px` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontFamily: theme.fonts.display, fontSize: 30, color: theme.colors.onyx, fontWeight: 700 }}>Galerie</div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 12px",
                    borderRadius: 999,
                    background: theme.colors.primaryWash,
                    color: theme.colors.primary,
                    fontFamily: theme.fonts.body,
                    fontSize: 13,
                    fontWeight: 800,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      background: theme.colors.primary,
                      boxShadow: `0 0 ${6 + Math.sin(frame / 4) * 4}px ${theme.colors.primary}`,
                    }}
                  />
                  EN DIRECT
                </div>
              </div>
              <div style={{ fontFamily: theme.fonts.body, fontSize: 14, color: theme.colors.onyxSoft, marginTop: 4, fontWeight: 500 }}>
                {arrived} photos partagées · aujourd'hui
              </div>
            </div>

            <div style={{ padding: `16px ${PHONE_W * 0.06}px` }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {GRID.map((cell, i) => {
                  const liveIndex = i - 6;
                  const show = i < 6 || (liveIndex >= 0 && frame >= LIVE_PHOTOS[liveIndex]?.delay + 20);
                  return (
                    <SpringPop key={i} from={i < 6 ? 30 + i * 3 : (LIVE_PHOTOS[liveIndex]?.delay + 20) || 0} config="bouncy" scaleFrom={0.4}>
                      <div
                        style={{
                          aspectRatio: "1 / 1",
                          background: i < 6 ? "linear-gradient(135deg, #FFE2D6, #FFD4D4)" : theme.colors.bgSoft,
                          borderRadius: 10,
                          overflow: "hidden",
                          opacity: show ? 1 : 0,
                          boxShadow: theme.shadow.card,
                        }}
                      >
                        <Polaroid width={100} seed={i} rotation={0} caption="" bg={i < 6 ? undefined : "transparent"} />
                      </div>
                    </SpringPop>
                  );
                })}
              </div>
            </div>

            <div style={{ padding: `0 ${PHONE_W * 0.06}px` }}>
              <OnyxButton width={PHONE_W - PHONE_W * 0.12} height={56} style={{ fontSize: 17 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
                  <CameraIcon size={22} color={theme.colors.onyx} />
                  Ajouter une photo
                </div>
              </OnyxButton>
            </div>

            <AppBottomBar active="gallery" width={PHONE_W} />
          </div>
        </PhoneFrame>
      </div>

      {/* Polaroids qui tombent à droite */}
      {LIVE_PHOTOS.map((p, i) => {
        const local = frame - p.delay;
        if (local < 0) return null;
        const enter = spring({ frame: local, fps, config: theme.spring.bouncy });
        const ty = interpolate(enter, [0, 1], [p.y - 700, p.y]);
        const flash = 1 - interpolate(local, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const rot = p.rot + Math.sin(local / 8) * 0.4;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x,
              top: 0,
              opacity: enter,
              transform: `translateY(${ty}px) rotate(${rot}deg)`,
              zIndex: i,
            }}
          >
            <Polaroid width={p.size} seed={p.seed} rotation={0} caption={p.caption} />
            {flash > 0 ? (
              <div
                style={{
                  position: "absolute",
                  inset: -20,
                  background: `radial-gradient(50% 50% at 50% 50%, rgba(255,255,255,${flash * 0.9}) 0%, transparent 70%)`,
                  pointerEvents: "none",
                }}
              />
            ) : null}
          </div>
        );
      })}

      {/* Compteur LIVE */}
      <div
        style={{
          position: "absolute",
          right: 100,
          top: 30,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 22px",
          borderRadius: 999,
          background: "rgba(29,211,176,0.15)",
          color: theme.colors.primary,
          fontFamily: theme.fonts.body,
          fontWeight: 800,
          fontSize: 24,
          opacity: counterP,
          transform: `scale(${interpolate(counterP, [0, 1], [0.7, 1])})`,
        }}
      >
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            background: theme.colors.primary,
            boxShadow: `0 0 ${10 + Math.sin(frame / 4) * 6}px ${theme.colors.primary}`,
          }}
        />
        {arrived} PHOTOS · EN DIRECT
      </div>
    </AbsoluteFill>
  );
};

import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { theme } from "./theme";
import { PhoneFrame } from "./PhoneFrame";
import { AppCard, AppBottomBar, OnyxButton } from "./ui";
import { CheckIcon, CameraIcon } from "./icons";
import { Polaroid } from "./extras";

// S5Album — L'Album en direct (5.5 à 12.5s sur 40s, frames locales 0..210)
// Gauche : téléphone avec la galerie plein écran. Droite : polaroids qui
// atterrissent en temps réel avec compteur "X photos ajoutées".

const PHONE_W = 380;
const PHONE_H = 780;

// 12 polaroids "live" : chacun a un délai, une position, une rotation, une taille
const LIVE_PHOTOS = [
  { seed: 0, caption: "Les mariés", x: 980, y: 200, rot: -7, size: 180, delay: 30 },
  { seed: 1, caption: "Tonton Bruno", x: 1200, y: 190, rot: 5, size: 170, delay: 50 },
  { seed: 2, caption: "L'alliance", x: 1420, y: 210, rot: -3, size: 170, delay: 70 },
  { seed: 3, caption: "Premier bisou", x: 1640, y: 200, rot: 6, size: 170, delay: 90 },
  { seed: 4, caption: "La famille", x: 1030, y: 460, rot: -5, size: 170, delay: 110 },
  { seed: 5, caption: "Les amis", x: 1240, y: 470, rot: 4, size: 170, delay: 130 },
  { seed: 6, caption: "Bénédiction", x: 1450, y: 460, rot: -3, size: 170, delay: 150 },
  { seed: 7, caption: "Cake time", x: 1660, y: 470, rot: 7, size: 170, delay: 165 },
  { seed: 5, caption: "Tout le monde danse", x: 1080, y: 720, rot: -6, size: 170, delay: 175 },
  { seed: 1, caption: "Awa & co", x: 1290, y: 720, rot: 4, size: 170, delay: 185 },
  { seed: 2, caption: "Fin de soirée", x: 1500, y: 720, rot: -4, size: 170, delay: 192 },
  { seed: 4, caption: "Souvenir", x: 1700, y: 720, rot: 5, size: 170, delay: 198 },
];

// Position des mini-polaroids dans la galerie téléphone (grille 3x3)
const GRID = [
  { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 },
  { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 },
  { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 },
];

export const S5Album: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneP = spring({ frame, fps, config: theme.spring.punch });
  const titleP = spring({ frame: frame - 6, fps, config: theme.spring.punch });
  const tagP = spring({ frame: frame - 180, fps, config: theme.spring.snap });

  // Photos déjà arrivées
  const arrived = LIVE_PHOTOS.filter((p) => frame >= p.delay).length;

  // Pulse du compteur
  const counterP = spring({ frame: frame - 30, fps, config: theme.spring.punch });

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

      {/* Titre scène — à droite, au-dessus des polaroids */}
      <div
        style={{
          position: "absolute",
          right: 100,
          top: 80,
          maxWidth: 880,
          textAlign: "right",
          opacity: titleP,
          transform: `translateX(${interpolate(titleP, [0, 1], [30, 0])}px)`,
        }}
      >
        <div style={{ fontFamily: theme.fonts.body, fontSize: 28, color: theme.colors.mint, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700 }}>
          Album en direct
        </div>
        <div style={{ fontFamily: theme.fonts.display, fontSize: 110, color: theme.colors.onyx, letterSpacing: "-0.03em", lineHeight: 1.02, marginTop: 14, fontWeight: 700 }}>
          Vos invités <span style={{ color: theme.colors.mint }}>partagent</span> en direct.
        </div>
      </div>

      {/* Téléphone à gauche avec la galerie */}
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
            {/* Header */}
            <div style={{ padding: `14px ${PHONE_W * 0.06}px`, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ transform: "scale(0.16)", transformOrigin: "left center" }}>
                {/* (logo placeholder) */}
              </div>
              <div style={{ fontFamily: theme.fonts.display, fontSize: 22, color: theme.colors.onyx, fontWeight: 700, marginLeft: -10 }}>
                Deux<span style={{ color: theme.colors.lavender }}>nous</span>
              </div>
            </div>

            {/* Titre galerie + compteur live */}
            <div style={{ padding: `0 ${PHONE_W * 0.06}px` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontFamily: theme.fonts.display, fontSize: 30, color: theme.colors.onyx, fontWeight: 700 }}>
                  Galerie
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 12px",
                    borderRadius: 999,
                    background: theme.colors.mintWash,
                    color: theme.colors.mint,
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
                      background: theme.colors.mint,
                      boxShadow: `0 0 ${6 + Math.sin(frame / 4) * 4}px ${theme.colors.mint}`,
                    }}
                  />
                  EN DIRECT
                </div>
              </div>
              <div style={{ fontFamily: theme.fonts.body, fontSize: 14, color: theme.colors.onyxSoft, marginTop: 4, fontWeight: 500 }}>
                {arrived} photos partagées · aujourd'hui
              </div>
            </div>

            {/* Grille 3x3 — les photos apparaissent au fur et à mesure */}
            <div style={{ padding: `16px ${PHONE_W * 0.06}px` }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 8,
                }}
              >
                {GRID.map((cell, i) => {
                  // Les 6 premières cellules (i 0-5) sont remplies au démarrage, les 3 dernières se remplissent en live
                  const liveIndex = i - 6; // -6,-5,-4,-3,-2,-1,0,1,2
                  const show = i < 6 || (liveIndex >= 0 && frame >= LIVE_PHOTOS[liveIndex]?.delay + 20);
                  const liveP = show && liveIndex >= 0 ? spring({ frame: frame - (LIVE_PHOTOS[liveIndex].delay + 20), fps, config: theme.spring.punch }) : 1;
                  return (
                    <div
                      key={i}
                      style={{
                        aspectRatio: "1 / 1",
                        background: i < 6 ? "linear-gradient(135deg, #FFE2D6, #FFD4D4)" : theme.colors.bgAlt,
                        borderRadius: 10,
                        overflow: "hidden",
                        opacity: show ? liveP : 0,
                        transform: show ? `scale(${interpolate(liveP, [0, 1], [0.4, 1])})` : "scale(0.4)",
                        boxShadow: theme.shadow.card,
                      }}
                    >
                      <Polaroid width={100} seed={i} rotation={0} caption="" bg={i < 6 ? undefined : "transparent"} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bouton ajouter une photo */}
            <div style={{ padding: `0 ${PHONE_W * 0.06}px` }}>
              <OnyxButton width={PHONE_W - PHONE_W * 0.12} height={56} style={{ fontSize: 17 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
                  <CameraIcon size={22} color="#FFFFFF" />
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
        const enter = spring({ frame: local, fps, config: theme.spring.punch });
        const startY = p.y - 700;
        const ty = interpolate(enter, [0, 1], [startY, p.y]);
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

      {/* Compteur LIVE au-dessus de la zone polaroid */}
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
          background: theme.colors.mintWash,
          color: theme.colors.mint,
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
            background: theme.colors.mint,
            boxShadow: `0 0 ${10 + Math.sin(frame / 4) * 6}px ${theme.colors.mint}`,
          }}
        />
        {arrived} PHOTOS · EN DIRECT
      </div>
    </AbsoluteFill>
  );
};

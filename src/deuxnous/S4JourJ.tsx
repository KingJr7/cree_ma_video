import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { theme } from "./theme";
import { PhoneFrame } from "./PhoneFrame";
import { AppCard, AppBottomBar, OnyxButton } from "./ui";
import { CheckIcon, GiftIcon, HeartIcon, CameraIcon, ClockIcon } from "./icons";
import { Polaroid } from "./extras";

// S4 — Le Jour J (20 à 35s, frames locales 0..450)
// Layout : cagnotte à gauche, galerie polaroids + horloge à droite.

const PHONE_W = 380;

const DONATIONS = [
  { id: 1, name: "Cousine Awa", amount: 15000, delay: 30 },
  { id: 2, name: "Tonton Bruno", amount: 50000, delay: 70 },
  { id: 3, name: "Marraine Flo", amount: 25000, delay: 110 },
  { id: 4, name: "Collègue Marc", amount: 10000, delay: 150 },
  { id: 5, name: "Maman", amount: 100000, delay: 190 },
  { id: 6, name: "Voisine Aïcha", amount: 15000, delay: 230 },
];
const GOAL = 350000;
const TOTAL = DONATIONS.reduce((s, d) => s + d.amount, 0);

const POLAROIDS = [
  { caption: "Jean ❤️ Sarah", seed: 0, x: 1020, y: 220, rot: -6, size: 170, delay: 80, dur: 360 },
  { caption: "Premier bisou", seed: 1, x: 1220, y: 230, rot: 4, size: 170, delay: 130, dur: 360 },
  { caption: "La famille", seed: 2, x: 1430, y: 240, rot: -3, size: 170, delay: 170, dur: 360 },
  { caption: "Bénédiction", seed: 3, x: 1620, y: 230, rot: 6, size: 170, delay: 210, dur: 360 },
  { caption: "Cake time", seed: 4, x: 1130, y: 470, rot: -8, size: 170, delay: 250, dur: 360 },
  { caption: "Tout le monde danse", seed: 5, x: 1350, y: 480, rot: 5, size: 170, delay: 290, dur: 360 },
  { caption: "Souvenir", seed: 0, x: 1560, y: 470, rot: -2, size: 170, delay: 330, dur: 360 },
];

export const S4JourJ: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Don courant
  const currentDonation = DONATIONS.find((d) => frame >= d.delay && frame < d.delay + 90);

  // Pourcentage cagnotte animé
  const pct = useMemo(() => {
    let sum = 0;
    for (const d of DONATIONS) {
      const local = interpolate(frame, [d.delay, d.delay + 30], [0, d.amount], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      sum += local;
    }
    return Math.min(1, sum / GOAL);
  }, [frame]);

  // Popup "+X FCFA" : monte et disparaît
  const popupP = currentDonation ? spring({ frame: frame - currentDonation.delay, fps, config: theme.spring.bouncy }) : 0;
  const popupY = currentDonation ? interpolate(frame - currentDonation.delay, [0, 90], [0, -120], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const popupO = currentDonation ? 1 - interpolate(frame - currentDonation.delay, [60, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;

  // Horloge : aiguille minute qui pivote jusqu'à 12
  const clockAngle = interpolate(frame, [180, 360], [-90, 0], { easing: Easing.inOut(Easing.bezier(0.65, 0, 0.35, 1)), extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${theme.colors.line} 1.5px, transparent 1.5px)`,
          backgroundSize: "32px 32px",
          opacity: 0.45,
        }}
      />

      {/* Titre */}
      <div
        style={{
          position: "absolute",
          top: 56,
          left: 80,
          opacity: spring({ frame, fps, config: theme.spring.smooth }),
          transform: `translateY(${interpolate(spring({ frame, fps, config: theme.spring.smooth }), [0, 1], [-20, 0])}px)`,
        }}
      >
        <div style={{ fontFamily: theme.fonts.body, fontSize: 22, color: theme.colors.mint, letterSpacing: "0.18em", textTransform: "uppercase" }}>
          Le Jour J · en direct
        </div>
        <div style={{ fontFamily: theme.fonts.display, fontSize: 68, color: theme.colors.onyx, letterSpacing: "-0.03em", lineHeight: 1.05, marginTop: 6 }}>
          Tout est <span style={{ color: theme.colors.mint }}>en direct.</span>
        </div>
      </div>

      {/* LEFT — Cagnotte téléphone */}
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 240,
          opacity: spring({ frame: frame - 4, fps, config: theme.spring.bouncy }),
          transform: `translateY(${interpolate(spring({ frame: frame - 4, fps, config: theme.spring.bouncy }), [0, 1], [40, 0])}px)`,
        }}
      >
        <PhoneFrame width={PHONE_W} height={760}>
          <div style={{ position: "absolute", inset: 0, paddingTop: 50, paddingBottom: 0, boxSizing: "border-box" }}>
            <div style={{ padding: `14px ${PHONE_W * 0.06}px` }}>
              <div style={{ fontFamily: theme.fonts.body, fontSize: 12, color: theme.colors.mint, letterSpacing: "0.18em", textTransform: "uppercase" }}>
                Cagnotte
              </div>
              <div style={{ fontFamily: theme.fonts.display, fontSize: 44, color: theme.colors.onyx, fontWeight: 700, marginTop: 4, letterSpacing: "-0.03em" }}>
                {TOTAL.toLocaleString("fr-FR")} <span style={{ fontSize: 22, color: theme.colors.onyxSoft }}>FCFA</span>
              </div>
              <div style={{ fontFamily: theme.fonts.body, fontSize: 13, color: theme.colors.onyxSoft, marginTop: 2 }}>
                sur {GOAL.toLocaleString("fr-FR")} FCFA · {Math.round(pct * 100)}%
              </div>
            </div>

            {/* Jauge */}
            <div style={{ padding: `0 ${PHONE_W * 0.06}px` }}>
              <div
                style={{
                  width: "100%",
                  height: 14,
                  background: theme.colors.bgAlt,
                  borderRadius: 7,
                  overflow: "hidden",
                  border: `1px solid ${theme.colors.line}`,
                }}
              >
                <div
                  style={{
                    width: `${pct * 100}%`,
                    height: "100%",
                    background: `linear-gradient(90deg, ${theme.colors.mint}, #4DE0BE)`,
                    borderRadius: 7,
                  }}
                />
              </div>

              <div style={{ height: 18 }} />

              {/* Liste des dons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {DONATIONS.map((d) => {
                  const show = frame >= d.delay + 10;
                  return (
                    <div
                      key={d.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "8px 10px",
                        background: theme.colors.bgAlt,
                        borderRadius: 12,
                        opacity: show ? 1 : 0,
                        transform: show ? "translateX(0)" : "translateX(-12px)",
                        transition: "all 0.3s",
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 14,
                          background: theme.colors.mintWash,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <GiftIcon size={18} />
                      </div>
                      <div style={{ flex: 1, fontFamily: theme.fonts.body, fontSize: 14, color: theme.colors.onyx, fontWeight: 600 }}>
                        {d.name}
                      </div>
                      <div style={{ fontFamily: theme.fonts.body, fontSize: 14, color: theme.colors.mint, fontWeight: 700 }}>
                        +{d.amount.toLocaleString("fr-FR")} F
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <AppBottomBar active="cagnotte" width={PHONE_W} />
          </div>
        </PhoneFrame>

        {/* Popup "+X FCFA" qui monte et disparaît */}
        {currentDonation ? (
          <div
            style={{
              position: "absolute",
              right: -40,
              top: 230,
              opacity: popupO,
              transform: `translateY(${popupY}px) scale(${interpolate(popupP, [0, 1], [0.6, 1])})`,
              background: theme.colors.mint,
              color: "#FFFFFF",
              padding: "10px 18px",
              borderRadius: 16,
              fontFamily: theme.fonts.body,
              fontWeight: 700,
              fontSize: 22,
              boxShadow: theme.shadow.lift,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <GiftIcon size={20} color="#FFFFFF" />
            +{currentDonation.amount.toLocaleString("fr-FR")} FCFA
          </div>
        ) : null}
      </div>

      {/* RIGHT — Galerie polaroids + horloge */}
      <div
        style={{
          position: "absolute",
          right: 60,
          top: 200,
          width: 820,
          height: 800,
        }}
      >
        {/* Polaroids (tombent du haut, s'empilent) */}
        {POLAROIDS.map((p, i) => {
          const local = frame - p.delay;
          if (local < 0) return null;
          const enter = spring({ frame: local, fps, config: theme.spring.bouncy });
          const finalY = p.y;
          const startY = p.y - 700;
          const ty = interpolate(enter, [0, 1], [startY, finalY]);
          const fadeIn = enter;
          const rot = p.rot + Math.sin(local / 8) * 0.5;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: p.x,
                top: 0,
                opacity: fadeIn,
                transform: `translateY(${ty}px) rotate(${rot}deg)`,
                zIndex: i,
              }}
            >
              <Polaroid width={p.size} seed={p.seed} rotation={0} caption={p.caption} />
            </div>
          );
        })}

        {/* Horloge "jour J ouvert" */}
        <div
          style={{
            position: "absolute",
            left: 1080,
            top: 740,
            display: "flex",
            alignItems: "center",
            gap: 16,
            opacity: spring({ frame: frame - 180, fps, config: theme.spring.bouncy }),
            transform: `translateY(${interpolate(spring({ frame: frame - 180, fps, config: theme.spring.bouncy }), [0, 1], [30, 0])}px)`,
          }}
        >
          <div
            style={{
              width: 110,
              height: 110,
              borderRadius: 55,
              background: "#FFFFFF",
              border: `4px solid ${theme.colors.lavender}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: theme.shadow.card,
              position: "relative",
            }}
          >
            {/* Aiguille minute */}
            <div
              style={{
                position: "absolute",
                width: 4,
                height: 38,
                background: theme.colors.lavender,
                borderRadius: 2,
                transformOrigin: "bottom center",
                transform: `translateY(-19px) rotate(${clockAngle}deg)`,
                bottom: "50%",
                left: "calc(50% - 2px)",
              }}
            />
            {/* Aiguille heure */}
            <div
              style={{
                position: "absolute",
                width: 4,
                height: 26,
                background: theme.colors.onyx,
                borderRadius: 2,
                transformOrigin: "bottom center",
                transform: `translateY(-13px) rotate(0deg)`,
                bottom: "50%",
                left: "calc(50% - 2px)",
              }}
            />
            <div
              style={{
                position: "absolute",
                width: 8,
                height: 8,
                borderRadius: 4,
                background: theme.colors.lavender,
              }}
            />
          </div>
          <div>
            <div style={{ fontFamily: theme.fonts.body, fontSize: 13, color: theme.colors.lavender, letterSpacing: "0.18em", textTransform: "uppercase" }}>
              Galerie
            </div>
            <div style={{ fontFamily: theme.fonts.display, fontSize: 28, color: theme.colors.onyx, fontWeight: 700, letterSpacing: "-0.02em" }}>
              Le jour J vient de s'ouvrir
            </div>
          </div>
        </div>
      </div>

      {/* Tagline bas */}
      <div
        style={{
          position: "absolute",
          left: 80,
          bottom: 60,
          opacity: spring({ frame: frame - 220, fps, config: theme.spring.smooth }),
          transform: `translateY(${interpolate(spring({ frame: frame - 220, fps, config: theme.spring.smooth }), [0, 1], [20, 0])}px)`,
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: 999, background: theme.colors.lavenderWash, color: theme.colors.lavender, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
          <CheckIcon size={18} />
          Cagnotte intégrée
        </div>
        <div style={{ fontFamily: theme.fonts.display, fontSize: 32, color: theme.colors.onyx, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
          Album collaboratif <span style={{ color: theme.colors.mint }}>en direct</span>.
        </div>
      </div>
    </AbsoluteFill>
  );
};

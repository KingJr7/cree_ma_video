import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { theme, ST } from "./theme";
import { SpringPop, TextSlideFade } from "./motion";
import { BackgroundParticles } from "./particles";
import { PhoneFrame } from "./PhoneFrame";
import { AppCard, AppBottomBar, OnyxButton } from "./ui";
import { CheckIcon, GiftIcon } from "./icons";
import { Polaroid } from "./extras";

// S4 Jour J (18-28s, frames locales 0..300)
// Cagnotte à gauche, polaroids + horloge à droite, tagline à droite.

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
  { caption: "Jean ❤️ Sarah", seed: 0, x: 1020, y: 240, rot: -6, size: 150, delay: 80 },
  { caption: "Premier bisou", seed: 1, x: 1200, y: 250, rot: 4, size: 150, delay: 130 },
  { caption: "La famille", seed: 2, x: 1390, y: 245, rot: -3, size: 150, delay: 170 },
  { caption: "Bénédiction", seed: 3, x: 1580, y: 240, rot: 6, size: 150, delay: 210 },
  { caption: "Cake time", seed: 4, x: 1100, y: 460, rot: -8, size: 150, delay: 250 },
  { caption: "Tout le monde danse", seed: 5, x: 1290, y: 470, rot: 5, size: 150, delay: 280 },
];

export const S4JourJ: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneP = spring({ frame: frame - 4, fps, config: theme.spring.bouncy });

  // Pourcentage cagnotte animé
  let sum = 0;
  for (const d of DONATIONS) {
    const local = interpolate(frame, [d.delay, d.delay + 30], [0, d.amount], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    sum += local;
  }
  const pct = Math.min(1, sum / GOAL);

  // Popup don
  const currentDonation = DONATIONS.find((d) => frame >= d.delay && frame < d.delay + 90);
  const popupP = currentDonation ? spring({ frame: frame - currentDonation.delay, fps, config: theme.spring.bouncy }) : 0;
  const popupY = currentDonation ? interpolate(frame - currentDonation.delay, [0, 90], [0, -120], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const popupO = currentDonation ? 1 - interpolate(frame - currentDonation.delay, [60, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;

  const clockAngle = interpolate(frame, [180, 280], [-90, 0], { easing: Easing.inOut(Easing.bezier(...theme.easing.camera)), extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      <BackgroundParticles count={18} />

      {/* Titre haut-gauche */}
      <div style={{ position: "absolute", top: 60, left: 80, maxWidth: 700 }}>
        <TextSlideFade from={0} delay={0}>
          <div style={{ fontFamily: theme.fonts.body, fontSize: 28, color: theme.colors.primary, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 800 }}>
            Le Jour J · en direct
          </div>
        </TextSlideFade>
        <TextSlideFade from={4} delay={0} yOffset={30}>
          <div style={{ fontFamily: theme.fonts.display, fontSize: 96, color: theme.colors.text, letterSpacing: "-0.03em", lineHeight: 1.02, marginTop: 8, fontWeight: 700 }}>
            Tout est <span style={{ color: theme.colors.primary }}>en direct.</span>
          </div>
        </TextSlideFade>
      </div>

      {/* Téléphone cagnotte à gauche */}
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 240,
          opacity: phoneP,
          transform: `translateY(${interpolate(phoneP, [0, 1], [60, 0])}px)`,
        }}
      >
        <PhoneFrame width={PHONE_W} height={760}>
          <div style={{ position: "absolute", inset: 0, paddingTop: 50, paddingBottom: 0, boxSizing: "border-box" }}>
            <div style={{ padding: `16px ${PHONE_W * 0.06}px` }}>
              <div style={{ fontFamily: theme.fonts.body, fontSize: 15, color: theme.colors.primary, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 800 }}>
                Cagnotte
              </div>
              <div style={{ fontFamily: theme.fonts.display, fontSize: 56, color: theme.colors.onyx, fontWeight: 700, marginTop: 6, letterSpacing: "-0.03em" }}>
                {TOTAL.toLocaleString("fr-FR")} <span style={{ fontSize: 28, color: theme.colors.onyxSoft }}>FCFA</span>
              </div>
              <div style={{ fontFamily: theme.fonts.body, fontSize: 16, color: theme.colors.onyxSoft, marginTop: 4, fontWeight: 500 }}>
                sur {GOAL.toLocaleString("fr-FR")} FCFA · {Math.round(pct * 100)}%
              </div>
            </div>

            <div style={{ padding: `0 ${PHONE_W * 0.06}px` }}>
              <div style={{ width: "100%", height: 18, background: theme.colors.bgSoft, borderRadius: 9, overflow: "hidden", border: `1px solid ${theme.colors.line}` }}>
                <div style={{ width: `${pct * 100}%`, height: "100%", background: `linear-gradient(90deg, ${theme.colors.primary}, #4DE0BE)`, borderRadius: 9 }} />
              </div>
              <div style={{ height: 22 }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {DONATIONS.map((d) => {
                  const show = frame >= d.delay + 10;
                  return (
                    <SpringPop key={d.id} from={d.delay + 10} config="uiPop" scaleFrom={0.5}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "10px 12px",
                          background: theme.colors.bgSoft,
                          borderRadius: 14,
                          opacity: show ? 1 : 0,
                        }}
                      >
                        <div style={{ width: 36, height: 36, borderRadius: 18, background: theme.colors.primaryWash, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <GiftIcon size={22} />
                        </div>
                        <div style={{ flex: 1, fontFamily: theme.fonts.body, fontSize: 17, color: theme.colors.onyx, fontWeight: 700 }}>{d.name}</div>
                        <div style={{ fontFamily: theme.fonts.body, fontSize: 17, color: theme.colors.primary, fontWeight: 800 }}>+{d.amount.toLocaleString("fr-FR")} F</div>
                      </div>
                    </SpringPop>
                  );
                })}
              </div>
            </div>
            <AppBottomBar active="cagnotte" width={PHONE_W} />
          </div>
        </PhoneFrame>

        {currentDonation ? (
          <div
            style={{
              position: "absolute",
              right: -50,
              top: 250,
              opacity: popupO,
              transform: `translateY(${popupY}px) scale(${interpolate(popupP, [0, 1], [0.6, 1])})`,
              background: theme.colors.primary,
              color: theme.colors.onyx,
              padding: "14px 24px",
              borderRadius: 22,
              fontFamily: theme.fonts.body,
              fontWeight: 800,
              fontSize: 28,
              boxShadow: theme.shadow.lift,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <GiftIcon size={28} color={theme.colors.onyx} />
            +{currentDonation.amount.toLocaleString("fr-FR")} FCFA
          </div>
        ) : null}
      </div>

      {/* Polaroids + horloge à droite */}
      <div style={{ position: "absolute", right: 60, top: 200, width: 820, height: 800 }}>
        {POLAROIDS.map((p, i) => {
          const local = frame - p.delay;
          if (local < 0) return null;
          const enter = spring({ frame: local, fps, config: theme.spring.bouncy });
          const ty = interpolate(enter, [0, 1], [p.y - 700, p.y]);
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
            </div>
          );
        })}

        {/* Horloge */}
        <SpringPop from={180} config="bouncy">
          <div
            style={{
              position: "absolute",
              left: 1020,
              top: 700,
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <div
              style={{
                width: 110,
                height: 110,
                borderRadius: 55,
                background: "#FFFFFF",
                border: `5px solid ${theme.colors.primary}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: theme.shadow.lift,
                position: "relative",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  width: 4,
                  height: 38,
                  background: theme.colors.primary,
                  borderRadius: 2,
                  transformOrigin: "bottom center",
                  transform: `translateY(-19px) rotate(${clockAngle}deg)`,
                  bottom: "50%",
                  left: "calc(50% - 2px)",
                }}
              />
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
              <div style={{ position: "absolute", width: 8, height: 8, borderRadius: 4, background: theme.colors.primary }} />
            </div>
            <div>
              <div style={{ fontFamily: theme.fonts.body, fontSize: 16, color: theme.colors.primary, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 800 }}>
                Galerie
              </div>
              <div style={{ fontFamily: theme.fonts.display, fontSize: 36, color: theme.colors.text, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.05, marginTop: 2 }}>
                Le jour J s'ouvre
              </div>
            </div>
          </div>
        </SpringPop>
      </div>

      {/* Tagline bas-droite */}
      <div style={{ position: "absolute", right: 100, bottom: 60, maxWidth: 720, textAlign: "right" }}>
        <SpringPop from={220} config="uiPop">
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 24px",
              borderRadius: 999,
              background: "rgba(29,211,176,0.15)",
              color: theme.colors.primary,
              fontFamily: theme.fonts.body,
              fontWeight: 800,
              fontSize: 24,
              marginBottom: 14,
            }}
          >
            <CheckIcon size={24} />
            Cagnotte intégrée
          </div>
        </SpringPop>
        <TextSlideFade from={228} delay={0} yOffset={30}>
          <div style={{ fontFamily: theme.fonts.display, fontSize: 56, color: theme.colors.text, letterSpacing: "-0.03em", lineHeight: 1, fontWeight: 700 }}>
            Album collaboratif <span style={{ color: theme.colors.primary }}>en direct</span>.
          </div>
        </TextSlideFade>
      </div>
    </AbsoluteFill>
  );
};
